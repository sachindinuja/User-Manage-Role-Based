from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SiaDlSoTypesViewSet
from .views import SiaDlBlacklistPackagesViewSet
from .views import SiaDlSlabLevelsViewSet  
from .views import SiaDlBearerRateViewSet
from .views import SiaDlPackageRateViewSet

router = DefaultRouter()
router.register(r'sia-dl-so-types', SiaDlSoTypesViewSet)
router.register(r'sia-dl-blacklist-packages', SiaDlBlacklistPackagesViewSet)
router.register(r'sia-dl-slab-levels', SiaDlSlabLevelsViewSet)
router.register(r'sia-dl-bearer-rate', SiaDlBearerRateViewSet)
router.register(r'sia-dl-package-rate', SiaDlPackageRateViewSet)
urlpatterns = [
    path('', include(router.urls)),
]
