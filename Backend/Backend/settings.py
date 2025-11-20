from pathlib import Path
import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY")
DEBUG = True
ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',          # Django REST Framework
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'Sales_Incentive_Module',
    'Dealer_Commission_Module',
    'Dealer_Calculation',
    'User_Management',
    'Sales_Calculation',
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'User_Management.middleware.ProfileCompletionMiddleware',
    'User_Management.middleware.RoleRedirectMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # deploy changes
    # 'django_auth_adfs.middleware.LoginRequiredMiddleware',
]

ROOT_URLCONF = 'Backend.urls'

# Allow frontend origin
CORS_ALLOWED_ORIGINS = [
    "http://localhost",  # Vite default port
    #"http://127.0.0.1:5173",
    "http://74.225.193.42"
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost",
    #"http://127.0.0.1:5173",
    "http://74.225.193.42"
]

CORS_ALLOW_CREDENTIALS = True

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'Backend.wsgi.application'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'WARNING',
    },
    'loggers': {
        'user_management': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv("DB_USER"),
        'PASSWORD': os.getenv("DB_PASSWORD"),
        'HOST': os.getenv("DB_HOST", 'db'),
        'PORT': os.getenv("DB_PORT", '5432'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Custom User Model
AUTH_USER_MODEL = 'User_Management.User'

AUTHENTICATION_BACKENDS = (
    # 'django_auth_adfs.backend.AdfsAuthCodeBackend',
    'django.contrib.auth.backends.ModelBackend',
)

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# AZURE AD Credentials

AZURE_AD_CLIENT_ID = os.getenv('AZURE_AD_CLIENT_ID')
AZURE_AD_CLIENT_SECRET = os.getenv('AZURE_AD_CLIENT_SECRET')
AZURE_AD_TENANT_ID = os.getenv('AZURE_AD_TENANT_ID')
AZURE_AD_JWKS_URI = f'https://login.microsoftonline.com/{AZURE_AD_TENANT_ID}/discovery/v2.0/keys'
#AZURE_AD_REDIRECT_URI = 'http://localhost:8000/auth/callback/'
AZURE_AD_REDIRECT_URI = 'http://74.225.193.42/auth/callback/'# fix 80 port error
AZURE_AD_AUTHORITY = f'https://login.microsoftonline.com/{AZURE_AD_TENANT_ID}'
AZURE_AD_SCOPES = ['openid', 'profile', 'email', 'User.Read']
#FRONTEND_URL = 'http://localhost:5173'  # Your React app URL
FRONTEND_URL = 'http://74.225.193.42' # fix 80 port error loby

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    )
}

# Azure AD JWT claim mappings
AZURE_AD_CLAIM_MAPPING = {
    'email_claims': ['preferred_username', 'email', 'upn', 'unique_name'],
    'name_claims': ['name', 'given_name', 'family_name'],
    'username_claims': ['preferred_username', 'unique_name', 'upn'],
    'oid_claim': 'oid',
}



# Employee ID validation pattern
EMPLOYEE_ID_PATTERN = r'^\d{6, 7}$'  # Assuming 6-digit employee IDs

# JWT Configuration
SIMPLE_JWT = {
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'service_id',
    'USER_ID_CLAIM': 'user_id',
    'TOKEN_OBTAIN_SERIALIZER': 'User_Management.serializers.CustomTokenObtainPairSerializer',
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(minutes=1),
    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=1),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}

# Additional security
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SESSION_COOKIE_SECURE = True  # If using HTTPS
CSRF_COOKIE_SECURE = True     # If using HTTPS

# deploy changes
# Redis cache configuration
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://redis:6379/1',  # Local Redis instance, DB 1
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}
SESSION_COOKIE_SAMESITE = 'None'
