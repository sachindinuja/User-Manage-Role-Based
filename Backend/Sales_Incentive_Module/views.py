from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import Scheme, SiaSoType, PaymentStage, ExclusionPackage, SlabLevel, BearerPCR, PEORates, BBPackagePCR, LTEBBPackage, LTEBBPackagePCR, UnlimitedVoicePackages, SiaCsDataLab
from .serializers import LTEBBPackageSerializer, SchemeSerializer, SiaCsDataLabSerializer, SiaSoTypeSerializer, PaymentStageSerializer, ExclusionPackageSerializer, SlabLevelSerializer, BearerPCRSerializer, PEORatesSerializer, BBPackagePCRSerializer, LTEBBPackagePCRSerializer, UnlimitedVoicePackagesSerializer
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView


# ViewSet for managing SiaSoType objects.
# This class provides API endpoints to create, update, retrieve, delete, activate, and deactivate SiaSoType instances.
class SiaSoTypeViewSet(viewsets.ModelViewSet):
    queryset = SiaSoType.objects.all()
    serializer_class = SiaSoTypeSerializer
    
    # Handles creating new SiaSoType objects and validates input data
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Handles updating existing SiaSoType objects with partial updates allowed
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Handles activating a SiaSoType instance
    @action(detail=True, methods=['patch'])
    def activate(self, request, pk=None):
        instance = self.get_object()
        instance.is_active = True
        instance.save()
        return Response({'status': 'Activated'}, status=status.HTTP_200_OK)
    
    # Handles deactivating a SiaSoType instance
    @action(detail=True, methods=['patch'])
    def deactivate(self, request, pk=None):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response({'status': 'Deactivated'}, status=status.HTTP_200_OK)

# ViewSet for managing PaymentStage objects.
# This class provides API endpoints to create, update, retrieve, delete, activate, and deactivate PaymentStage instances.
class PaymentStageViewSet(viewsets.ModelViewSet):
    queryset = PaymentStage.objects.all()
    serializer_class = PaymentStageSerializer

    # Handles creating new PaymentStage objects and validates input data
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Handles updating existing PaymentStage objects with partial updates allowed
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Handles activating a PaymentStage instance
    @action(detail=True, methods=['patch'])
    def activate(self, request, pk=None):
        payment_stage = self.get_object()
        payment_stage.status = "active"
        payment_stage.save()
        return Response({'status': 'activated'}, status=status.HTTP_200_OK)

    # Handles deactivating a PaymentStage instance
    @action(detail=True, methods=['patch'])
    def deactivate(self, request, pk=None):
        payment_stage = self.get_object()
        payment_stage.status = "inactive"
        payment_stage.save()
        return Response({'status': 'deactivated'}, status=status.HTTP_200_OK)

# ViewSet for managing ExclusionPackage objects.
# This class handles API endpoints related to exclusion packages, which define specific items or services excluded from a given offering.
class ExclusionPackageViewSet(viewsets.ModelViewSet):
    queryset = ExclusionPackage.objects.all()
    serializer_class = ExclusionPackageSerializer

    # Handles creating new ExclusionPackage  objects and validates input data
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Handles updating existing ExclusionPackage  objects with partial updates allowed
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Handles activating a ExclusionPackage  instance
    @action(detail=True, methods=['patch'])
    def activate(self, request, pk=None):
        instance = self.get_object()
        instance.is_active = True
        instance.save()
        return Response({'status': 'Activated'}, status=status.HTTP_200_OK)
    
    # Handles deactivating a ExclusionPackage  instance
    @action(detail=True, methods=['patch'])
    def deactivate(self, request, pk=None):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response({'status': 'Deactivated'}, status=status.HTTP_200_OK)
    
# ViewSet for managing SlabLevel objects.
# This class provides API endpoints to create, update, retrieve, delete, activate, and deactivate SlabLevel instances.
   
