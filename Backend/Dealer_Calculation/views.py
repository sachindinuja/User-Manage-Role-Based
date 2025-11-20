from rest_framework import viewsets
from .models import DEALERCOMMISSION, SALESCOUNTREPORTSTAGEII
from .serializers import CalculationResultSerializer, DealerCommissionSerializer

class CalculationResultViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SALESCOUNTREPORTSTAGEII.objects.all()
    serializer_class = CalculationResultSerializer

class DealerCommissionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DEALERCOMMISSION.objects.all()
    serializer_class = DealerCommissionSerializer
