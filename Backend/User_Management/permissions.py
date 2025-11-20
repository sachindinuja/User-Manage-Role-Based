from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework import permissions

class IsAuthenticatedOrReadOnly(IsAuthenticated):
    def has_permission(self, request, view):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        return super().has_permission(request, view)

class IsRegionalManager(permissions.BasePermission):
    """
    Custom permission to only allow regional managers.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.user_role == 'REGIONAL_MANAGER'
        )

class IsManagerConsumer(permissions.BasePermission):
    """
    Custom permission to only allow manager consumer.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.user_role == 'MANAGER_CONSUMER'
        )

# class IsSystemAdmin(permissions.BasePermission):
#     """
#     Custom permission to only allow system administrators.
#     """
#     def has_permission(self, request, view):
#         return (
#             request.user and 
#             request.user.is_authenticated and 
#             request.user.user_role == 'SYS_ADMIN'
#         )

class IsSalesOfficer(permissions.BasePermission):
    """
    Custom permission to only allow sales officers.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.user_role == 'SALES_OFFICER'
        )

class IsManagerConsumer(BasePermission):
    def has_permission(self, request, view):
        return request.user.user_role == 'MANAGER_CONSUMER'

class IsFinanceAudit(BasePermission):
    def has_permission(self, request, view):
        return request.user.user_role == 'FINANCE_AUDIT'

class HasReportExportPermission(BasePermission):
    def has_permission(self, request, view):
        allowed_roles = [
            'REGIONAL_MANAGER', 
            'MANAGER_CONSUMER',
            'MANAGER_DEALER',
            'FINANCE_AUDIT'
        ]
        return request.user.user_role in allowed_roles

class HasFullDataAccess(BasePermission):
    def has_permission(self, request, view):
        full_access_roles = [
            'CHIEF_CONSUMER',
            'CHIEF_FINANCE',
            'GM_CONSUMER'
        ]
        return request.user.user_role in full_access_roles