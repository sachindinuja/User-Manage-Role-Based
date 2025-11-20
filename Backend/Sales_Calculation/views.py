from rest_framework import viewsets
from .models import *
from .serializers import *

class CalculationResultViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SiaCsCalculationResult.objects.all()
    serializer_class = CalculationResultSerializer

class DetailedResultViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SiaCsCalculationDetailedResult.objects.all()
    serializer_class = DetailedResultSerializer

class IneligibleSlabViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SiaCsIneligibleSlabResult.objects.all()
    serializer_class = IneligibleSlabSerializer