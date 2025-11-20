from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import CalculationResultViewSet,DealerCommissionViewSet

router = DefaultRouter()
router.register(r'calculation-results', CalculationResultViewSet, basename='calculation-results')
router.register(r'dealer-commission', DealerCommissionViewSet, basename='dealer-commission')



urlpatterns = router.urls