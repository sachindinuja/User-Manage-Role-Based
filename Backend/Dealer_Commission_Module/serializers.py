from rest_framework import serializers
from .models import (
    SiaDlSoTypes,
    SiaDlBlacklistPackages,
    SiaDlSlabLevels,
    SiaDlBearerRate,
    SiaDlPackageRate
)

class SiaDlSoTypesSerializer(serializers.ModelSerializer):
    SO_TYPE_ID = serializers.CharField(required=False, allow_blank=True)

    def validate_SO_TYPE_ID(self, value):
        if value and (not value.startswith('SO') or not value[2:].isdigit()):
            raise serializers.ValidationError("SO_TYPE_ID must be in format SOXXX (e.g., SO001).")
        return value

    class Meta:
        model = SiaDlSoTypes
        fields = '__all__'

class SiaDlBlacklistPackagesSerializer(serializers.ModelSerializer):
    BLP_ID = serializers.CharField(required=False, allow_blank=True)

    def validate_BLP_ID(self, value):
        if value and (not value.startswith('BLP') or not value[3:].isdigit()):
            raise serializers.ValidationError("BLP_ID must be in format BLPXXX (e.g., BLP001).")
        return value

    class Meta:
        model = SiaDlBlacklistPackages
        fields = '__all__'

class SiaDlSlabLevelsSerializer(serializers.ModelSerializer):
    SLAB_ID = serializers.CharField(required=False, allow_blank=True)

    def validate_SLAB_ID(self, value):
        if value and (not value.startswith('SLAB') or not value[4:].isdigit()):
            raise serializers.ValidationError("SLAB_ID must be in format SLABXXX (e.g., SLAB001).")
        return value

    class Meta:
        model = SiaDlSlabLevels
        fields = '__all__'

class SiaDlBearerRateSerializer(serializers.ModelSerializer):
    BEARER_RATE_ID = serializers.CharField(required=False, allow_blank=True)

    def validate_BEARER_RATE_ID(self, value):
        if value and (not value.startswith('BR') or not value[2:].isdigit()):
            raise serializers.ValidationError("BEARER_RATE_ID must be in format BRXXX (e.g., BR001).")
        return value

    class Meta:
        model = SiaDlBearerRate
        fields = '__all__'

class SiaDlPackageRateSerializer(serializers.ModelSerializer):
    PACKAGE_RATE_ID = serializers.CharField(required=False, allow_blank=True)

    def validate_PACKAGE_RATE_ID(self, value):
        if value and (not value.startswith('PR') or not value[2:].isdigit()):
            raise serializers.ValidationError("PACKAGE_RATE_ID must be in format PRXXX (e.g., PR001).")
        return value

    class Meta:
        model = SiaDlPackageRate
        fields = '__all__'