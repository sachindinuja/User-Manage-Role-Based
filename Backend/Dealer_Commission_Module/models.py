from django.db import models, transaction
from django.utils import timezone

class SiaDlSoTypes(models.Model):
    ID = models.AutoField(primary_key=True, db_column='ID')
    SO_TYPE_ID = models.CharField(max_length=50, db_column='SO_TYPE_ID', unique=True, blank=True)
    PRODUCT = models.CharField(max_length=50, db_column='PRODUCT')
    SERVICE_TYPE = models.CharField(max_length=50, db_column='SERVICE_TYPE')
    ORDER_TYPE = models.CharField(max_length=50, db_column='ORDER_TYPE')
    CREATED_DATE = models.DateTimeField(auto_now_add=True, db_column='CREATED_DATE')
    CREATED_USER = models.CharField(max_length=50, db_column='CREATED_USER')
    UPDATED_DATE = models.DateTimeField(auto_now=True, db_column='UPDATED_DATE', null=True, blank=True)
    UPDATED_USER = models.CharField(max_length=50, db_column='UPDATED_USER', null=True, blank=True)
    STATUS = models.CharField(max_length=50, db_column='STATUS')

    def save(self, *args, **kwargs):
        with transaction.atomic():
            if not self.SO_TYPE_ID:  # Only generate SO_TYPE_ID if not provided
                last_record = SiaDlSoTypes.objects.order_by('-SO_TYPE_ID').first()
                if last_record and last_record.SO_TYPE_ID.startswith('SO'):
                    try:
                        num = int(last_record.SO_TYPE_ID[2:]) + 1
                    except ValueError:
                        num = 1
                else:
                    num = 1
                self.SO_TYPE_ID = f'SO{num:03d}'
            super().save(*args, **kwargs)

    class Meta:
        db_table = 'SIA_DL_SO_TYPES'

class SiaDlBlacklistPackages(models.Model):
    ID = models.AutoField(primary_key=True, db_column='ID')
    BLP_ID = models.CharField(max_length=50, db_column='BLP_ID')
    TARIFF_ID = models.CharField(max_length=50, db_column='TARIFF_ID')
    PACKAGE_NAME = models.CharField(max_length=50, db_column='PACKAGE_NAME')
    CREATED_DATE = models.DateTimeField(auto_now_add=True, db_column='CREATED_DATE')
    CREATED_USER = models.CharField(max_length=50, db_column='CREATED_USER')
    UPDATED_DATE = models.DateTimeField(auto_now=True, db_column='UPDATED_DATE', null=True, blank=True)
    UPDATED_USER = models.CharField(max_length=50, db_column='UPDATED_USER', null=True, blank=True)
    STATUS = models.CharField(max_length=50, db_column='STATUS')
    
    def save(self, *args, **kwargs):
        with transaction.atomic():
            if not self.BLP_ID:  # Only generate SO_TYPE_ID if not provided
                last_record = SiaDlBlacklistPackages.objects.order_by('-BLP_ID').first()
                if last_record and last_record.BLP_ID .startswith('BLP'):
                    try:
                        num = int(last_record.BLP_ID[2:]) + 1
                    except ValueError:
                        num = 1
                else:
                    num = 1
                self.BLP_ID = f'BLP{num:03d}'
            super().save(*args, **kwargs)

    class Meta:
        db_table = 'SIA_DL_BLACKLIST_PACKAGES'

class SiaDlSlabLevels(models.Model):
    ID = models.AutoField(primary_key=True, db_column='ID')
    SLAB_ID = models.CharField(max_length=50, db_column='SLAB_ID', unique=True, blank=True)
    SLAB_LEVEL = models.CharField(max_length=50, db_column='SLAB_LEVEL')
    UPPER_RANGE = models.DecimalField(max_digits=10, decimal_places=2, db_column='UPPER_RANGE')
    LOWER_RANGE = models.DecimalField(max_digits=10, decimal_places=2, db_column='LOWER_RANGE')
    CREATED_DATE = models.DateTimeField(auto_now_add=True, db_column='CREATED_DATE')
    CREATED_USER = models.CharField(max_length=50, db_column='CREATED_USER')
    UPDATED_DATE = models.DateTimeField(auto_now=True, db_column='UPDATED_DATE', null=True, blank=True)
    UPDATED_USER = models.CharField(max_length=50, db_column='UPDATED_USER', null=True, blank=True)
    STATUS = models.CharField(max_length=50, db_column='STATUS')

    def save(self, *args, **kwargs):
        with transaction.atomic():
            if not self.SLAB_ID:  # Only generate SLAB_ID if not provided
                last_record = SiaDlSlabLevels.objects.order_by('-SLAB_ID').first()
                if last_record and last_record.SLAB_ID.startswith('SLAB'):
                    try:
                        num = int(last_record.SLAB_ID[4:]) + 1
                    except ValueError:
                        num = 1
                else:
                    num = 1
                self.SLAB_ID = f'SLAB{num:03d}'
            super().save(*args, **kwargs)

    class Meta:
        db_table = 'SIA_DL_SLAB_LEVELS'

