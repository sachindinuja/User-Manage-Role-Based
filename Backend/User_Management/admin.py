from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
from .forms import CustomUserChangeForm, CustomUserCreationForm

class CustomUserAdmin(UserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    list_display = (
        'service_id',
        'name',
        'email',
        'user_role_display',
        'user_category_display',
        'profile_completed_user',
        'is_active',
        'is_staff',
    )
    list_filter = (
        'user_role',
        'user_category',
        'is_active',
        'is_staff',
    )
    fieldsets = (
        (None, {'fields': ('service_id',)}),
        ('Personal Info', {'fields': (
            'name',
            'email',
            'designation',
            'contact_number',
        )}),
        ('Role & Profile', {'fields': (
            'user_role',
            'user_category',
            'profile_completed_user',
        )}),
        ('Permissions', {'fields': (
            'is_active',
            'is_staff',
            'is_superuser',
            'groups',
            'user_permissions',
        )}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'service_id',
                'name',
                'email',
                'designation',
                'contact_number',
                'user_role',
                'user_category',
                'profile_completed_user',
                'password1',
                'password2',
                'is_active',
                'is_staff',
            ),
        }),
    )
    search_fields = ('service_id', 'name', 'email')
    ordering = ('service_id',)
    filter_horizontal = ('groups', 'user_permissions',)

    def save_model(self, request, obj, form, change):
        # If a SYS_ADMIN is saving/updating the user and profile_completed_user is not set,
        # set it to the current user's service_id
        # if (request.user.user_role == 'SYS_ADMIN' and 
        #     obj.profile_complete and 
        #     not obj.profile_completed_user):
        #     obj.profile_completed_user = request.user.service_id
        
        # Clear auth cache on admin save
        from django.core.cache import cache
        cache.delete(f'user_profile_{obj.service_id}')
        super().save_model(request, obj, form, change)

    def user_role_display(self, obj):
        return obj.get_user_role_display()
    user_role_display.short_description = 'Role'

    def user_category_display(self, obj):
        return obj.get_user_category_display()
    user_category_display.short_description = 'Category'

admin.site.register(User, CustomUserAdmin)