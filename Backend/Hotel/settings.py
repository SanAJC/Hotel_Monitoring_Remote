"""
Django settings for Hotel project.

Generated by 'django-admin startproject' using Django 5.1.4.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path
import os
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-td8#$69xas$#_xx(d60vqi-$u6$4u0i8f&-6%2^-*wae+m0gt)'

ROOT_CA_PATH = os.path.join(BASE_DIR, 'certs', 'mqtt_root_ca.pem')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']


# Application definition

INSTALLED_APPS = [
    'daphne',
    'unfold',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'authentication',
    'websocket',
    'reports',
    'whitenoise.runserver_nostatic',
    'corsheaders',
]

# Configura el ASGI server
ASGI_APPLICATION = 'Hotel.asgi.application'

# Configura Redis como el backend de canales
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [("127.0.0.1", 6379)],
        },
    },
}

#Configuracion Django unflod

UNFOLD = {
    "SITE_TITLE": "Administración del Hotel",
    "SITE_HEADER": "Hotel Kamila",
    "COLORS": {
         "primary": {
            "50":  "254 242 242",  
            "100": "254 226 226",  
            "200": "254 202 202",  
            "300": "252 165 165",  
            "400": "248 113 113",  
            "500": "239  68  68",  
            "600": "220  38  38",  
            "700": "185  28  28",  
            "800": "153  27  27",  
            "900": "127  29  29",  
            "950": " 69  10  10",  
        },
    },
    "SIDEBAR": {
        "show_search": True,
        "show_all_applications": True,
        "navigation": [
            {
                "title": "Autenticación",
                "items": [
                    {
                        "title": "Usuarios",
                        "icon": "person",
                        "link": "/admin/authentication/user/",
                    }
                ]
            },
            {
                "title": "WebSocket",
                "items": [
                    {
                        "title": "Hoteles",
                        "icon": "hotel",
                        "link": "/admin/websocket/hotel/",
                    },
                    {
                        "title": "Niveles",
                        "icon": "layers",
                        "link": "/admin/websocket/nivel/",
                    },
                    {
                        "title": "Habitaciones",
                        "icon": "bed",
                        "link": "/admin/websocket/habitacion/",
                    },
                    {
                        "title": "Dispositivos",
                        "icon": "devices",
                        "link": "/admin/websocket/dispositivo/",
                    },
                    {
                        "title": "Registros de Consumo",
                        "icon": "electric_bolt",
                        "link": "/admin/websocket/registroconsumo/",
                    },
                    {
                        "title": "Alertas",
                        "icon": "warning",
                        "link": "/admin/websocket/alerta/",
                    }
                ]
            }
        ]
    }
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    "whitenoise.middleware.WhiteNoiseMiddleware",
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True

ROOT_URLCONF = 'Hotel.urls'

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

WSGI_APPLICATION = 'Hotel.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'hotel_db',
        'USER': 'postgres',
        'PASSWORD': 'san_ats',
        'HOST': 'localhost',
        'PORT': '5432',
    },
    'backup': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'hotel_db_back',
        'USER': 'postgres',
        'PASSWORD': 'san_ats',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

DATABASE_ROUTERS = ['Hotel.routers.EnrutadorDeRespaldo']

#Tokern JWT

from datetime import timedelta


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

INSTALLED_APPS += [
    'rest_framework_simplejwt.token_blacklist',
]


#Metodo de autenticacion personalizado
AUTH_USER_MODEL = 'authentication.User'


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'es'

TIME_ZONE = 'America/Bogota'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles') # Aquí se recopilarán los archivos estáticos
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'Hotel/static')  # Asegúrate de incluir el directorio de gestión
]
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"


#Media photos

MEDIA_URL='/media/'
MEDIA_ROOT=BASE_DIR / 'media'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