class SlabLevelViewSet(viewsets.ModelViewSet):
    queryset = SlabLevel.objects.all()
    serializer_class = SlabLevelSerializer

    # Handles creating new SlabLevel  objects and validates input data
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Handles updating existing SlabLevel  objects with partial updates allowed
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Handles activating a SlabLevel instance
    @action(detail=True, methods=['patch'])
    def activate(self, request, pk=None):
        instance = self.get_object()
        instance.is_active = True
        instance.save()
        return Response({'status': 'Activated'}, status=status.HTTP_200_OK)
    
    # Handles deactivating a SlabLevel instance
    @action(detail=True, methods=['patch'])
    def deactivate(self, request, pk=None):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response({'status': 'Deactivated'}, status=status.HTTP_200_OK)
    
# ViewSet for managing BearerPCR objects.
# This class provides API endpoints to create, update, retrieve, delete, activate, and deactivate BearerPCR instances.
class BearerPCRViewSet(viewsets.ModelViewSet):
    queryset = BearerPCR.objects.all()
    serializer_class = BearerPCRSerializer

    # Handles creating new BearerPCR  objects and validates input data
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Handles updating existing BearerPCR  objects with partial updates allowed
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Handles activating a BearerPCR instance
    @action(detail=True, methods=['patch'])
    def activate(self, request, pk=None):
        instance = self.get_object()
        instance.is_active = True
        instance.save()
        return Response({'status': 'Activated'}, status=status.HTTP_200_OK)
    
    # Handles deactivating a BearerPCR instance
    @action(detail=True, methods=['patch'])
    def deactivate(self, request, pk=None):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response({'status': 'Deactivated'}, status=status.HTTP_200_OK)
    
# ViewSet for managing PEORates objects.
# This class provides API endpoints to create, update, retrieve, delete, activate, and deactivate PEORates instances.
class PEORatesViewSet(viewsets.ModelViewSet):
    queryset = PEORates.objects.all()
    serializer_class = PEORatesSerializer

    # Handles creating new PEORates  objects and validates input data
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Handles updating existing PEORates  objects with partial updates allowed
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Handles activating a PEORates instance
    @action(detail=True, methods=['patch'])
    def activate(self, request, pk=None):
        instance = self.get_object()
        instance.is_active = True
        instance.save()
        return Response({'status': 'Activated'}, status=status.HTTP_200_OK)
    
    # Handles deactivating a PEORates instance
    @action(detail=True, methods=['patch'])
    def deactivate(self, request, pk=None):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response({'status': 'Deactivated'}, status=status.HTTP_200_OK)
    
# ViewSet for managing BBPackagePCR objects.
# This class provides API endpoints to create, update, retrieve, delete, activate, and deactivate BBPackagePCR instances.
class BBPackagePCRViewSet(viewsets.ModelViewSet):
    queryset = BBPackagePCR.objects.all()
    serializer_class = BBPackagePCRSerializer

    # Handles creating new BBPackagePCR  objects and validates input data
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Handles updating existing BBPackagePCR  objects with partial updates allowed
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Handles activating a BBPackagePCR instance
    @action(detail=True, methods=['patch'])
    def activate(self, request, pk=None):
        instance = self.get_object()
        instance.is_active = True
        instance.save()
        return Response({'status': 'Activated'}, status=status.HTTP_200_OK)
    
    # Handles deactivating a BBPackagePCR instance
    @action(detail=True, methods=['patch'])
    def deactivate(self, request, pk=None):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response({'status': 'Deactivated'}, status=status.HTTP_200_OK)
    


# ViewSet for managing LTEBBPackage objects.
# This class provides API endpoints to create, update, retrieve, delete, activate, and deactivate LTEBBPackage instances.

