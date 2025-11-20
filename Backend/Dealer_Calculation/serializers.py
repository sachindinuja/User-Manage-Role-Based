from rest_framework import serializers
from .models import DEALERCOMMISSION, SALESCOUNTREPORTSTAGEII

class CalculationResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = SALESCOUNTREPORTSTAGEII
        fields = '__all__'

class DealerCommissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DEALERCOMMISSION
        fields = '__all__'
