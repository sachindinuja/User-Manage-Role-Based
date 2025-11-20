from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import (
    SiaDlSoTypes,
    SiaDlBlacklistPackages,
    SiaDlSlabLevels,
    SiaDlBearerRate,
    SiaDlPackageRate
)
from .serializers import (
    SiaDlSoTypesSerializer,
    SiaDlBlacklistPackagesSerializer,
    SiaDlSlabLevelsSerializer,
    SiaDlBearerRateSerializer,
    SiaDlPackageRateSerializer
)

class BaseViewSet(viewsets.ModelViewSet):
    """
    Base ViewSet to handle common functionality for all models.
    """
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=kwargs.get('partial', False))
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post', 'get', 'put', 'patch'])
    def activate(self, request, pk=None):
        instance = self.get_object()
        instance.STATUS = "Active"
        instance.save()
        return Response({'status': 'Activated'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post', 'get', 'put', 'patch'])
    def deactivate(self, request, pk=None):
        instance = self.get_object()
        instance.STATUS = "Inactive"
        instance.save()
        return Response({'status': 'Deactivated'}, status=status.HTTP_200_OK)

class SiaDlSoTypesViewSet(BaseViewSet):
    queryset = SiaDlSoTypes.objects.all()
    serializer_class = SiaDlSoTypesSerializer

class SiaDlBlacklistPackagesViewSet(BaseViewSet):
    queryset = SiaDlBlacklistPackages.objects.all()
    serializer_class = SiaDlBlacklistPackagesSerializer

class SiaDlSlabLevelsViewSet(BaseViewSet):
    queryset = SiaDlSlabLevels.objects.all()
    serializer_class = SiaDlSlabLevelsSerializer

class SiaDlBearerRateViewSet(BaseViewSet):
    queryset = SiaDlBearerRate.objects.all()
    serializer_class = SiaDlBearerRateSerializer

class SiaDlPackageRateViewSet(BaseViewSet):
    queryset = SiaDlPackageRate.objects.all()
    serializer_class = SiaDlPackageRateSerializer