class LTEBBPackageViewSet(viewsets.ModelViewSet):
    queryset = LTEBBPackage.objects.all()
    serializer_class = LTEBBPackageSerializer

    # Handles creating new LTEBBPackage  objects and validates input data
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Handles updating existing LTEBBPackage  objects with partial updates allowed
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Handles activating a LTEBBPackage instance
    @action(detail=True, methods=['patch'])
    def activate(self, request, pk=None):
        instance = self.get_object()
        instance.is_active = True
        instance.save()
        return Response({'status': 'Activated'}, status=status.HTTP_200_OK)
    
    # Handles deactivating a LTEBBPackage  instance
    @action(detail=True, methods=['patch'])
    def deactivate(self, request, pk=None):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response({'status': 'Deactivated'}, status=status.HTTP_200_OK)
    
# ViewSet for managing LTEBBPackagePCR objects.
# This class provides API endpoints to create, update, retrieve, delete, activate, and deactivate LTEBBPackagePCR instances.
class LTEBBPackagePCRViewSet(viewsets.ModelViewSet):
   queryset = LTEBBPackagePCR.objects.all()
   serializer_class = LTEBBPackagePCRSerializer

 # Handles creating new LTEBBPackagePCR  objects and validates input data
def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Handles updating existing LTEBBPackagePCR  objects with partial updates allowed
def update(self, request, *args, **kwargs):
    instance = self.get_object()
    serializer = self.get_serializer(instance, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Handles activating a LTEBBPackagePCR instance
@action(detail=True, methods=['patch'])
def activate(self, request, pk=None):
    instance = self.get_object()
    instance.is_active = True
    instance.save()
    return Response({'status': 'Activated'}, status=status.HTTP_200_OK)

# Handles deactivating a LTEBBPackagePCR instance
@action(detail=True, methods=['patch'])
def deactivate(self, request, pk=None):
    instance = self.get_object()
    instance.is_active = False
    instance.save()
    return Response({'status': 'Deactivated'}, status=status.HTTP_200_OK)

# ViewSet for managing UnlimitedVoicePackages objects.
# This class provides API endpoints to create, update, retrieve, delete, activate, and deactivate UnlimitedVoicePackages instances.
class UnlimitedVoicePackagesViewSet(viewsets.ModelViewSet):
    queryset = UnlimitedVoicePackages.objects.all()
    serializer_class = UnlimitedVoicePackagesSerializer

    # Handles creating new UnlimitedVoicePackages  objects and validates input data
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Handles updating existing UnlimitedVoicePackages  objects with partial updates allowed
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Handles activating a UnlimitedVoicePackages instance
    @action(detail=True, methods=['patch'])
    def activate(self, request, pk=None):
        instance = self.get_object()
        instance.is_active = True
        instance.save()
        return Response({'status': 'Activated'}, status=status.HTTP_200_OK)

    # Handles deactivating a UnlimitedVoicePackages instance
    @action(detail=True, methods=['patch'])
    def deactivate(self, request, pk=None):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response({'status': 'Deactivated'}, status=status.HTTP_200_OK)
    
class SchemeViewSet(viewsets.ModelViewSet):
    queryset = Scheme.objects.all()
    serializer_class = SchemeSerializer
    lookup_field = 'SCHEME_NUM'  # Allow lookup by SCHEME_NUM instead of default 'pk'

    def perform_create(self, serializer):
        serializer.save(CREATE_USER=self.request.user.username)

    def perform_update(self, serializer):
        serializer.save(UPDATE_USER=self.request.user.username)

    @action(detail=True, methods=['patch'], url_path='inactive')
    def set_inactive(self, request, scheme_num=None):
        """Set the Scheme's STATUS to 'inactive'."""
        scheme = get_object_or_404(Scheme, SCHEME_NUM=scheme_num)
        if scheme.STATUS == 'inactive':
            return Response(
                {'detail': 'Scheme is already inactive'},
                status=status.HTTP_400_BAD_REQUEST
            )
        scheme.STATUS = 'inactive'
        scheme.UPDATE_USER = request.user.username
        scheme.save()
        serializer = self.get_serializer(scheme)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class SiaCsDataLabCreateView(viewsets.ModelViewSet):
    queryset = SiaCsDataLab.objects.all()
    serializer_class = SiaCsDataLabSerializer