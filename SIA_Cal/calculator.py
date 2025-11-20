from collections import defaultdict
from colorama import Fore, Style
from config import (SLAB_ELIGIBLE_PRODUCTS, PCR_ELIGIBLE_PRODUCTS, SLAB_LEVELS, 
                   STAGE_PERCENTAGES, TARIFF_RATES, EXCLUSIONS, FTTH_BEARER_RATES, 
                   LTE_BEARER_RATES, GIGA_FTTH_PACKAGES)

class IncentiveCalculator:
    def __init__(self, db_manager):
        self.db = db_manager
        self.db.create_result_table_if_not_exists()
        self.db.create_detailed_result_table_if_not_exists()
        self.db.create_ineligible_slab_table_if_not_exists()
    
    def get_pcr_by_id_or_name(self, tariff_id=None, tariff_name=None):
        """Retrieve PCR value by TARIFF_ID or TARIFF_NAME"""
        if tariff_id and tariff_id in TARIFF_RATES:
            return TARIFF_RATES[tariff_id].get('pcr', 0), TARIFF_RATES[tariff_id].get('additional', 0)
        if tariff_name:
            for tid, rate in TARIFF_RATES.items():
                if rate['name'].lower() == tariff_name.lower():
                    return rate.get('pcr', 0), rate.get('additional', 0)
        return 0, 0
    
    def calculate_slab_level(self, employee_number, sales_data, sales_chanal, calculation_type):
        """Calculate slab level for an employee using unique orders"""
        unique_orders = set()
        
        for record in sales_data:
            if (record['EMPLOYEE_NUMBER'] == employee_number and 
                record['SALES_CHANAL'] == sales_chanal and
                record.get('CONSIDER_SLAB_COUNT') == '1'):
                
                # Skip excluded customer types
                if record.get('CUSTOMER_TYPE') in EXCLUSIONS['CUSTOMER_TYPES']:
                    continue
                
                # Skip excluded BB tariffs
                if record.get('BB_TARIFF_NAME') in EXCLUSIONS['BB_TARIFF_EXCLUSIONS']:
                    continue
                    
                # For real calculations, skip terminated orders
                if calculation_type.startswith('REAL') and record['BSS_STATUS'] == 'TX':
                    continue
                    
                if record['INC_CATEGORY'] in SLAB_ELIGIBLE_PRODUCTS:
                    order_id = record.get('ORDER_LINE_OSS_ORDER_ID', 'N/A')
                    unique_orders.add(order_id)
        
        eligible_count = len(unique_orders)
        
        if eligible_count < SLAB_LEVELS['min_eligible']:
            return 0
        elif eligible_count <= SLAB_LEVELS['level1']['max']:
            return 1
        elif eligible_count <= SLAB_LEVELS['level2']['max']:
            return 2
        else:
            return 3
        
    def get_slab_rate(self, slab_level):
        """Get slab rate based on level"""
        if slab_level == 1:
            return SLAB_LEVELS['level1']['rate']
        elif slab_level == 2:
            return SLAB_LEVELS['level2']['rate']
        elif slab_level == 3:
            return SLAB_LEVELS['level3']['rate']
        return 0
    
    def calculate_bearer_commission(self, record):
        """Calculate bearer commission based on bearer type and conditions"""
        bearer_commission = 0
        
        # FTTH Bearer Calculation
        if record.get('ORDER_LINE_OSS_SERVICE_TYPE') == 'AB-FTTH' or record.get('INC_CATEGORY') == 'AB-FTTH':
            order_type = record.get('ORDER_TYPE')
            order_sub_type = record.get('ORDER_SUB_TYPE')
            promotion_name = record.get('ORDER_LINE_PROMOTION_NAME')
            bb_tariff_name = record.get('BB_TARIFF_NAME')
            
            # Check if it's Giga FTTH
            is_giga = False
            if bb_tariff_name:
                for giga_pkg in GIGA_FTTH_PACKAGES:
                    if giga_pkg in bb_tariff_name:
                        is_giga = True
                        break
            
            # Reconnection
            if order_sub_type == 'Re-Connection':
                # Check the promotion name for qualifying products
                if promotion_name == 'With BB':
                    bearer_commission += FTTH_BEARER_RATES['NORMAL']['MIGRATION']['WITH_BB']['price']
                elif promotion_name in FTTH_BEARER_RATES['NORMAL']['MIGRATION']['WITHOUT_BB']['products']:
                    bearer_commission += FTTH_BEARER_RATES['NORMAL']['MIGRATION']['WITHOUT_BB']['price']
            
            # Migration (Service Upgrade)
            elif order_type in ['Create upgrade same number', 'Service Upgrade']:
                if is_giga:
                    # Safe access for GIGA migration
                    giga_config = FTTH_BEARER_RATES.get('GIGA', {})
                    migration_config = giga_config.get('MIGRATION', {})
                    if 'products' in migration_config and promotion_name in migration_config['products']:
                        bearer_commission += migration_config.get('price', 0)
                else:  # Normal FTTH
                    if promotion_name == 'With BB':
                        bearer_commission += FTTH_BEARER_RATES['NORMAL']['MIGRATION']['WITH_BB']['price']
                    elif promotion_name in FTTH_BEARER_RATES['NORMAL']['MIGRATION']['WITHOUT_BB']['products']:
                        bearer_commission += FTTH_BEARER_RATES['NORMAL']['MIGRATION']['WITHOUT_BB']['price']
            
            # New Connection
            elif order_type == 'New Connection':
                if is_giga:
                    # Safe access for GIGA new connection
                    giga_config = FTTH_BEARER_RATES.get('GIGA', {})
                    new_conn_config = giga_config.get('NEW_CONNECTION', {})
                    if 'price' in new_conn_config:
                        bearer_commission += new_conn_config['price']
                else:  # Normal FTTH
                    if promotion_name == 'With BB':
                        bearer_commission += FTTH_BEARER_RATES['NORMAL']['NEW_CONNECTION']['WITH_BB']['price']
                    elif promotion_name in FTTH_BEARER_RATES['NORMAL']['NEW_CONNECTION']['WITHOUT_BB']['products']:
                        bearer_commission += FTTH_BEARER_RATES['NORMAL']['NEW_CONNECTION']['WITHOUT_BB']['price']
        
        # LTE Bearer Calculation
        elif record.get('INC_CATEGORY') == 'AB-LTE':
            cpe_type = record.get('CPE_TYPE')
            payment_method = record.get('LTE_PAYMENT_METHOD')
            payment_option = record.get('LTE_PAYMENT_OPTION')
            
            if cpe_type in LTE_BEARER_RATES:
                # Prepaid handling
                if payment_method == 'Prepaid':
                    bearer_commission += LTE_BEARER_RATES[cpe_type]['Prepaid']
                
                # Postpaid handling
                elif payment_method == 'Postpaid' and payment_option in LTE_BEARER_RATES[cpe_type]['Postpaid']:
                    bearer_commission += LTE_BEARER_RATES[cpe_type]['Postpaid'][payment_option]
        
        return bearer_commission

    def calculate_pcr(self, employee_number, sales_data, slab_level, sales_chanal, calculation_type, sales_month=None):
        """Calculate total PCR for an employee using unique valid orders"""
        total_pcr = 0
        bearer_commission = 0
        package_commission = 0
        sales_breakdown = defaultdict(lambda: defaultdict(list))
        
        # Initialize counters
        total_ftth = 0
        total_lte = 0
        total_peo = 0
        total_copper = 0
        active_sales = 0
        
        # Group records by order ID to prevent duplicates
        orders = defaultdict(list)
        for record in sales_data:
            if (record['EMPLOYEE_NUMBER'] == employee_number and 
                record['SALES_CHANAL'] == sales_chanal):
                order_id = record.get('ORDER_LINE_OSS_ORDER_ID', 'N/A')
                orders[order_id].append(record)
        
        for order_id, records in orders.items():
            # Use the first record for common attributes
            first_record = records[0]
            bss_status = first_record.get('BSS_STATUS')
            
            # For real calculations, skip terminated orders
            if calculation_type.startswith('REAL') and bss_status == 'TX':
                for record in records:
                    self.db.save_detailed_result(
                        employee_number=employee_number,
                        sales_chanal=sales_chanal,
                        order_id=order_id,
                        tariff_id=record.get('BB_TARIFF_ID') or record.get('V_TARIFF_ID') or record.get('PEO_TARIFF_ID'),
                        tariff_name=record.get('BB_TARIFF_NAME') or record.get('V_TARIFF_NAME') or record.get('PEO_TARIFF_NAME'),
                        inc_category=record.get('INC_CATEGORY'),
                        bss_status=bss_status,
                        pcr_amount=0,
                        bearer_commission=0,
                        calculation_type=calculation_type,
                        sales_month=sales_month,
                        service_id=record.get('SERVICE_ID'),
                        account_num=record.get('ACCOUNT_NUM'),
                        service_name=record.get('SERVICE_NAME'),
                        order_type=record.get('ORDER_TYPE'),
                        order_sub_type=record.get('ORDER_SUB_TYPE'),
                        customer_type=record.get('CUSTOMER_TYPE'),
                        performa_eligibility=record.get('PERFORMA_ELIGIBILITY'),
                        cupon_sales=record.get('CUPON_SALES')
                    )
                continue
                
            # Count active sales
            active_sales += 1
            
            # Calculate bearer commission once per order
            curr_bearer_commission = self.calculate_bearer_commission(first_record)
            bearer_commission += curr_bearer_commission
            
            # Process each product in the order
            for record in records:
                # Skip if not PCR eligible
                if (record.get('CONSIDER_PCR') != '1' or 
                    record['INC_CATEGORY'] not in PCR_ELIGIBLE_PRODUCTS):
                    continue
                    
                # Skip excluded customer types
                if record.get('CUSTOMER_TYPE') in EXCLUSIONS['CUSTOMER_TYPES']:
                    continue
                
                # Skip excluded BB tariffs
                if record.get('BB_TARIFF_NAME') in EXCLUSIONS['BB_TARIFF_EXCLUSIONS']:
                    continue
                
                # Calculate package commission
                for tariff_col, tariff_id_col in [
                    ('BB_TARIFF_NAME', 'BB_TARIFF_ID'),
                    ('V_TARIFF_NAME', 'V_TARIFF_ID'),
                    ('PEO_TARIFF_NAME', 'PEO_TARIFF_ID')
                ]:
                    if record.get(tariff_col):
                        tariff_id = record.get(tariff_id_col, 'UNKNOWN')
                        tariff_name = record[tariff_col]
                        pcr, additional = self.get_pcr_by_id_or_name(tariff_id, tariff_name)
                        
                        if pcr > 0:
                            package_commission += pcr
                            sales_breakdown[sales_chanal][(tariff_id, tariff_name)].append(order_id)
                
                            # Count product types
                            inc_category = record.get('INC_CATEGORY')
                            if inc_category in ['AB-FTTH', 'BB-FTTH']:
                                total_ftth += 1
                            elif inc_category in ['AB-LTE', 'SIM-LTE']:
                                total_lte += 1
                            elif inc_category in ['PEO-COPPER', 'PEO-FTTH']:
                                total_peo += 1
                            elif inc_category == 'ADSL':
                                total_copper += 1

                            # Pass all required columns to save_detailed_result
                            self.db.save_detailed_result(
                                employee_number=employee_number,
                                sales_chanal=sales_chanal,
                                order_id=order_id,
                                tariff_id=tariff_id,
                                tariff_name=tariff_name,
                                inc_category=record.get('INC_CATEGORY'),
                                bss_status=bss_status,
                                pcr_amount=pcr,
                                bearer_commission=curr_bearer_commission,
                                calculation_type=calculation_type,
                                sales_month=sales_month,
                                service_id=record.get('SERVICE_ID'),  # Now will be present
                                account_num=record.get('ACCOUNT_NUM'),  # Now will be present
                                service_name=record.get('ORDER_LINE_OSS_SERVICE_TYPE'),  # This is your service name
                                order_type=record.get('ORDER_TYPE'),
                                order_sub_type=record.get('ORDER_SUB_TYPE'),
                                customer_type=record.get('CUSTOMER_TYPE'),
                                performa_eligibility=record.get('PERFORMA_ELIGIBILITY'),
                                cupon_sales=record.get('CUPON_SALES')
                            )
                            break
        
        # Add ADSL PCR if slab level > 0
        if slab_level > 0:
            for order_id, records in orders.items():
                for record in records:
                    if (record.get('BB_TARIFF_NAME') in EXCLUSIONS['BB_TARIFF_EXCLUSIONS'] and
                       record['INC_CATEGORY'] == 'ADSL'):
                        tariff_id = record.get('BB_TARIFF_ID', 'UNKNOWN')
                        tariff_name = record['BB_TARIFF_NAME']
                        pcr, _ = self.get_pcr_by_id_or_name(tariff_id, tariff_name)
                        
                        if pcr > 0:
                            package_commission += pcr
                            sales_breakdown[sales_chanal][(tariff_id, tariff_name)].append(order_id)
                            total_copper += 1
                            
                            self.db.save_detailed_result(
                                employee_number=employee_number,
                                sales_chanal=sales_chanal,
                                order_id=order_id,
                                tariff_id=tariff_id,
                                tariff_name=tariff_name,
                                inc_category=record.get('INC_CATEGORY'),
                                bss_status=bss_status,
                                pcr_amount=pcr,
                                bearer_commission=0,
                                calculation_type=calculation_type,
                                sales_month=sales_month,
                                service_id=record.get('SERVICE_ID'),
                                account_num=record.get('ACCOUNT_NUM'),
                                service_name=record.get('SERVICE_NAME'),
                                order_type=record.get('ORDER_TYPE'),
                                order_sub_type=record.get('ORDER_SUB_TYPE'),
                                customer_type=record.get('CUSTOMER_TYPE'),
                                performa_eligibility=record.get('PERFORMA_ELIGIBILITY'),
                                cupon_sales=record.get('CUPON_SALES')
                            )
        
        total_pcr = bearer_commission + package_commission
        return total_pcr, sales_breakdown, total_ftth, total_lte, total_peo, total_copper, active_sales

    def run_assumed_calculation(self, sales_month):
        """Run assumed calculation and store results for a specific sales month"""
        print(f"{Fore.CYAN}Starting assumed calculation for {sales_month}...{Style.RESET_ALL}")

        try:
            sales_data = self.db.get_sales_data(sales_month=sales_month, consider_slab=True, bss_status_ok=False)
            employee_channels = set((record['EMPLOYEE_NUMBER'], record['SALES_CHANAL']) 
                                  for record in sales_data)
            results_count = 0

            for employee, sales_chanal in employee_channels:
                try:
                    slab_level = self.calculate_slab_level(employee, sales_data, sales_chanal, 'ASSUMED')
                    total_pcr, sales_breakdown, total_ftth, total_lte, total_peo, total_copper, active_sales = self.calculate_pcr(
                        employee, sales_data, slab_level, sales_chanal, 'ASSUMED', sales_month=sales_month
                    )
                    slab_rate = self.get_slab_rate(slab_level)
                    eligible_pcr = total_pcr * slab_rate
                    stage1_incentive = eligible_pcr * STAGE_PERCENTAGES['stage1']
                    stage2_incentive = eligible_pcr * STAGE_PERCENTAGES['stage2'] - stage1_incentive
                    stage3_incentive = eligible_pcr * STAGE_PERCENTAGES['stage3'] - (stage1_incentive + stage2_incentive)
                    assumed_incentive = stage1_incentive + stage2_incentive + stage3_incentive

                    # Print results
                    print(f"\n{Fore.YELLOW}Employee: {employee} (Sales Channel: {sales_chanal}, Assumed Calculation){Style.RESET_ALL}")
                    print(f"{'-'*50}")
                    print(f"Slab Level: {slab_level} ({slab_rate*100:.0f}%)")
                    unique_sales = sum(len(products) for products in sales_breakdown[sales_chanal].values())
                    print(f"Total Sales: {unique_sales}")
                    print(f"Product Types: FTTH={total_ftth}, LTE={total_lte}, PEO={total_peo}, COPPER={total_copper}")
                    print(f"Sales Breakdown:")
                    for (tariff_id, tariff_name), order_ids in sales_breakdown[sales_chanal].items():
                        print(f"  {tariff_id} - {tariff_name}: {len(order_ids)} sales")
                    print(f"Total PCR: {total_pcr:,.2f}")
                    print(f"Eligible PCR: {eligible_pcr:,.2f}")
                    print(f"Assumed Incentive: {assumed_incentive:,.2f}")

                    # Save results - TOTAL_TX is 0 for assumed calculation
                    result_id = self.db.save_calculation_result(
                        employee, slab_level, total_pcr, eligible_pcr,
                        stage1_incentive, stage2_incentive, stage3_incentive, 
                        'ASSUMED', sales_chanal,
                        total_ftth, total_lte, total_peo, total_copper,
                        active_sales, 0, assumed_incentive, sales_month=sales_month
                    )
                    
                    # Save ineligible results if needed
                    if slab_level == 0:
                        self.db.save_ineligible_slab_result(
                            employee_number=employee,
                            sales_chanal=sales_chanal,
                            slab_level=slab_level,
                            total_pcr=total_pcr,
                            eligible_pcr=eligible_pcr,
                            stage1_incentive=stage1_incentive,
                            stage2_incentive=stage2_incentive,
                            stage3_incentive=stage3_incentive,
                            calculation_type='ASSUMED',
                            total_ftth=total_ftth,
                            total_lte=total_lte,
                            total_peo=total_peo,
                            total_copper=total_copper,
                            active_sales=active_sales,
                            total_tx=0,  # TOTAL_TX=0 for assumed
                            assumed_incentive=assumed_incentive,
                            sales_month=sales_month
                        )
                    
                    results_count += 1
                except KeyError as e:
                    if 'GIGA' in str(e):
                        print(f"{Fore.YELLOW}⚠ Skipped GIGA configuration for employee {employee} in channel {sales_chanal}{Style.RESET_ALL}")
                    else:
                        raise

            print(f"\n{Fore.GREEN}✓ Assumed calculation completed for {results_count} employees{Style.RESET_ALL}")

        except Exception as e:
            print(f"{Fore.RED}✗ Assumed calculation failed: {str(e)}{Style.RESET_ALL}")

    def run_real_calculation_stage1(self, sales_month):
        """Run real Stage 1 calculation for a specific sales month"""
        print(f"{Fore.CYAN}Starting real Stage 1 calculation for {sales_month}...{Style.RESET_ALL}")
        try:
            full_sales_data = self.db.get_sales_data(sales_month=sales_month, consider_slab=True, bss_status_ok=False)
            all_employees = set((record['EMPLOYEE_NUMBER'], record['SALES_CHANAL']) 
                              for record in full_sales_data)
            active_sales_data = self.db.get_sales_data(sales_month=sales_month, consider_slab=True, bss_status_ok=True)
            results_count = 0

            for employee, sales_chanal in all_employees:
                try:
                    slab_level = self.calculate_slab_level(employee, active_sales_data, sales_chanal, 'REAL_STAGE1')
                    total_pcr, sales_breakdown, total_ftth, total_lte, total_peo, total_copper, active_sales = self.calculate_pcr(
                        employee, active_sales_data, slab_level, sales_chanal, 'REAL_STAGE1', sales_month=sales_month
                    )
                    slab_rate = self.get_slab_rate(slab_level)
                    eligible_pcr = total_pcr * slab_rate
                    stage1_incentive = eligible_pcr * STAGE_PERCENTAGES['stage1']
                    total_tx = sum(1 for record in full_sales_data if (record['EMPLOYEE_NUMBER'] == employee and 
                            record['SALES_CHANAL'] == sales_chanal and record.get('BSS_STATUS') == 'TX'))
                    # Print results
                    print(f"\n{Fore.YELLOW}Employee: {employee} (Sales Channel: {sales_chanal}, Real Stage 1 Calculation){Style.RESET_ALL}")
                    print(f"{'-'*50}")
                    print(f"Active Sales: {active_sales}")
                    print(f"Terminated Sales: {total_tx}")
                    print(f"Product Types: FTTH={total_ftth}, LTE={total_lte}, PEO={total_peo}, COPPER={total_copper}")
                    print(f"Slab Level: {slab_level} ({slab_rate*100:.0f}%)")
                    print(f"Total PCR: {total_pcr:,.2f}")
                    print(f"Eligible PCR: {eligible_pcr:,.2f}")
                    print(f"Stage 1 Incentive: {stage1_incentive:,.2f}")
        
                    # Save results - store TOTAL_TX only for real stage
                    result_id = self.db.save_calculation_result(
                        employee, slab_level, total_pcr, eligible_pcr,
                        stage1_incentive, 0, 0, 'REAL_STAGE1', sales_chanal,
                        total_ftth, total_lte, total_peo, total_copper,
                        active_sales, total_tx, 0, sales_month=sales_month
                    )
                    
                    # Save ineligible results if needed
                    if slab_level == 0:
                        self.db.save_ineligible_slab_result(
                            employee_number=employee,
                            sales_chanal=sales_chanal,
                            slab_level=slab_level,
                            total_pcr=total_pcr,
                            eligible_pcr=eligible_pcr,
                            stage1_incentive=stage1_incentive,
                            stage2_incentive=0,
                            stage3_incentive=0,
                            calculation_type='REAL_STAGE1',
                            total_ftth=total_ftth,
                            total_lte=total_lte,
                            total_peo=total_peo,
                            total_copper=total_copper,
                            active_sales=active_sales,
                            total_tx=total_tx,  # Store TX for ineligible real stage
                            assumed_incentive=0,
                            sales_month=sales_month
                        )
                    
                    results_count += 1
                except KeyError as e:
                    if 'GIGA' in str(e):
                        print(f"{Fore.YELLOW}⚠ Skipped GIGA configuration for employee {employee} in channel {sales_chanal}{Style.RESET_ALL}")
                    else:
                        raise
    
            print(f"\n{Fore.GREEN}✓ Real Stage 1 calculation completed for {results_count} employees{Style.RESET_ALL}")
    
        except Exception as e:
            print(f"{Fore.RED}✗ Real Stage 1 calculation failed: {str(e)}{Style.RESET_ALL}")
    
    def show_employee_summary(self):
        """Display employee calculation summary with detailed breakdown"""
        try:
            results = self.db.get_employee_summary()
            
            if not results:
                print(f"{Fore.YELLOW}No calculation results found{Style.RESET_ALL}")
                return
            
            print(f"\n{Fore.CYAN}{'='*160}")
            print(f"{'EMPLOYEE INCENTIVE SUMMARY':^160}")
            print(f"{'='*160}{Style.RESET_ALL}")
            
            # Table header (add Sales Month)
            print(f"\n{Fore.WHITE}{Style.BRIGHT}")
            print(f"{'Employee':<12} │ {'Channel':<12} │ {'Month':<8} │ {'Type':<12} │ {'Slab':<4} │ {'Total PCR':>12} │ {'Eligible PCR':>12} │ {'Sales (A/T)':<12} │ {'Products (F/L/P/C)':<20} │ {'Incentives':>12}")
            print("─" * 160)
            print(Style.RESET_ALL, end="")
            
            current_employee = None
            
            for result in results:
                employee = result['employee_number']
                sales_chanal = result['sales_chanal']
                sales_month = result.get('sales_month', '') or ''
                
                # Employee separator
                if employee != current_employee:
                    if current_employee is not None:
                        print("─" * 160)
                    current_employee = employee
                
                calc_type = result['calculation_type']
                slab = result['slab_level']
                total_pcr = result['total_pcr']
                eligible_pcr = result['eligible_pcr']
                total_ftth = result['total_ftth']
                total_lte = result['total_lte']
                total_peo = result['total_peo']
                total_copper = result['total_copper']
                active_sales = result['active_sales']
                total_tx = result['total_tx']
                assumed_incentive = result['assumed_incentive']
                stage1 = result['stage1_incentive']
                
                # Sales display
                tx_display = total_tx if calc_type.startswith('REAL') else 0
                sales_display = f"{active_sales}/{tx_display}"
                
                # Products display
                products_display = f"{total_ftth}/{total_lte}/{total_peo}/{total_copper}"
                
                # Incentive display
                if calc_type == 'ASSUMED':
                    incentive_display = f"A: {assumed_incentive:,.0f}"
                else:
                    incentive_display = f"S1: {stage1:,.0f}"
                
                # Color coding based on slab level
                if slab == 0:
                    color = Fore.RED
                elif slab >= 3:
                    color = Fore.GREEN
                elif slab == 2:
                    color = Fore.YELLOW
                else:
                    color = Fore.BLUE
                
                print(f"{color}{employee:<12} │ {sales_chanal:<12} │ {sales_month:<8} │ {calc_type:<12} │ {slab:<4} │ "
                      f"{total_pcr:>12,.0f} │ {eligible_pcr:>12,.0f} │ {sales_display:<12} │ "
                      f"{products_display:<20} │ {incentive_display:<12}{Style.RESET_ALL}")
            
            print(f"\n{Fore.CYAN}{'='*160}")
            print(f"Legend: Month=Sales Month, A=Active, T=Terminated, F=FTTH, L=LTE, P=PEO, C=Copper, A=Assumed, S1=Stage1")
            print(
                f"{Fore.RED}Red=Slab 0 (Ineligible)  "
                f"{Fore.BLUE}Blue=Slab 1  "
                f"{Fore.YELLOW}Yellow=Slab 2  "
                f"{Fore.GREEN}Green=Slab 3 (Highest){Style.RESET_ALL}"
            )
            print(f"{'='*160}{Style.RESET_ALL}")
            
        except Exception as e:
            print(f"{Fore.RED}✗ Failed to show summary: {str(e)}{Style.RESET_ALL}")

    def show_detailed_results(self):
        """Display detailed calculation results"""
        try:
            results = self.db.get_detailed_results()
            
            if not results:
                print(f"{Fore.YELLOW}No detailed results found{Style.RESET_ALL}")
                return
            
            print(f"\n{Fore.CYAN}{'='*170}")
            print(f"{'DETAILED INCENTIVE RESULTS':^170}")
            print(f"{'='*170}{Style.RESET_ALL}")
            
            # Table header (add Sales Month)
            print(f"\n{Fore.WHITE}{Style.BRIGHT}")
            print(f"{'Employee':<10} │ {'Channel':<12} │ {'Month':<8} │ {'Order ID':<15} │ {'Tariff':<45} │ {'Category':<10} │ {'Status':<6} │ {'PCR':>8} │ {'Bearer':>8} │ {'Type':<12}")
            print("─" * 170)
            print(Style.RESET_ALL, end="")
            
            current_employee = None
            
            for result in results:
                employee = result['employee_number']
                sales_chanal = result['sales_chanal']
                sales_month = result.get('sales_month', '') or ''
                
                # Employee separator
                if employee != current_employee:
                    if current_employee is not None:
                        print("─" * 170)
                    current_employee = employee
                
                order_id = result['order_line_oss_order_id'][:15]  # Truncate long order IDs
                tariff_display = f"{result['tariff_id']}: {result['tariff_name'][:40]}"  # Combine ID and name
                
                # Color coding based on status
                status = result['bss_status']
                if status == 'TX':
                    color = Fore.RED
                elif status in ['OK', 'SU']:
                    color = Fore.GREEN
                else:
                    color = Fore.YELLOW
                
                print(f"{color}{employee:<10} │ {sales_chanal:<12} │ {sales_month:<8} │ "
                      f"{order_id:<15} │ {tariff_display:<45} │ "
                      f"{result['inc_category']:<10} │ {status:<6} │ "
                      f"{result['pcr_amount']:>8,.0f} │ {result['bearer_commission']:>8,.0f} │ "
                      f"{result['calculation_type']:<12}{Style.RESET_ALL}")
            
            print(f"\n{Fore.CYAN}{'='*170}")
            print(f"Total records: {len(results)} | Status: TX=Terminated, OK=Active, SU=Suspended | Month=Sales Month")
            print(f"{'='*170}{Style.RESET_ALL}")
            
        except Exception as e:
            print(f"{Fore.RED}✗ Failed to show detailed results: {str(e)}{Style.RESET_ALL}")

    def show_ineligible_slab_results(self):
        """Display ineligible slab results"""
        try:
            results = self.db.get_ineligible_slab_results()
            
            if not results:
                print(f"{Fore.YELLOW}No ineligible slab results found{Style.RESET_ALL}")
                return
            
            print(f"\n{Fore.CYAN}{'='*140}")
            print(f"{'INELIGIBLE SLAB RESULTS (Slab Level 0)':^140}")
            print(f"{'='*140}{Style.RESET_ALL}")
            
            # Table header (add Month)
            print(f"\n{Fore.WHITE}{Style.BRIGHT}")
            print(f"{'Employee':<10} │ {'Channel':<12} │ {'Month':<8} │ {'Type':<12} │ {'Total PCR':>10} │ {'Sales (A/T)':<10} │ {'Products (F/L/P/C)':<16} │ {'Assumed':>10} │ {'Stage1':>10}")
            print("─" * 140)
            print(Style.RESET_ALL, end="")
            
            for result in results:
                sales_month = result.get('sales_month', '') or ''
                tx_display = result['total_tx'] if result['calculation_type'].startswith('REAL') else 0
                sales_display = f"{result['active_sales']}/{tx_display}"
                products_display = f"{result['total_ftth']}/{result['total_lte']}/{result['total_peo']}/{result['total_copper']}"
                if result['calculation_type'] == 'ASSUMED':
                    assumed_display = f"{result['assumed_incentive']:,.0f}"
                    stage1_display = "-"
                else:
                    assumed_display = "-"
                    stage1_display = f"{result['stage1_incentive']:,.0f}"
                print(f"{Fore.RED}{result['employee_number']:<10} │ {result['sales_chanal']:<12} │ {sales_month:<8} │ "
                      f"{result['calculation_type']:<12} │ {result['total_pcr']:>10,.0f} │ "
                      f"{sales_display:<11} │ {products_display:<18} │ "
                      f"{assumed_display:>10} │ {stage1_display:>10}{Style.RESET_ALL}")
            
            unique_employees = len(set((result['employee_number'], result.get('sales_month', '')) for result in results))
            
            print(f"\n{Fore.CYAN}{'='*140}")
            print(f"Total ineligible employees: {unique_employees} | These employees have insufficient sales for slab eligibility.")
            print(f"Legend: Month=Sales Month, A=Active, T=Terminated, F=FTTH, L=LTE, P=PEO, C=Copper")
            print(f"{'='*140}{Style.RESET_ALL}")
            
        except Exception as e:
            print(f"{Fore.RED}✗ Failed to show ineligible slab results: {str(e)}{Style.RESET_ALL}")