class SiaDlBearerRate(models.Model):
    ID = models.AutoField(primary_key=True, db_column='ID')
    BEARER_RATE_ID = models.CharField(max_length=50, db_column='BEARER_RATE_ID', unique=True, blank=True)
    SERVICE_TYPE = models.CharField(max_length=50, db_column='SERVICE_TYPE')
    ORDER_TYPE = models.CharField(max_length=50, db_column='ORDER_TYPE')
    COMPLIANCE = models.CharField(max_length=50, db_column='COMPLIANCE')
    SLAB_1 = models.DecimalField(max_digits=10, decimal_places=2, db_column='SLAB_1', null=True, blank=True)
    SLAB_2 = models.DecimalField(max_digits=10, decimal_places=2, db_column='SLAB_2', null=True, blank=True)
    SLAB_3 = models.DecimalField(max_digits=10, decimal_places=2, db_column='SLAB_3', null=True, blank=True)
    SLAB_4 = models.DecimalField(max_digits=10, decimal_places=2, db_column='SLAB_4', null=True, blank=True)
    SLAB_5 = models.DecimalField(max_digits=10, decimal_places=2, db_column='SLAB_5', null=True, blank=True)
    SLAB_6 = models.DecimalField(max_digits=10, decimal_places=2, db_column='SLAB_6', null=True, blank=True)
    CREATED_DATE = models.DateTimeField(auto_now_add=True, db_column='CREATED_DATE')
    CREATED_USER = models.CharField(max_length=50, db_column='CREATED_USER')
    UPDATED_DATE = models.DateTimeField(auto_now=True, db_column='UPDATED_DATE', null=True, blank=True)
    UPDATED_USER = models.CharField(max_length=50, db_column='UPDATED_USER', null=True, blank=True)
    STATUS = models.CharField(max_length=50, db_column='STATUS')

    def save(self, *args, **kwargs):
        with transaction.atomic():
            if not self.BEARER_RATE_ID:  # Only generate BEARER_RATE_ID if not provided
                last_record = SiaDlBearerRate.objects.order_by('-BEARER_RATE_ID').first()
                if last_record and last_record.BEARER_RATE_ID.startswith('BR'):
                    try:
                        num = int(last_record.BEARER_RATE_ID[2:]) + 1
                    except ValueError:
                        num = 1
                else:
                    num = 1
                self.BEARER_RATE_ID = f'BR{num:03d}'
            super().save(*args, **kwargs)

    class Meta:
        db_table = 'SIA_DL_BEARER_RATE'

class SiaDlPackageRate(models.Model):
    ID = models.AutoField(primary_key=True, db_column='ID')
    PACKAGE_RATE_ID = models.CharField(max_length=50, db_column='PACKAGE_RATE_ID', unique=True, blank=True)
    TARIFF_ID = models.CharField(max_length=50, db_column='TARIFF_ID')
    PACKAGE_NAME = models.CharField(max_length=50, db_column='PACKAGE_NAME')
    COMPLIANCE = models.CharField(max_length=50, db_column='COMPLIANCE')
    STAGE_LEVEL_STATUS_CHECK = models.CharField(max_length=50, db_column='STAGE_LEVEL_STATUS_CHECK')
    SLAB_LEVEL_1_RATE = models.DecimalField(max_digits=10, decimal_places=2, db_column='SLAB_LEVEL_1_RATE')
    BASE_RATE = models.DecimalField(max_digits=10, decimal_places=2, db_column='BASE_RATE')
    CREATED_DATE = models.DateTimeField(auto_now_add=True, db_column='CREATED_DATE')
    CREATED_USER = models.CharField(max_length=50, db_column='CREATED_USER')
    UPDATED_DATE = models.DateTimeField(auto_now=True, db_column='UPDATED_DATE', null=True, blank=True)
    UPDATED_USER = models.CharField(max_length=50, db_column='UPDATED_USER', null=True, blank=True)
    STATUS = models.CharField(max_length=50, db_column='STATUS')

    def save(self, *args, **kwargs):
        with transaction.atomic():
            if not self.PACKAGE_RATE_ID:  # Only generate PACKAGE_RATE_ID if not provided
                last_record = SiaDlPackageRate.objects.order_by('-PACKAGE_RATE_ID').first()
                if last_record and last_record.PACKAGE_RATE_ID.startswith('PR'):
                    try:
                        num = int(last_record.PACKAGE_RATE_ID[2:]) + 1
                    except ValueError:
                        num = 1
                else:
                    num = 1
                self.PACKAGE_RATE_ID = f'PR{num:03d}'
            super().save(*args, **kwargs)

    class Meta:
        db_table = 'SIA_DL_PACKAGE_RATE'