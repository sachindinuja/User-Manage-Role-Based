from django.shortcuts import redirect
from django.core.cache import cache
from django.db import IntegrityError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenRefreshView as BaseTokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken, UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
import uuid
from rest_framework.decorators import api_view, permission_classes
from requests_oauthlib import OAuth2Session
import logging
import secrets
import json
import re
import requests
from jose import jwt
from jose.exceptions import JWTError
from django.conf import settings
from .models import User
from .serializers import UserSerializer, UserProfileSerializer, BulkUserSerializer, UserUpdateSerializer
from .permissions import IsRegionalManager, IsManagerConsumer


# Configure logger
logger = logging.getLogger(__name__)

class AzureLoginInitiate(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        state = secrets.token_urlsafe(16)
        cache.set(f'azure_state_{state}', True, timeout=300)
        
        azure = OAuth2Session(
            settings.AZURE_AD_CLIENT_ID,
            redirect_uri=settings.AZURE_AD_REDIRECT_URI,
            scope=settings.AZURE_AD_SCOPES
        )
        
        authorization_url = azure.authorization_url(
            f'{settings.AZURE_AD_AUTHORITY}/oauth2/v2.0/authorize',
            state=state,prompt='login'
        )[0]
        
        return redirect(authorization_url)

class AzureLoginCallback(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        state = request.GET.get('state')
        code = request.GET.get('code')
        
        if not code:
            return redirect(f'{settings.FRONTEND_URL}/login?error=missing_code')
        
        if not cache.get(f'azure_state_{state}'):
            return redirect(f'{settings.FRONTEND_URL}/login?error=invalid_state')

        try:
            azure = OAuth2Session(
                settings.AZURE_AD_CLIENT_ID,
                redirect_uri=settings.AZURE_AD_REDIRECT_URI
            )
            
            token = azure.fetch_token(
                f'{settings.AZURE_AD_AUTHORITY}/oauth2/v2.0/token',
                code=code,
                client_secret=settings.AZURE_AD_CLIENT_SECRET,
                method='POST',
                headers={
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            )
        except requests.exceptions.RequestException as e:
            error_msg = e.response.json().get('error_description', 'token_failure') if hasattr(e, 'response') else 'token_failure'
            return redirect(f'{settings.FRONTEND_URL}/login?error={error_msg}')
        
        try:
            id_token = token['id_token']
            jwks = requests.get(settings.AZURE_AD_JWKS_URI).json()
            decoded = jwt.decode(
                id_token,
                key=jwks,
                algorithms=['RS256'],
                audience=settings.AZURE_AD_CLIENT_ID,
                options={
                    'verify_signature': True,
                    'verify_aud': True,
                    'verify_exp': True
                }
            )
        except JWTError as e:
            logger.error(f"JWT decode error: {str(e)}")
            return redirect(f'{settings.FRONTEND_URL}/login?error=invalid_token')
        
        try:
            # Extract user information from JWT token
            oid = decoded.get('oid')  # Azure AD Object ID
            name = decoded.get('name', 'Unknown User')
            email = decoded.get('preferred_username') or decoded.get('email') or decoded.get('upn')
            username = decoded.get('preferred_username') or decoded.get('unique_name')
            
            # Log the decoded token for debugging (remove in production)
            logger.info(f"Decoded JWT claims: {list(decoded.keys())}")
            logger.info(f"Email from token: {email}")
            logger.info(f"Username from token: {username}")

            if not email:
                logger.error("No email found in JWT token")
                return redirect(f'{settings.FRONTEND_URL}/login?error=missing_email')

            # Extract employee ID from email
            employee_id = self.extract_employee_id_from_email(email)
            
            if not employee_id:
                logger.error(f"Could not extract employee ID from email: {email}")
                return redirect(f'{settings.FRONTEND_URL}/login?error=invalid_email_format')

            # Use employee ID as service_id
            service_id = employee_id

            user, created = User.objects.update_or_create(
                service_id=service_id,
                defaults={
                    'name': name,
                    'email': email,
                    'azure_oid': oid,  # Store Azure OID separately if needed
                }
            )

            if created:
                logger.info(f"New user created: {service_id} - {name}")
            else:
                logger.info(f"Existing user updated: {service_id} - {name}")

        except IntegrityError as e:
            logger.error(f"User creation failed: {str(e)}")
            return redirect(f'{settings.FRONTEND_URL}/login?error=database_error')
        
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return redirect(f'{settings.FRONTEND_URL}/login?error=user_creation_failed')
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        
        # Store tokens temporarily with a unique session ID
        session_id = str(uuid.uuid4())
        cache.set(f'auth_session_{session_id}', {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user_id': user.service_id
        }, timeout=300)  # 5 minutes
        
        # MODIFIED: Remove SYS_ADMIN special redirect - all users go to lobby if profile incomplete
        if not user.profile_complete:
            # All users with incomplete profiles go to lobby
            redirect_url = f'{settings.FRONTEND_URL}/lobby'
        else:
            # Users with complete profiles go to their role-specific dashboard
            redirect_url = self.get_dashboard_url(user.user_role)
        
        return redirect(f'{redirect_url}?session={session_id}')
    
    def extract_employee_id_from_email(self, email):
        """
        Extract employee ID from email address
        Expected format: employeeID@intranet.slt.com.lk
        Example: 011569@intranet.slt.com.lk -> 011569
        """
        if not email:
            return None
            
        try:
            # Check if email matches the expected format
            if '@intranet.slt.com.lk' in email or 'virajinduruwa550outlook.onmicrosoft.com' in email:
                employee_id = email.split('@')[0]
                # Validate that employee_id contains only digits
                if employee_id.isdigit():
                    return employee_id
                else:
                    logger.warning(f"Employee ID contains non-digit characters: {employee_id}")
            
            # Alternative: Try to extract digits from the beginning of email
            match = re.match(r'^(\d+)', email.split('@')[0])
            if match:
                return match.group(1)
                
            logger.warning(f"Could not extract employee ID from email: {email}")
            return None
            
        except Exception as e:
            logger.error(f"Error extracting employee ID from email {email}: {str(e)}")
            return None
    
    def get_dashboard_url(self, user_role):
        """Get dashboard URL based on user role"""
        role_dashboard_map = {
            # 'SYS_ADMIN': f'{settings.FRONTEND_URL}/salesincentive/analytics',  # Removed SYS_ADMIN special case
            'REGIONAL_GM': f'{settings.FRONTEND_URL}/lobby',
            'PROVINCIAL_DGM': f'{settings.FRONTEND_URL}/lobby',
            'REGIONAL_MANAGER': f'{settings.FRONTEND_URL}/lobby',
            'SALES_MANAGER': f'{settings.FRONTEND_URL}/lobby',
            'SALES_OFFICER': f'{settings.FRONTEND_URL}/lobby',
            'CHIEF_CONSUMER': f'{settings.FRONTEND_URL}/lobby',
            'CHIEF_FINANCE': f'{settings.FRONTEND_URL}/lobby',
            'GM_CONSUMER': f'{settings.FRONTEND_URL}/lobby',
            'DGM_SALES': f'{settings.FRONTEND_URL}/lobby',
            'DGM_CHANNEL': f'{settings.FRONTEND_URL}/lobby',
            'MANAGER_CONSUMER': f'{settings.FRONTEND_URL}/lobby',
            'MANAGER_DEALER': f'{settings.FRONTEND_URL}/lobby',
            'FINANCE_AUDIT': f'{settings.FRONTEND_URL}/lobby',
        }
        return role_dashboard_map.get(user_role, f'{settings.FRONTEND_URL}/dashboard')

# Additional utility function for debugging JWT tokens
def debug_jwt_token(id_token):
    """
    Debug function to inspect JWT token claims
    Remove this in production
    """
    try:
        # Decode without verification for debugging
        import base64
        import json
        
        # Split the JWT token
        header, payload, signature = id_token.split('.')
        
        # Add padding if needed
        payload += '=' * (4 - len(payload) % 4)
        
        # Decode the payload
        decoded_payload = base64.urlsafe_b64decode(payload)
        claims = json.loads(decoded_payload)
        
        logger.info("Available JWT claims:")
        for key, value in claims.items():
            logger.info(f"  {key}: {value}")
            
        return claims
    except Exception as e:
        logger.error(f"Error debugging JWT token: {str(e)}")
        return None

# NEW: Lobby view for users with incomplete profiles
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_lobby_info(request):
    """Get lobby information for users with incomplete profiles"""
    user = request.user
    
    # MODIFIED: Remove SYS_ADMIN special case
    return Response({
        'service_id': user.service_id,
        'name': user.name,
        'email': user.email,
        'profile_status': 'Pending' if not user.profile_complete else 'Complete',
        'profile_complete': user.profile_complete,
        'message': 'Your profile is not complete. Please contact the system administrator.' if not user.profile_complete else 'Profile is complete.',
        'user_role': user.get_user_role_display() if user.user_role else 'Not Assigned'
    })

class TokenExchangeView(APIView):
    """Exchange session ID for actual tokens"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        session_id = request.data.get('session_id')
        
        if not session_id:
            return Response({'error': 'Session ID required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Retrieve tokens from cache
        session_data = cache.get(f'auth_session_{session_id}')
        
        if not session_data:
            return Response({'error': 'Invalid or expired session'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Delete session from cache (one-time use)
        cache.delete(f'auth_session_{session_id}')
        
        return Response({
            'access': session_data['access_token'],
            'refresh': session_data['refresh_token'],
            'user_id': session_data['user_id']
        })

class TokenRefreshView(BaseTokenRefreshView):
    """Custom token refresh view"""
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            
            logger.info(f"Token refreshed for user")
        
        return response


class TokenVerifyView(APIView):
    """Verify if access token is valid"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # If we reach here, the token is valid (due to IsAuthenticated)
            user = request.user
            return Response({
                'valid': True,
                'user_id': user.service_id,
                'user_role': user.user_role,
                'profile_complete': user.profile_complete,
                'name': user.name,
                'email': user.email
            })
        except Exception as e:
            return Response({
                'valid': False,
                'error': str(e)
            }, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    """Logout and blacklist refresh token"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            return Response({
                'message': 'Successfully logged out'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': 'Invalid token'
            }, status=status.HTTP_400_BAD_REQUEST)

class CompleteProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Handle profile completion via POST method"""
        return self._handle_profile_completion(request)
    
    def put(self, request):
        """Handle profile completion via PUT method"""
        return self._handle_profile_completion(request)
    
    def _handle_profile_completion(self, request):
        """Common logic for both POST and PUT methods"""
        # MODIFIED: Remove SYS_ADMIN special case
        if request.user.profile_complete:
            return Response({'error': 'Profile already complete'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            # Set the profile_completed_user to the current user (who should be a SYS_ADMIN)
            # Note: In a real scenario, this would be set by the SYS_ADMIN who is completing the profile
            # For now, we'll assume the profile is being completed by a SYS_ADMIN
            user = serializer.save()
            
            # If you want to track which SYS_ADMIN completed the profile, you could do:
            # user.profile_completed_user = request.user.service_id  # Assuming the requester is SYS_ADMIN
            # user.save()
            
            # Return role-based redirect URL after profile completion
            dashboard_url = self.get_dashboard_url(user.user_role)
            
            return Response({
                'user': UserSerializer(user).data,
                'redirect_url': dashboard_url,
                'message': 'Profile completed successfully'
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # def get_dashboard_url(self, user_role):
    #     """Get dashboard URL based on user role"""
    #     role_dashboard_map = {
    #         'SYS_ADMIN': '/salesincentive/analytics',
    #         'REGIONAL_GM': '/regional-gm/dashboard',
    #         'PROVINCIAL_DGM': '/provincial-dgm/dashboard',
    #         'REGIONAL_MANAGER': '/regional-manager/dashboard',
    #         'SALES_MANAGER': '/sales-manager/dashboard',
    #         'SALES_OFFICER': '/sales-officer/dashboard',
    #         'CHIEF_CONSUMER': '/chief-consumer/dashboard',
    #         'CHIEF_FINANCE': '/chief-finance/dashboard',
    #         'GM_CONSUMER': '/gm-consumer/dashboard',
    #         'DGM_SALES': '/dgm-sales/dashboard',
    #         'DGM_CHANNEL': '/dgm-channel/dashboard',
    #         'MANAGER_CONSUMER': '/manager-consumer/dashboard',
    #         'MANAGER_DEALER': '/manager-dealer/dashboard',
    #         'FINANCE_AUDIT': '/finance-audit/dashboard',
    #     }
    #     return role_dashboard_map.get(user_role, '/dashboard')

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

# MODIFIED: API endpoint to get user's dashboard URL with new logic
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_dashboard_url(request):
    """Get the appropriate dashboard URL for the authenticated user"""
    user = request.user
    
    # MODIFIED: Remove SYS_ADMIN special logic
    # Other users - check profile completion
    if not user.profile_complete:
        return Response({
            'redirect_url': '/lobby',
            'message': 'Profile completion required - Redirecting to lobby',
            'profile_complete': user.profile_complete
        })
    
    # Users with complete profiles
    # role_dashboard_map = {
    #     'REGIONAL_GM': '/regional-gm/dashboard',
    #     'PROVINCIAL_DGM': '/provincial-dgm/dashboard',
    #     'REGIONAL_MANAGER': '/regional-manager/dashboard',
    #     'SALES_MANAGER': '/sales-manager/dashboard',
    #     'SALES_OFFICER': '/sales-officer/dashboard',
    #     'CHIEF_CONSUMER': '/chief-consumer/dashboard',
    #     'CHIEF_FINANCE': '/chief-finance/dashboard',
    #     'GM_CONSUMER': '/gm-consumer/dashboard',
    #     'DGM_SALES': '/dgm-sales/dashboard',
    #     'DGM_CHANNEL': '/dgm-channel/dashboard',
    #     'MANAGER_CONSUMER': '/manager-consumer/dashboard',
    #     'MANAGER_DEALER': '/manager-dealer/dashboard',
    #     'FINANCE_AUDIT': '/finance-audit/dashboard',
    # }
    
    # dashboard_url = role_dashboard_map.get(user.user_role, '/dashboard')
    dashboard_url = '/dashboard'  # Placeholder
    
    return Response({
        'redirect_url': dashboard_url,
        'user_role': user.get_user_role_display(),
        'profile_complete': user.profile_complete
    })

class UserManagementView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get all users - Admin only"""
        # if request.user.user_role != 'SYS_ADMIN':
        #     return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """Create users in bulk"""
        # if request.user.user_role != 'SYS_ADMIN':
        #     return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
        serializer = BulkUserSerializer(data=request.data)
        if serializer.is_valid():
            users_data = serializer.validated_data.get('users', [])
            created_users = []
            
            for user_data in users_data:
                try:
                    user = User.objects.create(**user_data)
                    created_users.append(user)
                except IntegrityError:
                    continue
            
            return Response({
                'status': f'{len(created_users)} users created successfully',
                'created_count': len(created_users)
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# NEW: Public CRUD endpoints for user management (no authentication required)
class UserListView(APIView):
    permission_classes = [AllowAny]  # No authentication required
    
    def get(self, request):
        """Get all users"""
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class UserDetailView(APIView):
    permission_classes = [AllowAny]  # No authentication required
    
    def get_object(self, service_id):
        try:
            return User.objects.get(service_id=service_id)
        except User.DoesNotExist:
            return None

    def get(self, request, service_id):
        """Get user details"""
        user = self.get_object(service_id)
        if user is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, service_id):
        """Update user details"""
        user = self.get_object(service_id)
        if user is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserUpdateSerializer(user, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # UPDATED: More comprehensive role-based dashboard data including System Admin
        role_data = {
            # 'SYS_ADMIN': {  # Removed SYS_ADMIN
            #     'total_users': User.objects.count(),
            #     'pending_profiles': User.objects.filter(profile_complete=False).count(),
            #     'message': 'System Administrator Dashboard'
            # },
            'REGIONAL_GM': {
                'total_sales': 15000, 
                'region': 'North',
                'message': 'Regional GM Dashboard'
            },
            'REGIONAL_MANAGER': {
                'pending_approvals': 5, 
                'team_performance': 85,
                'message': 'Regional Manager Dashboard'
            },
            'SALES_OFFICER': {
                'personal_sales': 45, 
                'current_incentive': 2500,
                'message': 'Sales Officer Dashboard'
            },
            'MANAGER_CONSUMER': {
                'national_sales': 45000, 
                'pending_changes': 12,
                'message': 'Manager Consumer Dashboard'
            },
            'FINANCE_AUDIT': {
                'pending_audits': 8,
                'completed_audits': 25,
                'message': 'Finance & Audit Dashboard'
            }
        }
        
        default_data = {'message': 'Welcome to Dashboard'}
        return Response(role_data.get(user.user_role, default_data))