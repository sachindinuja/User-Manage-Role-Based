# models.py
from django.db import models

class SALESCOUNTREPORTSTAGEII(models.Model):
    DEALER_NAME = models.CharField(primary_key=True, max_length=100, db_column='DEALER_NAME')
    SUB_DEALER = models.CharField(max_length=100, db_column='SUB_DEALER')
    SALES_COUNT = models.IntegerField(db_column='SALES_COUNT')
    SLAB = models.CharField(max_length=1, db_column='SLAB')
    FTTH_STG1 = models.DecimalField(max_digits=15, decimal_places=2, db_column='FTTH_STG1', null=True, blank=True)
    FTTH_STG1_PAY = models.DecimalField(max_digits=15, decimal_places=2, db_column='FTTH_STG1_PAY', null=True, blank=True)
    BB_STG1 = models.DecimalField(max_digits=15, decimal_places=2, db_column='BB_STG1', null=True, blank=True)
    BB_STG1_PAY = models.DecimalField(max_digits=15, decimal_places=2, db_column='BB_STG1_PAY', null=True, blank=True)
    MEGALINE_STG1 = models.DecimalField(max_digits=15, decimal_places=2, db_column='MEGALINE_STG1', null=True, blank=True)
    MEGALINE_STG1_PAY = models.DecimalField(max_digits=15, decimal_places=2, db_column='MEGALINE_STG1_PAY', null=True, blank=True)
    LTE_STG1 = models.DecimalField(max_digits=15, decimal_places=2, db_column='LTE_STG1', null=True, blank=True)
    LTE_STG1_PAY = models.DecimalField(max_digits=15, decimal_places=2, db_column='LTE_STG1_PAY', null=True, blank=True)
    IPTV_STG1 = models.DecimalField(max_digits=15, decimal_places=2, db_column='IPTV_STG1', null=True, blank=True)
    IPTV_STG1_PAY = models.DecimalField(max_digits=15, decimal_places=2, db_column='IPTV_STG1_PAY', null=True, blank=True)
    TOT_STG1 = models.DecimalField(max_digits=15, decimal_places=2, db_column='TOT_STG1', null=True, blank=True)
    PAYMRNT_STG1 = models.DecimalField(max_digits=15, decimal_places=2, db_column='PAYMRNT_STG1', null=True, blank=True)
    SALES_COUNT_STG2 = models.IntegerField(db_column='SALES_COUNT_STG2')
    SLAB_STG2 = models.CharField(max_length=1, db_column='SLAB_STG2')
    FTTH_STG2 = models.DecimalField(max_digits=15, decimal_places=2, db_column='FTTH_STG2', null=True, blank=True)
    BB_STG2 = models.DecimalField(max_digits=15, decimal_places=2, db_column='BB_STG2', null=True, blank=True)
    MEGALINE_STG2 = models.DecimalField(max_digits=15, decimal_places=2, db_column='MEGALINE_STG2', null=True, blank=True)
    LTE_STG2 = models.DecimalField(max_digits=15, decimal_places=2, db_column='LTE_STG2', null=True, blank=True)
    IPTV_STG2 = models.DecimalField(max_digits=15, decimal_places=2, db_column='IPTV_STG2', null=True, blank=True)
    TOT_STG2 = models.DecimalField(max_digits=15, decimal_places=2, db_column='TOT_STG2', null=True, blank=True)
    PAYMRNT_STG2 = models.DecimalField(max_digits=15, decimal_places=2, db_column='PAYMRNT_STG2', null=True, blank=True)

    def __str__(self):
        return self.DEALER_NAME

    class Meta:
        managed = False
        db_table = "SIA_DL_SALES_COUNT_REPORT_STAGE_II"
        
class DEALERCOMMISSION(models.Model):
    PRODUCT = models.CharField(max_length=50)
    JAN_COUNT = models.IntegerField(default=0)
    JAN_COMMISSION = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    FEB_COUNT = models.IntegerField(default=0)
    FEB_COMMISSION = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    MAR_COUNT = models.IntegerField(default=0)
    MAR_COMMISSION = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    APR_COUNT = models.IntegerField(default=0)
    APR_COMMISSION = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    MAY_COUNT = models.IntegerField(default=0)
    MAY_COMMISSION = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    JUN_COUNT = models.IntegerField(default=0)
    JUN_COMMISSION = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    JUL_COUNT = models.IntegerField(default=0)
    JUL_COMMISSION = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    AUG_COUNT = models.IntegerField(default=0)
    AUG_COMMISSION = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    SEP_COUNT = models.IntegerField(default=0)
    SEP_COMMISSION = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    OCT_COUNT = models.IntegerField(default=0)
    OCT_COMMISSION = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    NOV_COUNT = models.IntegerField(default=0)
    NOV_COMMISSION = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    DEC_COUNT = models.IntegerField(default=0)
    DEC_COMMISSION = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    TOTAL_COUNT = models.IntegerField(default=0)
    TOTAL_COMMISSION = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    def __str__(self):
        return self.PRODUCT

    class Meta:
        db_table = 'SIA_DL_DEALER_COMMISSION'