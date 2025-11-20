from django.conf import settings
from django.db import models
from django.utils import timezone
from django.core.files.storage import FileSystemStorage

attachment_storage = FileSystemStorage(location='E:/Projects/SLT Project/SIA 2/sales_incentive_automation/uploads') 
# I04 Product Eligibility Table Name = sia_cs_so_types 

class SiaSoType(models.Model):
    ID = models.AutoField(primary_key=True, db_column='ID')
    # TARIFF_ID = models.CharField(max_length=50, db_column='TARIFF_ID')
    PRODUCT = models.CharField(max_length=50, db_column='PRODUCT')
    SALES_DESCRIPTION = models.CharField(max_length=50, db_column='SALES_DESCRIPTION')
    SERVICE_TYPE = models.CharField(max_length=50, db_column='SERVICE_TYPE')
    ORDER_TYPE = models.CharField(max_length=50, db_column='ORDER_TYPE')
    ORDER_SUB_TYPE = models.CharField(max_length=50, db_column='ORDER_SUB_TYPE')
    SLAB_ELIGIBILITY = models.BooleanField(db_column='SLAB_ELIGIBILITY')
    PCR_ELIGIBILITY = models.BooleanField(db_column='PCR_ELI')
    CREATED_DATE = models.DateTimeField(auto_now_add=True, db_column='CREATED_DATE')# Auto set current datetime on creation
    CREATED_USER = models.CharField(max_length=50, db_column='CREATED_USER')
    UPDATED_DATE = models.DateTimeField(auto_now=True, db_column='UPDATED_DATE') # Auto update datetime on save
    UPDATED_USER = models.CharField(max_length=50, blank=True, db_column='UPDATED_USER')
    STATUS = models.CharField(max_length=50, db_column='STATUS')

    class Meta:
        db_table = 'SIA_CS_SO_TYPES'

    def __str__(self):
        return f"{self.PRODUCT} - {self.SALES_DESCRIPTION}"

# I05 Slab Level Table Name = SIA_CS_SLAB_LEVELS
class SlabLevel(models.Model):
    ID = models.AutoField(primary_key=True, db_column='ID')
    SLAB_ID = models.CharField(max_length=50, db_column='SLAB_ID')
    SLAB_LEVEL = models.CharField(max_length=50, db_column='SLAB_LEVEL')
    UPPER_RANGE = models.DecimalField(max_digits=15, decimal_places=2, db_column='UPPER_RANGE')
    LOWER_RANGE = models.DecimalField(max_digits=15, decimal_places=2, db_column='LOWER_RANGE')
    PERCENTAGE = models.DecimalField(max_digits=5, decimal_places=2, db_column='PERCENTAGE')
    CREATED_DATE = models.DateTimeField(auto_now_add=True, db_column='CREATED_DATE')
    CREATED_USER = models.CharField(max_length=50, db_column='CREATED_USER')
    UPDATED_DATE = models.DateTimeField(auto_now=True, db_column='UPDATED_DATE') 
    UPDATED_USER = models.CharField(max_length=50, blank=True, db_column='UPDATED_USER')
    STATUS = models.CharField(max_length=50, db_column='STATUS')

    class Meta:
        db_table = 'SIA_CS_SLAB_LEVELS'

    def __str__(self):
        return self.SLAB_LEVEL

# I06 Payment Stage Table Name = SIA_CS_PAYMENT_STAGES
class PaymentStage(models.Model):
    ID = models.AutoField(primary_key=True, db_column='ID')
    STAGE_ID = models.CharField(max_length=50, db_column='STAGE_ID')
    STAGE_LEVEL = models.CharField(max_length=50, db_column='STAGE_LEVEL')
    DAY_COUNT = models.IntegerField(db_column='DAY_COUNT')
    PERCENTAGE = models.IntegerField(db_column='PERCENTAGE')
    CREATED_DATE = models.DateTimeField(auto_now_add=True, db_column='CREATED_DATE')
    CREATED_USER = models.CharField(max_length=50, db_column='CREATED_USER')
    UPDATED_DATE = models.DateTimeField(auto_now=True, db_column='UPDATED_DATE') 
    UPDATED_USER = models.CharField(max_length=50, blank=True, db_column='UPDATED_USER')
    STATUS = models.CharField(max_length=50, db_column='STATUS')

    class Meta:
        db_table = 'SIA_CS_PAYMENT_STAGES'

    def __str__(self):
        return self.STAGE_ID

