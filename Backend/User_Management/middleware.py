from django.shortcuts import redirect
from django.http import JsonResponse
from django.urls import reverse
import logging

logger = logging.getLogger(__name__)

class RoleRedirectMiddleware:
    """
    Middleware to handle role-based redirections for authenticated users
    """
    def __init__(self, get_response):
        self.get_response = get_response
        # Paths that should be excluded from role-based redirection
        self.excluded_paths = [
            '/admin/',
            '/api/',
            '/auth/',
            '/static/',
            '/media/',
            '/profile/complete/',
            '/lobby/',  # Added lobby to excluded paths
            '/signup/',  # Added signup to excluded paths
        ]

    def __call__(self, request):
        # Process the request
        response = self.get_response(request)
        
        # Only redirect authenticated users on specific paths
        if (request.user.is_authenticated and 
            request.path == '/' and 
            not self._is_excluded_path(request.path)):
            
            # System Admin goes directly to signup
            # if request.user.user_role == 'SYS_ADMIN':
            #     return redirect('/signup/')
            
            # Other users check profile completion
            if not request.user.profile_complete:
                return redirect('/lobby/')
            
            # Get role-based dashboard URL
            dashboard_url = self._get_dashboard_url(request.user.user_role)
            return redirect(dashboard_url)
        
        return response
    
    

class ProfileCompletionMiddleware:
    """
    Middleware to ensure users complete their profile before accessing protected resources
    """
    def __init__(self, get_response):
        self.get_response = get_response
        # Paths that don't require profile completion
        self.excluded_paths = [
            '/admin/',
            '/api/auth/',
            '/api/profile/',
            '/api/lobby/',  # Added lobby to excluded paths
            '/auth/',
            '/static/',
            '/media/',
            '/profile/complete/',
            '/lobby/',  # Added lobby to excluded paths
            '/signup/',  # Added signup to excluded paths
        ]

    def __call__(self, request):
        response = self.get_response(request)
        
        if (request.user.is_authenticated and 
            not self._is_excluded_path(request.path)):
            
            # System Admin bypasses profile completion check
            # if request.user.user_role == 'SYS_ADMIN':
            #     return response
                
            # Check if user profile is complete
            profile_complete = getattr(request.user, 'profile_complete', False)
            if not profile_complete:
                # For API requests, return JSON response
                if request.path.startswith('/api/'):
                    return JsonResponse({
                        'error': 'Profile completion required',
                        'redirect_url': '/lobby/'
                    }, status=403)
                # For regular requests, redirect to lobby
                else:
                    return redirect('/lobby/')
        
        return response
    
    def _is_excluded_path(self, path):
        """Check if the path should be excluded from profile completion check"""
        return any(path.startswith(excluded) for excluded in self.excluded_paths)

class APIAuthMiddleware:
    """
    Middleware to handle authentication for API endpoints
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Add CORS headers for API endpoints
        if request.path.startswith('/api/'):
            response['Access-Control-Allow-Origin'] = '*'
            response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        
        return response