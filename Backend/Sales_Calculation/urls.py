from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import CalculationResultViewSet, DetailedResultViewSet, IneligibleSlabViewSet

router = DefaultRouter()
router.register(r'calculation-results', CalculationResultViewSet, basename='calculation-results')
router.register(r'detailed-results', DetailedResultViewSet, basename='detailed-results')
router.register(r'ineligible-slabs', IneligibleSlabViewSet, basename='ineligible-slabs')

urlpatterns = router.urls