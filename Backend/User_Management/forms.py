from django import forms
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from .models import User

class CustomUserCreationForm(UserCreationForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta(UserCreationForm.Meta):
        model = User
        fields = (
            'service_id',
            'name',
            'email',
            'designation',
            'contact_number',
            'user_role',
            'user_category',
            'profile_completed_user',
        )
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields.pop('username', None)  # Remove username field

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields.pop('username', None)  # Remove username field
        password = self.fields.get('password')
        if password:
            password.help_text = "Raw passwords are not stored, so there is no way to see this user's password."