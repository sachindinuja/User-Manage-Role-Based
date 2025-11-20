from django.contrib import admin
from .models import SiaDlSoTypes
from .models import SiaDlBlacklistPackages
from .models import SiaDlSlabLevels
from .models import SiaDlBearerRate
from .models import SiaDlPackageRate


admin.site.register(SiaDlSoTypes)
admin.site.register(SiaDlBlacklistPackages)
admin.site.register(SiaDlSlabLevels)
admin.site.register(SiaDlBearerRate)
admin.site.register(SiaDlPackageRate)

