import psycopg2
from psycopg2.extras import RealDictCursor
from colorama import Fore, Style
from config import DATABASE_CONFIG

class DatabaseManager:
    def __init__(self):
        self.connection = None
        self.connect()
        # Ensure connection is valid
        if self.connection and self.connection.closed:
            self.connect()

    def connect(self):
        """Establish database connection"""
        try:
            self.connection = psycopg2.connect(**DATABASE_CONFIG)
            self.connection.autocommit = False  # Explicit transaction control
            print(f"{Fore.GREEN}✓ Database connected successfully{Style.RESET_ALL}")
        except Exception as e:
            print(f"{Fore.RED}✗ Database connection failed: {str(e)}{Style.RESET_ALL}")
            raise
    
    def execute_query(self, query, params=None, fetch=True):
        """Execute a query and return results"""
        try:
            with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute(query, params)
                if fetch:
                    result = cursor.fetchall()
                    # Explicitly commit after fetch operations
                    self.connection.commit()
                    return result
                else:
                    self.connection.commit()
                    return cursor.rowcount
        except Exception as e:
            self.connection.rollback()
            print(f"{Fore.RED}Query error: {str(e)}{Style.RESET_ALL}")
            raise
    
    def get_sales_data(self, sales_month=None, consider_slab=True, bss_status_ok=False):
        """Get sales data for calculation, optionally filtered by sales month, slab consideration and BSS status"""
        query = """
        SELECT 
            "EMPLOYEE_NUMBER",
            "SALES_CHANAL",
            "INC_CATEGORY",
            "BB_TARIFF_NAME",
            "BB_TARIFF_ID",
            "V_TARIFF_NAME",
            "V_TARIFF_ID",
            "PEO_TARIFF_NAME",
            "PEO_TARIFF_ID",
            "SERVICE_ORDER_STATUS_UPDATED_DTM",
            "BSS_STATUS",
            "CONSIDER_SLAB_COUNT",
            "CONSIDER_PCR",
            "CUSTOMER_TYPE",
            "CUPON_SALES",
            "ORDER_LINE_OSS_ORDER_ID",
            "ORDER_TYPE",
            "ORDER_SUB_TYPE",
            "ORDER_LINE_OSS_SERVICE_TYPE",
            "ORDER_LINE_PROMOTION_NAME",
            "PERFORMA_ELIGIBILITY",
            "CPE_TYPE",
            "LTE_PAYMENT_METHOD",
            "LTE_PAYMENT_OPTION",
            "SERVICE_ID",      -- <-- Add this
            "ACCOUNT_NUM"      -- <-- Add this
        FROM "SIA_CS_DATA_LAB"
        WHERE "PERFORMA_ELIGIBILITY" = '1'
        AND "SALES_CHANAL" IN ('RTO - KE', 'RTO - KT', 'RTO - MH', 'RTO - MT', 'RTO - AD', 'RTO - AG', 'RTO - AP', 'RTO - AW', 'RTO - BC', 'RTO - BD', 'RTO - BW', 'RTO - CW', 'RTO - GL', 'RTO - GP', 'RTO - GQ', 'RTO - HB', 'RTO - HK', 'RTO - HO', 'RTO - HR', 'RTO - HT', 'RTO - JA', 'RTO - KE', 'RTO - KG', 'RTO - KI', 'RO - KL', 'RTO - KLY', 'RTO - KO', 'RTO - KON', 'RTO - KT', 'RTO - KX', 'RTO - KY', 'RTO - MB', 'RTO - MD', 'RTO - MH', 'RTO - MRG', 'RTO - MT', 'RTO - ND', 'RTO - NG', 'RTO - NTB', 'RTO - NW', 'RTO - PH', 'RTO - PR', 'RTO - RM', 'RTO - RN', 'RTO - TC', 'RTO - VA', 'RTO - WT')
        """
        
        conditions = []
        params = []
        
        if consider_slab:
            conditions.append("\"CONSIDER_SLAB_COUNT\" = %s")
            params.append('1')
            
        if bss_status_ok:
            conditions.append("\"BSS_STATUS\" IN ('OK', 'SU')")
        
        if sales_month:
            # Filter by SALES_MONTH using SERVICE_ORDER_STATUS_UPDATED_DTM
            conditions.append("TO_CHAR(\"SERVICE_ORDER_STATUS_UPDATED_DTM\", 'MONYYYY') = %s")
            params.append(sales_month.upper())
        
        if conditions:
            query += " AND " + " AND ".join(conditions)
        
        query += " ORDER BY \"EMPLOYEE_NUMBER\", \"SALES_CHANAL\", \"ORDER_LINE_OSS_ORDER_ID\""
        
        return self.execute_query(query, tuple(params))
    
    def create_result_table_if_not_exists(self):
        """Create result table if it doesn't exist"""
        query = """
        CREATE TABLE IF NOT EXISTS "SIA_CS_SUMMARY_RESULT" (
            "ID" SERIAL PRIMARY KEY,
            "EMPLOYEE_NUMBER" VARCHAR(50) NOT NULL,
            "SALES_CHANAL" VARCHAR(20),
            "SALES_MONTH" VARCHAR(10),
            "SLAB_LEVEL" INTEGER NOT NULL,
            "TOTAL_PCR" DECIMAL(15,2) NOT NULL,
            "ELIGIBLE_PCR" DECIMAL(15,2) NOT NULL,
            "TOTAL_FTTH" INTEGER DEFAULT 0,
            "TOTAL_LTE" INTEGER DEFAULT 0,
            "TOTAL_PEO" INTEGER DEFAULT 0,
            "TOTAL_COPPER" INTEGER DEFAULT 0,
            "ACTIVE_SALES" INTEGER DEFAULT 0,
            "TOTAL_TX" INTEGER DEFAULT 0,
            "ASSUMED_INCENTIVE" DECIMAL(15,2) DEFAULT 0,
            "STAGE1_INCENTIVE" DECIMAL(15,2) NOT NULL,
            "STAGE2_INCENTIVE" DECIMAL(15,2) DEFAULT 0,
            "STAGE3_INCENTIVE" DECIMAL(15,2) DEFAULT 0,
            "CALCULATION_TYPE" VARCHAR(20) NOT NULL,
            "CALCULATION_DATE" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE("EMPLOYEE_NUMBER", "CALCULATION_TYPE", "SALES_CHANAL", "SALES_MONTH")
        );
        """
        self.execute_query(query, fetch=False)
        print(f"{Fore.GREEN}✓ Result table ready{Style.RESET_ALL}")
        
    def create_detailed_result_table_if_not_exists(self):
        """Create detailed result table for salesperson results"""
        query = """
        CREATE TABLE IF NOT EXISTS "SIA_CS_CALCULATION_DETAILED_RESULT" (
            "ID" SERIAL PRIMARY KEY,
            "SERVICE_ID" VARCHAR(50),         -- Salesperson Service Number
            "SERVICE_NAME" VARCHAR(100),      -- Service Type
            "ACCOUNT_NUM" VARCHAR(50),        -- Account Number
            "EMPLOYEE_NUMBER" VARCHAR(50) NOT NULL,
            "SALES_CHANAL" VARCHAR(20),
            "SALES_MONTH" VARCHAR(10),
            "ORDER_LINE_OSS_ORDER_ID" VARCHAR(100),
            "TARIFF_ID" VARCHAR(50),
            "TARIFF_NAME" VARCHAR(255),
            "INC_CATEGORY" VARCHAR(50),
            "BSS_STATUS" VARCHAR(20),
            "PCR_AMOUNT" NUMERIC(15,2) DEFAULT 0,
            "BEARER_COMMISSION" NUMERIC(15,2) DEFAULT 0,
            "CALCULATION_TYPE" VARCHAR(20) NOT NULL,
            "ORDER_TYPE" VARCHAR(50),         -- Order Type
            "ORDER_SUB_TYPE" VARCHAR(50),     -- Order Sub Type
            "CUSTOMER_TYPE" VARCHAR(50),      -- Customer Type
            "PERFORMA_ELIGIBILITY" VARCHAR(10),-- Proforma Eligibility
            "CUPON_SALES" VARCHAR(20),         -- Coupon Sale
            "CALCULATION_DATE" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE("EMPLOYEE_NUMBER", "SERVICE_ID", "SERVICE_NAME", "ACCOUNT_NUM", "SALES_CHANAL", "ORDER_LINE_OSS_ORDER_ID", "CALCULATION_TYPE", "SALES_MONTH")
        );
        """
        self.execute_query(query, fetch=False)
        print(f"{Fore.GREEN}✓ Detailed result table ready{Style.RESET_ALL}")

    def create_ineligible_slab_table_if_not_exists(self):
        """Create table for ineligible slab level salespeople"""
        query = """
        CREATE TABLE IF NOT EXISTS "SIA_CS_INELIGIBLE_SLAB_RESULT" (
            "ID" SERIAL PRIMARY KEY,
            "EMPLOYEE_NUMBER" VARCHAR(50) NOT NULL,
            "SALES_CHANAL" VARCHAR(20),
            "SALES_MONTH" VARCHAR(10),  -- Added
            "SLAB_LEVEL" INTEGER NOT NULL,
            "TOTAL_PCR" DECIMAL(15,2) NOT NULL,
            "ELIGIBLE_PCR" DECIMAL(15,2) NOT NULL,
            "TOTAL_FTTH" INTEGER DEFAULT 0,
            "TOTAL_LTE" INTEGER DEFAULT 0,
            "TOTAL_PEO" INTEGER DEFAULT 0,
            "TOTAL_COPPER" INTEGER DEFAULT 0,
            "ACTIVE_SALES" INTEGER DEFAULT 0,
            "TOTAL_TX" INTEGER DEFAULT 0,
            "ASSUMED_INCENTIVE" DECIMAL(15,2) DEFAULT 0,
            "STAGE1_INCENTIVE" DECIMAL(15,2) NOT NULL,
            "STAGE2_INCENTIVE" DECIMAL(15,2) DEFAULT 0,
            "STAGE3_INCENTIVE" DECIMAL(15,2) DEFAULT 0,
            "CALCULATION_TYPE" VARCHAR(20) NOT NULL,
            "CALCULATION_DATE" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE("EMPLOYEE_NUMBER", "CALCULATION_TYPE", "SALES_CHANAL", "SALES_MONTH")  -- Updated
        );
        """
        self.execute_query(query, fetch=False)
        print(f"{Fore.GREEN}✓ Ineligible slab result table ready{Style.RESET_ALL}")

    def save_calculation_result(self, employee_number, slab_level, total_pcr, 
                          eligible_pcr, stage1_incentive, stage2_incentive=0, 
                          stage3_incentive=0, calculation_type='ASSUMED', sales_chanal='',
                          total_ftth=0, total_lte=0, total_peo=0, total_copper=0,
                          active_sales=0, total_tx=0, assumed_incentive=0, sales_month=None):
        """Save calculation results to SIA_CS_SUMMARY_RESULT table"""
        query = """
        INSERT INTO "SIA_CS_SUMMARY_RESULT" 
        ("EMPLOYEE_NUMBER", "SALES_CHANAL", "SALES_MONTH", "SLAB_LEVEL", "TOTAL_PCR", "ELIGIBLE_PCR", 
         "TOTAL_FTTH", "TOTAL_LTE", "TOTAL_PEO", "TOTAL_COPPER", "ACTIVE_SALES", "TOTAL_TX",
         "ASSUMED_INCENTIVE", "STAGE1_INCENTIVE", "STAGE2_INCENTIVE", "STAGE3_INCENTIVE", 
         "CALCULATION_TYPE", "CALCULATION_DATE")
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
        ON CONFLICT ("EMPLOYEE_NUMBER", "SALES_CHANAL", "CALCULATION_TYPE", "SALES_MONTH")
        DO UPDATE SET
            "SLAB_LEVEL" = EXCLUDED."SLAB_LEVEL",
            "TOTAL_PCR" = EXCLUDED."TOTAL_PCR",
            "ELIGIBLE_PCR" = EXCLUDED."ELIGIBLE_PCR",
            "TOTAL_FTTH" = EXCLUDED."TOTAL_FTTH",
            "TOTAL_LTE" = EXCLUDED."TOTAL_LTE",
            "TOTAL_PEO" = EXCLUDED."TOTAL_PEO",
            "TOTAL_COPPER" = EXCLUDED."TOTAL_COPPER",
            "ACTIVE_SALES" = EXCLUDED."ACTIVE_SALES",
            "TOTAL_TX" = EXCLUDED."TOTAL_TX",
            "ASSUMED_INCENTIVE" = EXCLUDED."ASSUMED_INCENTIVE",
            "STAGE1_INCENTIVE" = EXCLUDED."STAGE1_INCENTIVE",
            "STAGE2_INCENTIVE" = EXCLUDED."STAGE2_INCENTIVE",
            "STAGE3_INCENTIVE" = EXCLUDED."STAGE3_INCENTIVE",
            "CALCULATION_DATE" = CURRENT_TIMESTAMP
        RETURNING "ID"
        """
        try:
            result = self.execute_query(query, (
                employee_number, sales_chanal, sales_month, slab_level, total_pcr, eligible_pcr,
                total_ftth, total_lte, total_peo, total_copper, active_sales, total_tx,
                assumed_incentive, stage1_incentive, stage2_incentive, stage3_incentive, calculation_type
            ), fetch=True)
            return result[0]['ID'] if result else None
        except Exception as e:
            print(f"{Fore.RED}Failed to save calculation result: {str(e)}{Style.RESET_ALL}")
            return None
    
    def save_detailed_result(self, employee_number, sales_chanal, order_id, tariff_id, tariff_name, 
                            inc_category, bss_status, pcr_amount, bearer_commission, calculation_type, sales_month=None,
                            service_id=None, account_num=None, service_name=None, order_type=None, order_sub_type=None,
                            customer_type=None, performa_eligibility=None, cupon_sales=None):
        """Save detailed calculation results for each sale"""
        query = """
        INSERT INTO "SIA_CS_CALCULATION_DETAILED_RESULT"
        ("EMPLOYEE_NUMBER", "SALES_CHANAL", "SALES_MONTH", "ORDER_LINE_OSS_ORDER_ID", "TARIFF_ID", "TARIFF_NAME", 
         "INC_CATEGORY", "BSS_STATUS", "PCR_AMOUNT", "BEARER_COMMISSION", "CALCULATION_TYPE",
         "SERVICE_ID", "ACCOUNT_NUM", "SERVICE_NAME", "ORDER_TYPE", "ORDER_SUB_TYPE", "CUSTOMER_TYPE", "PERFORMA_ELIGIBILITY", "CUPON_SALES")
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT ("EMPLOYEE_NUMBER", "SERVICE_ID", "SERVICE_NAME", "ACCOUNT_NUM", "SALES_CHANAL", "ORDER_LINE_OSS_ORDER_ID", "CALCULATION_TYPE", "SALES_MONTH")
        DO UPDATE SET
            "TARIFF_ID" = EXCLUDED."TARIFF_ID",
            "TARIFF_NAME" = EXCLUDED."TARIFF_NAME",
            "INC_CATEGORY" = EXCLUDED."INC_CATEGORY",
            "BSS_STATUS" = EXCLUDED."BSS_STATUS",
            "PCR_AMOUNT" = EXCLUDED."PCR_AMOUNT",
            "BEARER_COMMISSION" = EXCLUDED."BEARER_COMMISSION",
            "SERVICE_ID" = EXCLUDED."SERVICE_ID",
            "ACCOUNT_NUM" = EXCLUDED."ACCOUNT_NUM",
            "SERVICE_NAME" = EXCLUDED."SERVICE_NAME",
            "ORDER_TYPE" = EXCLUDED."ORDER_TYPE",
            "ORDER_SUB_TYPE" = EXCLUDED."ORDER_SUB_TYPE",
            "CUSTOMER_TYPE" = EXCLUDED."CUSTOMER_TYPE",
            "PERFORMA_ELIGIBILITY" = EXCLUDED."PERFORMA_ELIGIBILITY",
            "CUPON_SALES" = EXCLUDED."CUPON_SALES",
            "CALCULATION_DATE" = CURRENT_TIMESTAMP
        """
        return self.execute_query(query, (
            employee_number, sales_chanal, sales_month, order_id, tariff_id, tariff_name, inc_category,
            bss_status, pcr_amount, bearer_commission, calculation_type,
            service_id, account_num, service_name, order_type, order_sub_type, customer_type, performa_eligibility, cupon_sales
        ), fetch=False)
    
    def save_ineligible_slab_result(self, employee_number, sales_chanal, slab_level,
                                   total_pcr, eligible_pcr, stage1_incentive, 
                                   stage2_incentive, stage3_incentive, 
                                   calculation_type, total_ftth=0, total_lte=0,
                                   total_peo=0, total_copper=0, active_sales=0, 
                                   total_tx=0, assumed_incentive=0, sales_month=None):  # Added sales_month
        """Save results for salespeople ineligible for slab level"""
        query = """
        INSERT INTO "SIA_CS_INELIGIBLE_SLAB_RESULT"
        ("EMPLOYEE_NUMBER", "SALES_CHANAL", "SALES_MONTH", "SLAB_LEVEL", "TOTAL_PCR", "ELIGIBLE_PCR", 
         "TOTAL_FTTH", "TOTAL_LTE", "TOTAL_PEO", "TOTAL_COPPER", "ACTIVE_SALES", "TOTAL_TX",
         "ASSUMED_INCENTIVE", "STAGE1_INCENTIVE", "STAGE2_INCENTIVE", "STAGE3_INCENTIVE", 
         "CALCULATION_TYPE", "CALCULATION_DATE")
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
        ON CONFLICT ("EMPLOYEE_NUMBER", "CALCULATION_TYPE", "SALES_CHANAL", "SALES_MONTH")
        DO UPDATE SET
            "SLAB_LEVEL" = EXCLUDED."SLAB_LEVEL",
            "TOTAL_PCR" = EXCLUDED."TOTAL_PCR",
            "ELIGIBLE_PCR" = EXCLUDED."ELIGIBLE_PCR",
            "TOTAL_FTTH" = EXCLUDED."TOTAL_FTTH",
            "TOTAL_LTE" = EXCLUDED."TOTAL_LTE",
            "TOTAL_PEO" = EXCLUDED."TOTAL_PEO",
            "TOTAL_COPPER" = EXCLUDED."TOTAL_COPPER",
            "ACTIVE_SALES" = EXCLUDED."ACTIVE_SALES",
            "TOTAL_TX" = EXCLUDED."TOTAL_TX",
            "ASSUMED_INCENTIVE" = EXCLUDED."ASSUMED_INCENTIVE",
            "STAGE1_INCENTIVE" = EXCLUDED."STAGE1_INCENTIVE",
            "STAGE2_INCENTIVE" = EXCLUDED."STAGE2_INCENTIVE",
            "STAGE3_INCENTIVE" = EXCLUDED."STAGE3_INCENTIVE",
            "CALCULATION_DATE" = CURRENT_TIMESTAMP
        """
        return self.execute_query(query, (
            employee_number, sales_chanal, sales_month, slab_level, total_pcr, eligible_pcr,
            total_ftth, total_lte, total_peo, total_copper, active_sales, total_tx,
            assumed_incentive, stage1_incentive, stage2_incentive, stage3_incentive, calculation_type
        ), fetch=False)
    
    def get_employee_summary(self):
        """Get employee calculation summary"""
        query = """
        SELECT 
            "EMPLOYEE_NUMBER" AS employee_number,
            "SALES_CHANAL" AS sales_chanal,
            "SALES_MONTH" AS sales_month,
            "CALCULATION_TYPE" AS calculation_type,
            "SLAB_LEVEL" AS slab_level,
            "TOTAL_PCR" AS total_pcr,
            "ELIGIBLE_PCR" AS eligible_pcr,
            "TOTAL_FTTH" AS total_ftth,
            "TOTAL_LTE" AS total_lte,
            "TOTAL_PEO" AS total_peo,
            "TOTAL_COPPER" AS total_copper,
            "ACTIVE_SALES" AS active_sales,
            "TOTAL_TX" AS total_tx,
            "ASSUMED_INCENTIVE" AS assumed_incentive,
            "STAGE1_INCENTIVE" AS stage1_incentive,
            "STAGE2_INCENTIVE" AS stage2_incentive,
            "STAGE3_INCENTIVE" AS stage3_incentive,
            "CALCULATION_DATE" AS calculation_date
        FROM "SIA_CS_SUMMARY_RESULT"
        ORDER BY "EMPLOYEE_NUMBER", "SALES_CHANAL", "SALES_MONTH", "CALCULATION_TYPE"
        """
        return self.execute_query(query)
    
    def get_detailed_results(self):
        """Get detailed calculation results"""
        query = """
        SELECT 
            "EMPLOYEE_NUMBER" AS employee_number,
            "SALES_CHANAL" AS sales_chanal,
            "SALES_MONTH" AS sales_month,
            "ORDER_LINE_OSS_ORDER_ID" AS order_line_oss_order_id,
            "TARIFF_ID" AS tariff_id,
            "TARIFF_NAME" AS tariff_name,
            "INC_CATEGORY" AS inc_category,
            "BSS_STATUS" AS bss_status,
            "PCR_AMOUNT" AS pcr_amount,
            "BEARER_COMMISSION" AS bearer_commission,
            "CALCULATION_TYPE" AS calculation_type,
            "CALCULATION_DATE" AS calculation_date
        FROM "SIA_CS_CALCULATION_DETAILED_RESULT"
        ORDER BY "EMPLOYEE_NUMBER", "SALES_CHANAL", "SALES_MONTH", "CALCULATION_DATE"
        """
        return self.execute_query(query)
    
    def get_ineligible_slab_results(self):
        """Get ineligible slab calculation results"""
        query = """
        SELECT 
            "EMPLOYEE_NUMBER" AS employee_number,
            "SALES_CHANAL" AS sales_chanal,
            "SALES_MONTH" AS sales_month,
            "SLAB_LEVEL" AS slab_level,
            "TOTAL_PCR" AS total_pcr,
            "ELIGIBLE_PCR" AS eligible_pcr,
            "TOTAL_FTTH" AS total_ftth,
            "TOTAL_LTE" AS total_lte,
            "TOTAL_PEO" AS total_peo,
            "TOTAL_COPPER" AS total_copper,
            "ACTIVE_SALES" AS active_sales,
            "TOTAL_TX" AS total_tx,
            "ASSUMED_INCENTIVE" AS assumed_incentive,
            "STAGE1_INCENTIVE" AS stage1_incentive,
            "STAGE2_INCENTIVE" AS stage2_incentive,
            "STAGE3_INCENTIVE" AS stage3_incentive,
            "CALCULATION_TYPE" AS calculation_type,
            "CALCULATION_DATE" AS calculation_date
        FROM "SIA_CS_INELIGIBLE_SLAB_RESULT"
        ORDER BY "EMPLOYEE_NUMBER", "SALES_CHANAL", "SALES_MONTH", "CALCULATION_TYPE"
        """
        return self.execute_query(query)

    def check_database_status(self):
        """Check database connection and table status"""
        try:
            main_count = self.execute_query(
                'SELECT COUNT(*) as count FROM "SIA_CS_DATA_LAB"'
            )[0]['count']
            result_count = self.execute_query(
                'SELECT COUNT(*) as count FROM "SIA_CS_SUMMARY_RESULT"'
            )[0]['count']
            detailed_count = self.execute_query(
                'SELECT COUNT(*) AS count FROM "SIA_CS_CALCULATION_DETAILED_RESULT"'
            )[0]['count']
            ineligible_count = self.execute_query(
                'SELECT COUNT(*) AS count FROM "SIA_CS_INELIGIBLE_SLAB_RESULT"'
            )[0]['count']
            
            print(f"{Fore.GREEN}✓ Database Status:")
            print(f"  • SIA_CS_DATA_LAB records: {main_count}")
            print(f"  • SIA_CS_SUMMARY_RESULT records: {result_count}")
            print(f"  • SIA_CS_CALCULATION_DETAILED_RESULT records: {detailed_count}")
            print(f"  • SIA_CS_INELIGIBLE_SLAB_RESULT records: {ineligible_count}")
            print(f"  • Connection: Active{Style.RESET_ALL}")
            
        except Exception as e:
            print(f"{Fore.RED}✗ Database status check failed: {str(e)}{Style.RESET_ALL}")

    def close(self):
        """Close database connection"""
        if self.connection:
            self.connection.close()
            print(f"{Fore.YELLOW}Database connection closed{Style.RESET_ALL}")