# I07 Exclusion Package Table Name = SIA_CS_EXCLUSION_PACKAGES
class ExclusionPackage(models.Model):
    ID = models.AutoField(primary_key=True, db_column='ID')
    EXP_ID = models.CharField(max_length=50, db_column='EXP_ID')
    TARIFF_ID = models.CharField(max_length=50, db_column='TARIFF_ID')
    TARIFF_NAME = models.CharField(max_length=50, db_column='TARIFF_NAME')
    EXCLUSION = models.BooleanField(db_column='EXCLUSION')
    CREATED_DATE = models.DateTimeField(auto_now_add=True, db_column='CREATED_DATE')
    CREATED_USER = models.CharField(max_length=50, db_column='CREATED_USER')
    UPDATED_DATE = models.DateTimeField(auto_now=True, db_column='UPDATED_DATE') 
    UPDATED_USER = models.CharField(max_length=50, blank=True, db_column='UPDATED_USER')
    STATUS = models.CharField(max_length=10, db_column='STATUS')

    class Meta:
        db_table = 'SIA_CS_EXCLUSION_PACKAGES'

    def __str__(self):
        return f"{self.TARIFF_NAME} ({self.TARIFF_ID})"

# I08 BearerPCR Table Name = SIA_CS_BEARER_PCR
class BearerPCR(models.Model):
    ID = models.AutoField(primary_key=True, db_column='ID')
    BEARER_PCR_ID = models.CharField(max_length=50, db_column='BEARER_PCR_ID')
    TARIFF_ID = models.CharField(max_length=50, db_column='TARIFF_ID')
    TARIFF_NAME = models.CharField(max_length=50, db_column='TARIFF_NAME')
    RENTAL_WO_TAX = models.CharField(max_length=50, db_column='RENTAL_WO_TAX')
    SERVICE_TYPE = models.CharField(max_length=50, db_column='SERVICE_TYPE')
    ORDER_TYPE = models.CharField(max_length=50, db_column='ORDER_TYPE')
    ORDER_SUB_TYPE = models.CharField(max_length=50, db_column='ORDER_SUB_TYPE')
    SPEED = models.CharField(max_length=50, db_column='SPEED')
    WITH_BB_RATE = models.CharField(max_length=50, blank=True, db_column='WITH_BB_ROUTER')
    WITHOUT_BB_RATE = models.CharField(max_length=50, blank=True, db_column='WITHOUT_BB_ROUTER')
    CREATED_DATE = models.DateTimeField(auto_now_add=True, db_column='CREATED_DATE')
    CREATED_USER = models.CharField(max_length=50, db_column='CREATED_USER')
    UPDATED_DATE = models.DateTimeField(auto_now=True, db_column='UPDATED_DATE') 
    UPDATED_USER = models.CharField(max_length=50, blank=True, db_column='UPDATED_USER')
    STATUS = models.CharField(max_length=10, db_column='STATUS')

    class Meta:
        db_table = 'SIA_CS_BEARER_PCR'

    def __str__(self):
        return f"{self.TARIFF_NAME} ({self.SPEED})"

# I10 PEO Rates Table Name = SIA_CS_PEO_RATES
class PEORates(models.Model):
    ID = models.AutoField(primary_key=True, db_column='ID')
    PEO_PCR_ID = models.CharField(max_length=50, db_column='PEO_PCR_ID')
    TARIFF_ID = models.CharField(max_length=50, blank=True, db_column='TARIFF_ID')
    TARIFF_NAME = models.CharField(max_length=50, blank=True, db_column='TARIFF_NAME')
    RENTAL_WO_TAX = models.CharField(max_length=50, db_column='RENTAL_WO_TAX')
    SERVICE_TYPE = models.CharField(max_length=50, db_column='SERVICE_TYPE')
    ORDER_TYPE = models.CharField(max_length=50, db_column='ORDER_TYPE')
    PCR = models.FloatField(null=True, blank=True, db_column='PCR')
    CREATED_DATE = models.DateTimeField(auto_now_add=True, db_column='CREATED_DATE')
    CREATED_USER = models.CharField(max_length=50, db_column='CREATED_USER')
    UPDATED_DATE = models.DateTimeField(auto_now=True, db_column='UPDATED_DATE') 
    UPDATED_USER = models.CharField(max_length=50, blank=True, db_column='UPDATED_USER')
    STATUS = models.CharField(max_length=10, db_column='STATUS')

    class Meta:
        db_table = 'SIA_CS_PEO_RATES'

    def __str__(self):
        return f"{self.TARIFF_NAME} - {self.TARIFF_ID}"

