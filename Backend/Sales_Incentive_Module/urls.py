from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SiaSoTypeViewSet
from .views import PaymentStageViewSet
from .views import ExclusionPackageViewSet
from .views import SlabLevelViewSet
from .views import BearerPCRViewSet
from .views import PEORatesViewSet
from .views import BBPackagePCRViewSet
from .views import LTEBBPackageViewSet
from .views import LTEBBPackagePCRViewSet
from .views import UnlimitedVoicePackagesViewSet
from .views import SchemeViewSet
from .views import SiaCsDataLabCreateView

router = DefaultRouter()
router.register(r'sia-so-types', SiaSoTypeViewSet)
router.register(r'payment-stages', PaymentStageViewSet)
router.register(r'exclusion-packages', ExclusionPackageViewSet)
router.register(r'slab-levels', SlabLevelViewSet)
router.register(r'bearer-pcrs', BearerPCRViewSet)
router.register(r'peo-rates', PEORatesViewSet)
router.register(r'bb-package-pcrs', BBPackagePCRViewSet)
router.register(r'lte-bb-packages', LTEBBPackageViewSet)
router.register(r'lte-bb-package-pcr', LTEBBPackagePCRViewSet)
router.register(r'unlimited-voice-packages', UnlimitedVoicePackagesViewSet)
router.register(r'schemes', SchemeViewSet, basename='scheme')
router.register(r'sia-cs-data-lab', SiaCsDataLabCreateView, basename='sia-cs-data-lab')

urlpatterns = [
    path('', include(router.urls)),
    
]