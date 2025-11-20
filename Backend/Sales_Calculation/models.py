from django.db import models

class SiaCsCalculationResult(models.Model):
    id = models.AutoField(primary_key=True, db_column='ID')
    employee_number = models.CharField(max_length=50, db_column='EMPLOYEE_NUMBER')
    sales_chanal = models.CharField(max_length=20, db_column='SALES_CHANAL', blank=True, null=True)
    sales_month = models.CharField(max_length=10, db_column='SALES_MONTH', blank=True, null=True)
    slab_level = models.IntegerField(db_column='SLAB_LEVEL')
    total_pcr = models.DecimalField(max_digits=15, decimal_places=2, db_column='TOTAL_PCR')
    eligible_pcr = models.DecimalField(max_digits=15, decimal_places=2, db_column='ELIGIBLE_PCR')
    total_ftth = models.IntegerField(db_column='TOTAL_FTTH', default=0)
    total_lte = models.IntegerField(db_column='TOTAL_LTE', default=0)
    total_peo = models.IntegerField(db_column='TOTAL_PEO', default=0)
    total_copper = models.IntegerField(db_column='TOTAL_COPPER', default=0)
    active_sales = models.IntegerField(db_column='ACTIVE_SALES', default=0)
    total_tx = models.IntegerField(db_column='TOTAL_TX', default=0)
    assumed_incentive = models.DecimalField(max_digits=15, decimal_places=2, db_column='ASSUMED_INCENTIVE', default=0)
    stage1_incentive = models.DecimalField(max_digits=15, decimal_places=2, db_column='STAGE1_INCENTIVE')
    stage2_incentive = models.DecimalField(max_digits=15, decimal_places=2, db_column='STAGE2_INCENTIVE', default=0)
    stage3_incentive = models.DecimalField(max_digits=15, decimal_places=2, db_column='STAGE3_INCENTIVE', default=0)
    calculation_type = models.CharField(max_length=20, db_column='CALCULATION_TYPE')
    calculation_date = models.DateTimeField(db_column='CALCULATION_DATE', auto_now_add=True)

    class Meta:
        managed = False
        db_table = '"SIA_CS_SUMMARY_RESULT"'
        unique_together = (('employee_number', 'calculation_type', 'sales_chanal','sales_month'),)

class SiaCsCalculationDetailedResult(models.Model):
    id = models.AutoField(primary_key=True, db_column='ID')
    service_id = models.CharField(max_length=50, db_column='SERVICE_ID', blank=True, null=True)
    service_name = models.CharField(max_length=100, db_column='SERVICE_NAME', blank=True, null=True)
    account_num = models.CharField(max_length=50, db_column='ACCOUNT_NUM', blank=True, null=True)
    employee_number = models.CharField(max_length=50, db_column='EMPLOYEE_NUMBER')
    sales_chanal = models.CharField(max_length=20, db_column='SALES_CHANAL', blank=True, null=True)
    sales_month = models.CharField(max_length=10, db_column='SALES_MONTH', blank=True, null=True)
    order_line_oss_order_id = models.CharField(max_length=100, db_column='ORDER_LINE_OSS_ORDER_ID', blank=True, null=True)
    order_type = models.CharField(max_length=50, db_column='ORDER_TYPE', blank=True, null=True)
    order_sub_type = models.CharField(max_length=50, db_column='ORDER_SUB_TYPE', blank=True, null=True)
    tariff_id = models.CharField(max_length=50, db_column='TARIFF_ID', blank=True, null=True)
    tariff_name = models.CharField(max_length=255, db_column='TARIFF_NAME', blank=True, null=True)
    inc_category = models.CharField(max_length=50, db_column='INC_CATEGORY', blank=True, null=True)
    bss_status = models.CharField(max_length=20, db_column='BSS_STATUS', blank=True, null=True)
    pcr_amount = models.DecimalField(max_digits=15, decimal_places=2, db_column='PCR_AMOUNT', default=0)
    bearer_commission = models.DecimalField(max_digits=15, decimal_places=2, db_column='BEARER_COMMISSION', default=0)
    performa_eligibility = models.CharField(max_length=10, db_column='PERFORMA_ELIGIBILITY', blank=True, null=True)
    cupon_sales = models.CharField(max_length=20, db_column='CUPON_SALES', blank=True, null=True)
    calculation_type = models.CharField(max_length=20, db_column='CALCULATION_TYPE')
    customer_type = models.CharField(max_length=50, db_column='CUSTOMER_TYPE', blank=True, null=True)
    calculation_date = models.DateTimeField(db_column='CALCULATION_DATE', auto_now_add=True)

    class Meta:
        managed = False
        db_table = '"SIA_CS_CALCULATION_DETAILED_RESULT"'
        unique_together = (('employee_number', 'service_id', 'service_name', 'account_num', 'sales_chanal', 'order_line_oss_order_id', 'calculation_type','sales_month'),)

class SiaCsIneligibleSlabResult(models.Model):
    id = models.AutoField(primary_key=True, db_column='ID')
    employee_number = models.CharField(max_length=50, db_column='EMPLOYEE_NUMBER')
    sales_chanal = models.CharField(max_length=20, db_column='SALES_CHANAL', blank=True, null=True)
    sales_month = models.CharField(max_length=10, db_column='SALES_MONTH', blank=True, null=True)
    slab_level = models.IntegerField(db_column='SLAB_LEVEL')
    total_pcr = models.DecimalField(max_digits=15, decimal_places=2, db_column='TOTAL_PCR')
    eligible_pcr = models.DecimalField(max_digits=15, decimal_places=2, db_column='ELIGIBLE_PCR')
    total_ftth = models.IntegerField(db_column='TOTAL_FTTH', default=0)
    total_lte = models.IntegerField(db_column='TOTAL_LTE', default=0)
    total_peo = models.IntegerField(db_column='TOTAL_PEO', default=0)
    total_copper = models.IntegerField(db_column='TOTAL_COPPER', default=0)
    active_sales = models.IntegerField(db_column='ACTIVE_SALES', default=0)
    total_tx = models.IntegerField(db_column='TOTAL_TX', default=0)
    assumed_incentive = models.DecimalField(max_digits=15, decimal_places=2, db_column='ASSUMED_INCENTIVE', default=0)
    stage1_incentive = models.DecimalField(max_digits=15, decimal_places=2, db_column='STAGE1_INCENTIVE')
    stage2_incentive = models.DecimalField(max_digits=15, decimal_places=2, db_column='STAGE2_INCENTIVE', default=0)
    stage3_incentive = models.DecimalField(max_digits=15, decimal_places=2, db_column='STAGE3_INCENTIVE', default=0)
    calculation_type = models.CharField(max_length=20, db_column='CALCULATION_TYPE')
    calculation_date = models.DateTimeField(db_column='CALCULATION_DATE', auto_now_add=True)

    class Meta:
        managed = False
        db_table = '"SIA_CS_INELIGIBLE_SLAB_RESULT"'
        unique_together = (('employee_number', 'calculation_type', 'sales_chanal','sales_month'),)