# I11 BBPackagePCR Table Name = SIA_CS_BB_PACKAGE_PCR
class BBPackagePCR(models.Model):
    ID = models.AutoField(primary_key=True, db_column='ID')
    BB_PCR_ID = models.CharField(max_length=50, db_column='BB_PCR_ID')
    TARIFF_ID = models.CharField(max_length=50, blank=True, db_column='TARIFF_ID')
    TARIFF_NAME = models.CharField(max_length=50, blank=True, db_column='TARIFF_NAME')
    RENTAL_WO_TAX = models.CharField(max_length=50, db_column='RENTAL_WO_TAX')
    PCR = models.FloatField(null=True, blank=True, db_column='PCR')
    ADDITIONAL_COST = models.FloatField(null=True, blank=True, db_column='ADDITIONAL_COST')
    SERVICE_TYPE = models.CharField(max_length=50, db_column='SERVICE_TYPE')
    ORDER_TYPE = models.CharField(max_length=50, db_column='ORDER_TYPE')
    CREATED_DATE = models.DateTimeField(auto_now_add=True, db_column='CREATED_DATE')
    CREATED_USER = models.CharField(max_length=50, db_column='CREATED_USER')
    UPDATED_DATE = models.DateTimeField(auto_now=True, db_column='UPDATED_DATE') 
    UPDATED_USER = models.CharField(max_length=50, blank=True, db_column='UPDATED_USER')
    STATUS = models.CharField(max_length=10, db_column='STATUS')

    class Meta:
        db_table = 'SIA_CS_BB_PCR'

    def __str__(self):
        return f"{self.SERVICE_TYPE} - {self.ORDER_TYPE}"

# LTE BB Package Table Name = LTE_BB_PACKAGE
class LTEBBPackage(models.Model):
    ID = models.AutoField(primary_key=True, db_column='ID')
    TARIFF_ID = models.CharField(max_length=50, blank=True, db_column='TARIFF_ID')
    TARIFF_NAME = models.CharField(max_length=50, blank=True, db_column='TARIFF_NAME')
    SERVICE_TYPE = models.CharField(max_length=50, db_column='SERVICE_TYPE')
    ORDER_TYPE = models.CharField(max_length=50, db_column='ORDER_TYPE')
    RENTAL = models.CharField(max_length=50, db_column='RENTAL')
    PCR = models.FloatField(null=True, blank=True, db_column='PCR')
    CREATED_DATE = models.DateTimeField(auto_now_add=True, db_column='CREATED_DATE')
    CREATED_USER = models.CharField(max_length=50, db_column='CREATED_USER')
    UPDATED_DATE = models.DateTimeField(auto_now=True, db_column='UPDATED_DATE') 
    UPDATED_USER = models.CharField(max_length=50, blank=True, db_column='UPDATED_USER')
    STATUS = models.CharField(max_length=10, db_column='STATUS')

    class Meta:
        db_table = 'SIA_CS_LTEBB'

    def __str__(self):
        return f"{self.SERVICE_TYPE} - {self.ORDER_TYPE}"

# LTE BB Package PCR Table Name = LTE_BB_PACKAGE_PCR
class LTEBBPackagePCR(models.Model):
    ID = models.AutoField(primary_key=True, db_column='ID')
    LTEBB_PCR_ID = models.CharField(max_length=50, db_column='LTEBB_PCR_ID')
    TARIFF_ID = models.CharField(max_length=50, blank=True, db_column='TARIFF_ID')
    TARIFF_NAME = models.CharField(max_length=50, blank=True, db_column='TARIFF_NAME')
    SERVICE_TYPE = models.CharField(max_length=50, db_column='SERVICE_TYPE')
    ORDER_TYPE = models.CharField(max_length=50, db_column='ORDER_TYPE')
    PREPAID_RATE = models.CharField(max_length=50, db_column='PREPAID_RATE')
    POSTPAID_FULL_PAYMENT_RATE = models.CharField(max_length=50, db_column='POSTPAID_FULL_PAYMENT_RATE')
    POSTPAID_CONCESSIONARY = models.CharField(max_length=50, db_column='POSTPAID_CONCESSIONARY')
    PAID_TYPE = models.CharField(max_length=50, db_column='PAID_TYPE')
    CREATED_DATE = models.DateTimeField(auto_now_add=True, db_column='CREATED_DATE')
    CREATED_USER = models.CharField(max_length=50,blank=True, db_column='CREATED_USER')
    UPDATED_DATE = models.DateTimeField(auto_now=True, db_column='UPDATED_DATE') 
    UPDATED_USER = models.CharField(max_length=50, blank=True, db_column='UPDATED_USER')
    STATUS = models.CharField(max_length=10, db_column='STATUS')

    class Meta:
        db_table = 'SIA_CS_LTEBB_PCR'

    def __str__(self):
        return f"{self.SERVICE_TYPE} - {self.ORDER_TYPE}"

