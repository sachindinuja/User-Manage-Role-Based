from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('sales/', include('Sales_Incentive_Module.urls')),  # REST API endpoint
    path('dealer/', include('Dealer_Commission_Module.urls')),  # REST API endpoint for dealer commission module
    path('cal/sales-calculation/', include('Sales_Calculation.urls')),
    path('cal/dealer-calculation/', include('Dealer_Calculation.urls')),

    # user_management
    path('', include('User_Management.urls')),
]