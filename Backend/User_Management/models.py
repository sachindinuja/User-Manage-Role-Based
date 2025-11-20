from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

USER_ROLE_CHOICES = [
    ('REGIONAL_GM', 'Regional General Manager'),
    ('PROVINCIAL_DGM', 'Provincial Deputy General Manager'),
    ('REGIONAL_MANAGER', 'Regional Manager'),
    ('SALES_MANAGER', 'Sales Manager'),
    ('SALES_OFFICER', 'Sales Officer'),
    # ('SALES_PERSON, Sales Person'),
    ('CHIEF_CONSUMER', 'Chief Officer Consumer Business'),
    ('CHIEF_FINANCE', 'Chief Officer Finance'),
    ('GM_CONSUMER', 'General Manager Consumer Business Support'),
    ('DGM_SALES', 'Deputy General Manager Consumer Sales Support'),
    ('DGM_CHANNEL', 'Deputy General Manager Channel Management'),
    ('MANAGER_CONSUMER', 'Manager Consumer Sales'),
    ('MANAGER_DEALER', 'Manager Dealer Management'),
    ('FINANCE_AUDIT', 'Finance & Audit Team'),
]

USER_CATEGORY_CHOICES = [
    ('CENTRAL', 'Central Team'), # Internal -> HQ
    ('REGIONAL', 'Regional Team'), # Internal -> RTO [RTO - KL, RTO - MD]
]

class CustomUserManager(BaseUserManager):
    def create_user(self, service_id, password=None, **extra_fields):
        if not service_id:
            raise ValueError('The Service ID must be set')
        user = self.model(service_id=service_id, **extra_fields)
        user.set_password(password)  # Handle password hashing
        user.save(using=self._db)
        return user

    def create_superuser(self, service_id, password=None, **extra_fields):
        # Ensure superuser defaults
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('user_role', 'REGIONAL_GM')
        extra_fields.setdefault('user_category', 'REGIONAL')

        # Validate superuser settings
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(service_id, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    service_id = models.CharField(max_length=100, unique=True, primary_key=True, help_text="Employee ID", db_column='SERVICE_ID')
    name = models.CharField(max_length=100, db_column='NAME')
    email = models.EmailField(max_length=255, unique=True, db_column='EMAIL')
    # Designation is a free-text field for job title -> Examples: "Regional Manager - Colombo", "Senior Sales Officer"
    designation = models.CharField(max_length=100, blank=True, null=True, db_column='DESIGNATION')
    contact_number = models.CharField(max_length=20, blank=True, null=True, db_column='CONTACT_NUMBER')
    # User role is selected from predefined choices
    user_role = models.CharField(max_length=50, choices=USER_ROLE_CHOICES, blank=True, null=True, db_column='USER_ROLE')
    user_category = models.CharField(max_length=50, choices=USER_CATEGORY_CHOICES, blank=True, null=True, db_column='USER_CATEGORY')
    azure_oid = models.CharField(max_length=100, blank=True, null=True, help_text="Azure AD Object ID", db_column='AZURE_OID')
    profile_completed_user = models.CharField(max_length=100, blank=True, null=True, help_text="Service ID of the system administrator who completed this profile", db_column='PROFILE_COMPLETED_USER')
    is_active = models.BooleanField(default=True, db_column='IS_ACTIVE')
    is_staff = models.BooleanField(default=False, db_column='IS_STAFF')
    created_at = models.DateTimeField(auto_now_add=True, db_column='CREATED_AT')
    updated_at = models.DateTimeField(auto_now=True, db_column='UPDATED_AT')

    objects = CustomUserManager()

    USERNAME_FIELD = 'service_id'

    @property
    def profile_complete(self):
        return all([
            self.designation,
            self.contact_number,
            self.user_role,
            self.user_category
        ])

    def __str__(self):
        return f"{self.name} ({self.service_id})"

    class Meta:
        db_table = 'USER_MANAGEMENT_USER'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        # Add custom table names for many-to-many relationships
        permissions = []
        
    # Override the default related names to control table naming (Uppercase the data table names)
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name="user_management_users",
        related_query_name="user_management_user",
        db_table='USER_MANAGEMENT_USER_GROUPS'
    )
    
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="user_management_users",
        related_query_name="user_management_user",
        db_table='USER_MANAGEMENT_USER_USER_PERMISSIONS'
    )