# Unlimited Voice Packages Table Name = UNLIMITED_VOICE_PACKAGES
class UnlimitedVoicePackages(models.Model):
    ID = models.AutoField(primary_key=True, db_column='ID')
    UVOICE_ID = models.CharField(max_length=50, db_column='UVOICE_ID')
    TARIFF_ID = models.CharField(max_length=50, blank=True, db_column='TARIFF_ID')
    TARIFF_NAME = models.CharField(max_length=50, blank=True, db_column='TARIFF_NAME')
    MEDIUM = models.CharField(max_length=50, db_column='MEDIUM')
    PCR = models.CharField(max_length=50, db_column='PCR')
    CREATED_DATE = models.DateTimeField(auto_now_add=True, db_column='CREATED_DATE')
    CREATED_USER = models.CharField(max_length=50, db_column='CREATED_USER')
    UPDATED_DATE = models.DateTimeField(auto_now=True, db_column='UPDATED_DATE') 
    UPDATED_USER = models.CharField(max_length=50, blank=True, db_column='UPDATED_USER')
    STATUS = models.CharField(max_length=10, db_column='STATUS')
    

    class Meta:
        db_table = 'SIA_CS_UNLIMITED_VOICE_PACKAGES'

    def __str__(self):
        return f"{self.TARIFF_NAME} - {self.TARIFF_ID}"
    
class Scheme(models.Model):
    ID = models.AutoField(primary_key=True, db_column='ID')
    SCHEME_NUM = models.CharField(max_length=50)
    SCHEME_NAME = models.CharField(max_length=100)
    STATUS = models.CharField(max_length=20, default='active')
    START_DATE = models.DateField(null=True, blank=True)  
    ATTACHMENT = models.FileField(
        storage=attachment_storage,
        upload_to='scheme_attachments/',
        null=True,
        blank=True
    ) 
    CREATE_DATE = models.DateTimeField(auto_now_add=True)
    CREATE_USER = models.CharField(max_length=50, default='admin')
    UPDATE_DATE = models.DateTimeField(auto_now=True, null=True, blank=True)
    UPDATE_USER = models.CharField(max_length=50, blank=True)

    class Meta:
        db_table = 'SIA_CS_SCHEME'
        indexes = [
            models.Index(fields=['SCHEME_NUM']),
            models.Index(fields=['SCHEME_NAME']),
        ]

    def __str__(self):
        return f"{self.SCHEME_NUM} - {self.SCHEME_NAME}"

class SchemeRule(models.Model):
    ID = models.AutoField(primary_key=True, db_column='ID')
    SCHEME = models.ForeignKey(
        Scheme, 
        on_delete=models.CASCADE, 
        related_name='rules_by_id', 
        to_field='ID', 
        db_column='SCHEME_ID'
    )
    SCHEME_NUM = models.CharField(max_length=50) 
    TABLE_NAME = models.CharField(max_length=50)  # e.g., 'SIA_SO_TYPES'
    RT_ID = models.CharField(max_length=100)  

    class Meta:
        db_table = 'SIA_CS_SCHEME_RULES'
        indexes = [
            models.Index(fields=['SCHEME']),  
            models.Index(fields=['SCHEME_NUM']),
        ]

    @property
    def RULE_URL(self):
        """Dynamically get the URL from environment variables using the stored key."""
        return getattr(settings, f'VITE_{self.RT_ID}_URL', '')

    def __str__(self):
        return f"{self.SCHEME.SCHEME_NUM} - {self.RT_ID}"  # Fixed: Use self.SCHEME.SCHEME_NUM
    

