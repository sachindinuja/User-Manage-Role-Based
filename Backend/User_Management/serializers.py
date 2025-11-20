from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom JWT serializer to include additional user information in token payload"""
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['user_id'] = user.service_id
        token['name'] = user.name
        token['email'] = user.email
        token['user_role'] = user.user_role
        token['profile_complete'] = user.profile_complete
        token['profile_completed_user'] = user.profile_completed_user
        
        return token

class UserProfileSerializer(serializers.ModelSerializer):
    # profile_completed_user = serializers.CharField(read_only=True)  # This will be set automatically
    
    class Meta:
        model = User
        fields = ['designation', 'contact_number', 'user_role', 'user_category', 'profile_completed_user']
        extra_kwargs = {
            'designation': {'required': True},
            'contact_number': {'required': True},
            'user_role': {'required': True},
            'user_category': {'required': True},
            'profile_completed_user': {'read_only': True}
        }

class UserSerializer(serializers.ModelSerializer):
    user_role = serializers.CharField(source='get_user_role_display')
    user_category = serializers.CharField(source='get_user_category_display')
    profile_complete = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = ['service_id', 'name', 'email', 'designation',
                 'contact_number', 'user_role', 'user_category',
                 'profile_complete', 'is_active']
        extra_kwargs = {
            'service_id': {'read_only': True} # ID shouldn't be modified
        }

class BulkUserSerializer(serializers.Serializer):
    """Serializer for bulk user creation"""
    users = serializers.ListField(
        child=serializers.DictField(),
        allow_empty=False
    )

# NEW: Serializer for updating user details
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'name', 'email', 'designation', 'contact_number', 
            'user_role', 'user_category', 'is_active', 'is_staff'
        ]