from rest_framework import serializers
from .models import Scheme, SchemeRule, SiaCsDataLab, SiaSoType
from .models import PaymentStage
from .models import ExclusionPackage
from .models import SlabLevel
from .models import BearerPCR
from .models import PEORates
from .models import BBPackagePCR
from .models import LTEBBPackage
from .models import LTEBBPackagePCR
from .models import UnlimitedVoicePackages


class SiaSoTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiaSoType
        fields = '__all__'

class PaymentStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentStage
        fields = '__all__'
        extra_kwargs = {
            'created_date': {'required': False, 'allow_null': True},
            'created_user': {'required': False, 'allow_null': True},
            'updated_date': {'required': False, 'allow_null': True},
            'updated_user': {'required': False, 'allow_null': True},
        }

class ExclusionPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExclusionPackage
        fields = '__all__'

class SlabLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = SlabLevel
        fields = '__all__'

class BearerPCRSerializer(serializers.ModelSerializer):
    class Meta:
        model = BearerPCR
        fields = '__all__'

class PEORatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PEORates
        fields = '__all__'

class BBPackagePCRSerializer(serializers.ModelSerializer):
    class Meta:
        model = BBPackagePCR
        fields = '__all__'

class LTEBBPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LTEBBPackage
        fields = '__all__'

class LTEBBPackagePCRSerializer(serializers.ModelSerializer):
    class Meta:
        model = LTEBBPackagePCR
        fields = '__all__'

class UnlimitedVoicePackagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnlimitedVoicePackages
        fields = '__all__'
        

class SchemeRuleSerializer(serializers.ModelSerializer):
    RULE_URL = serializers.CharField(read_only=True)
    SCHEME_ID = serializers.PrimaryKeyRelatedField(
        source='SCHEME', 
        queryset=Scheme.objects.all(), 
        write_only=True, 
        required=False
    )
    SCHEME_NUM = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = SchemeRule
        fields = ['ID', 'SCHEME_ID', 'SCHEME_NUM', 'TABLE_NAME', 'RT_ID', 'RULE_URL']

class SchemeSerializer(serializers.ModelSerializer):
    RULES = SchemeRuleSerializer(source='rules_by_id', many=True, read_only=True)
    RULES_DATA = SchemeRuleSerializer(many=True, write_only=True, required=False)
    ATTACHMENT_URL = serializers.SerializerMethodField()

    class Meta:
        model = Scheme
        fields = '__all__'

    def get_ATTACHMENT_URL(self, obj):
        if obj.ATTACHMENT:
            return obj.ATTACHMENT.url
        return None

    def create(self, validated_data):
        rules_data = validated_data.pop('RULES_DATA', [])
        attachment = validated_data.pop('ATTACHMENT', None)
        scheme = Scheme.objects.create(**validated_data)
        
        if attachment:
            scheme.ATTACHMENT = attachment
            scheme.save()
            
        for rule_data in rules_data:
            rule_data.pop('SCHEME_ID', None)
            rule_data.pop('SCHEME_NUM', None)
            SchemeRule.objects.create(SCHEME=scheme, SCHEME_NUM=scheme.SCHEME_NUM, **rule_data)
        return scheme

    def update(self, instance, validated_data):
        rules_data = validated_data.pop('RULES_DATA', None)
        attachment = validated_data.pop('ATTACHMENT', None)

        # Update Scheme fields
        instance.SCHEME_NUM = validated_data.get('SCHEME_NUM', instance.SCHEME_NUM)
        instance.SCHEME_NAME = validated_data.get('SCHEME_NAME', instance.SCHEME_NAME)
        instance.STATUS = validated_data.get('STATUS', instance.STATUS)
        instance.START_DATE = validated_data.get('START_DATE', instance.START_DATE)
        
        if attachment is not None:
            instance.ATTACHMENT = attachment
            
        instance.save()

        # Update nested SchemeRule instances if RULES_DATA is provided
        if rules_data is not None:
            instance.rules_by_id.all().delete()
            for rule_data in rules_data:
                rule_data.pop('SCHEME_ID', None)
                rule_data.pop('SCHEME_NUM', None)
                SchemeRule.objects.create(SCHEME=instance, SCHEME_NUM=instance.SCHEME_NUM, **rule_data)

        return instance
    
class SiaCsDataLabSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiaCsDataLab
        fields = '__all__'