class SiaCsDataLab(models.Model):
    service_id = models.CharField(max_length=255, primary_key=True, db_column='SERVICE_ID')
    service_name = models.CharField(max_length=255, null=True, blank=True, db_column='SERVICE_NAME')
    service_status = models.CharField(max_length=255, null=True, blank=True, db_column='SERVICE_STATUS')
    service_order_status_updated_dtm = models.DateField(null=True, blank=True, db_column='SERVICE_ORDER_STATUS_UPDATED_DTM')
    customer_ref = models.CharField(max_length=255, null=True, blank=True, db_column='CUSTOMER_REF')
    account_num = models.CharField(max_length=255, null=True, blank=True, db_column='ACCOUNT_NUM')
    order_id = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_ID')
    order_created_dtm = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_CREATED_DTM')  # Using CharField for flexibility
    order_num = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_NUM')
    order_status = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_STATUS')
    order_category = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_CATAGORY')  # Note typo in schema
    order_type = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_TYPE')
    order_sub_type = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_SUB_TYPE')
    order_bill_accnt_id = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_BILL_ACCNT_ID')
    order_accnt_id = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_ACCNT_ID')
    order_active_flg = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_ACTIVE_FLG')
    order_sales_person = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_SALES_PERSON')
    order_sales_office = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_SALES_OFFICE')
    order_sales_source = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_SALES_SOURCE')
    order_sales_unit = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_SALES_UNIT')
    order_non_slt_sales_unit = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_NON_SLT_SALES_UNIT')
    order_non_slt_sales_org = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_NON_SLT_SALES_ORG')
    order_non_slt_sales_person = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_NON_SLT_SALES_PERSON')
    order_freelancer_sales_person = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_FREELANCER_SALES_PERSON')
    order_registered_office = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_REGISTERED_OFFICE')
    order_completion_dtm = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_COMPLETION_DTM')  # Using CharField for flexibility
    order_line_created_dtm = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_LINE_CREATED_DTM')  # Using CharField for flexibility
    order_line_oss_service_id = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_LINE_OSS_SERVICE_ID')
    order_line_oss_order_id = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_LINE_OSS_ORDER_ID')
    order_line_oss_service_type = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_LINE_OSS_SERVICE_TYPE')
    oss_service_type = models.CharField(max_length=255, null=True, blank=True, db_column='OSS_SERVICE_TYPE')
    register_no = models.CharField(max_length=255, null=True, blank=True, db_column='REGISTER_NO')
    order_line_asset_id = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_LINE_ASSET_ID')
    order_line_promotion_id = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_LINE_PROMOTION_ID')
    order_line_promotion_name = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_LINE_PROMOTION_NAME')
    order_line_product_id = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_LINE_PRODUCT_ID')
    order_line_product_name = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_LINE_PRODUCT_NAME')
    order_line_action_type = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_LINE_ACTION_TYPE')
    order_line_status = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_LINE_STATUS')
    order_line_rto_area = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_LINE_RTO_AREA')
    order_line_lea_code = models.CharField(max_length=255, null=True, blank=True, db_column='ORDER_LINE_LEA_CODE')
    order_line_nrc = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, db_column='ORDER_LINE_NRC')
    x_pi_paid_amnt = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, db_column='X_PI_PAID_AMNT')
    cpe_type = models.CharField(max_length=255, null=True, blank=True, db_column='CPE_TYPE')
    performa_eligibility = models.CharField(max_length=255, null=True, blank=True, db_column='PERFORMA_ELIGIBILITY')
    consider_slab_count = models.CharField(max_length=255, null=True, blank=True, db_column='CONSIDER_SLAB_COUNT')
    consider_pcr = models.CharField(max_length=255, null=True, blank=True, db_column='CONSIDER_PCR')
    service_age = models.CharField(max_length=255, null=True, blank=True, db_column='SERVICE_AGE')
    cupon_sales = models.CharField(max_length=255, null=True, blank=True, db_column='CUPON_SALES')
    inc_category = models.CharField(max_length=255, null=True, blank=True, db_column='INC_CATEGORY')
    login = models.CharField(max_length=255, null=True, blank=True, db_column='LOGIN')
    employee_number = models.CharField(max_length=255, null=True, blank=True, db_column='EMPLOYEE_NUMBER')
    employee_first_name = models.CharField(max_length=255, null=True, blank=True, db_column='EMPLOYEE_FIRST_NAME')
    employee_initials = models.CharField(max_length=255, null=True, blank=True, db_column='EMPLOYEE_INITIALS')
    employee_surname = models.CharField(max_length=255, null=True, blank=True, db_column='EMPLOYEE_SURNAME')
    employee_cost_centre_code = models.CharField(max_length=255, null=True, blank=True, db_column='EMPLOYEE_COST_CENTRE_CODE')
    employee_cost_centre_name = models.CharField(max_length=255, null=True, blank=True, db_column='EMPLOYEE_COST_CENTRE_NAME')
    employee_designation = models.CharField(max_length=255, null=True, blank=True, db_column='EMPLOYEE_DESIGNATION')
    emp_person_type = models.CharField(max_length=255, null=True, blank=True, db_column='EMP_PERSON_TYPE')
    promotion_integ_id = models.CharField(max_length=255, null=True, blank=True, db_column='PROMOTION_INTEG_ID')
    bb_product_status = models.CharField(max_length=255, null=True, blank=True, db_column='BB_PRODUCT_STATUS')
    bb_tariff_name = models.CharField(max_length=255, null=True, blank=True, db_column='BB_TARIFF_NAME')
    bb_tariff_id = models.CharField(max_length=255, null=True, blank=True, db_column='BB_TARIFF_ID')
    bb_tariff_start_dtm = models.CharField(max_length=255, null=True, blank=True, db_column='BB_TARIFF_START_DTM')
    bb_tariff_end_dtm = models.CharField(max_length=255, null=True, blank=True, db_column='BB_TARIFF_END_DTM')
    bb_charge = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, db_column='BB_CHARGE')
    v_product_status = models.CharField(max_length=255, null=True, blank=True, db_column='V_PRODUCT_STATUS')
    v_tariff_name = models.CharField(max_length=255, null=True, blank=True, db_column='V_TARIFF_NAME')
    v_tariff_id = models.CharField(max_length=255, null=True, blank=True, db_column='V_TARIFF_ID')
    v_tariff_start_dtm = models.CharField(max_length=255, null=True, blank=True, db_column='V_TARIFF_START_DTM')
    v_tariff_end_dtm = models.CharField(max_length=255, null=True, blank=True, db_column='V_TARIFF_END_DTM')
    v_charge = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, db_column='V_CHARGE')
    peo_product_status = models.CharField(max_length=255, null=True, blank=True, db_column='PEO_PRODUCT_STATUS')
    peo_tariff_name = models.CharField(max_length=255, null=True, blank=True, db_column='PEO_TARIFF_NAME')
    peo_tariff_id = models.CharField(max_length=255, null=True, blank=True, db_column='PEO_TARIFF_ID')
    peo_tariff_start_dtm = models.CharField(max_length=255, null=True, blank=True, db_column='PEO_TARIFF_START_DTM')
    peo_tariff_end_dtm = models.CharField(max_length=255, null=True, blank=True, db_column='PEO_TARIFF_END_DTM')
    peo_charge = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, db_column='PEO_CHARGE')
    asset_id = models.CharField(max_length=255, null=True, blank=True, db_column='ASSET_ID')
    integration_id = models.CharField(max_length=255, null=True, blank=True, db_column='INTEGRATION_ID')
    lte_payment_method = models.CharField(max_length=255, null=True, blank=True, db_column='LTE_PAYMENT_METHOD')
    lte_payment_option = models.CharField(max_length=255, null=True, blank=True, db_column='LTE_PAYMENT_OPTION')
    is_concessionary = models.CharField(max_length=255, null=True, blank=True, db_column='IS_CONSESSIONARY')
    updated_proforma_eligibility = models.CharField(max_length=255, null=True, blank=True, db_column='UPDATED_PROFORMA_ELIGIBILITY')
    reg_no = models.CharField(max_length=255, null=True, blank=True, db_column='REG_NO')
    bss_status = models.CharField(max_length=255, null=True, blank=True, db_column='BSS_STATUS')
    status = models.CharField(max_length=255, null=True, blank=True, db_column='STATUS')
    so_initiator = models.CharField(max_length=255, null=True, blank=True, db_column='SO_INITIATOR')
    sales_channel = models.CharField(max_length=255, null=True, blank=True, db_column='SALES_CHANAL')  
    customer_type = models.CharField(max_length=255, null=True, blank=True, db_column='CUSTOMER_TYPE')  

    class Meta:
        db_table = 'SIA_CS_DATA_LAB' 
        managed = False  

    def __str__(self):
        return f"{self.service_id} - {self.service_name}"
