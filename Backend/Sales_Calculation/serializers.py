from rest_framework import serializers
from .models import *

class CalculationResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiaCsCalculationResult
        fields = '__all__'

class DetailedResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiaCsCalculationDetailedResult
        fields = '__all__'

class IneligibleSlabSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiaCsIneligibleSlabResult
        fields = '__all__'