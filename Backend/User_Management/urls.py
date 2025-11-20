from django.urls import path
from . import views

urlpatterns = [
    # Azure AD Authentication
    path('auth/login/', views.AzureLoginInitiate.as_view(), name='azure_login'),
    path('auth/callback/', views.AzureLoginCallback.as_view(), name='azure_callback'),
    
    # Token Management
    path('api/auth/token/refresh/', views.TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/token/verify/', views.TokenVerifyView.as_view(), name='token_verify'),
    path('api/auth/exchange/', views.TokenExchangeView.as_view(), name='token_exchange'),
    path('api/auth/logout/', views.LogoutView.as_view(), name='logout'),
    
    # User Profile Management
    path('api/profile/', views.UserProfileView.as_view(), name='user_profile'),
    path('api/profile/complete/', views.CompleteProfileView.as_view(), name='complete_profile'),
    
    # Lobby for incomplete profiles
    path('api/lobby/', views.get_lobby_info, name='lobby_info'),
    
    # Dashboard Navigations
    path('api/user/dashboard-url/', views.get_user_dashboard_url, name='user_dashboard_url'),
    
    # User Management (Admin functions)
    path('api/users/', views.UserManagementView.as_view(), name='user_management'),
    
    # NEW: Public CRUD endpoints
    path('api/public/users/', views.UserListView.as_view(), name='public_user_list'),
    path('api/public/users/<str:service_id>/', views.UserDetailView.as_view(), name='public_user_detail'),
]