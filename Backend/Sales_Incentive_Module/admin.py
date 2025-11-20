from django.contrib import admin
from .models import SiaSoType
from .models import PaymentStage
from .models import ExclusionPackage
from .models import SlabLevel
from .models import BearerPCR
from .models import PEORates
from .models import BBPackagePCR
from .models import LTEBBPackage
from .models import LTEBBPackagePCR
from .models import UnlimitedVoicePackages
from .models import Scheme, SchemeRule
from .models import SiaCsDataLab


admin.site.register(SiaSoType)
admin.site.register(PaymentStage)
admin.site.register(ExclusionPackage)
admin.site.register(SlabLevel)
admin.site.register(BearerPCR)
admin.site.register(PEORates)
admin.site.register(BBPackagePCR)
admin.site.register(LTEBBPackage)
admin.site.register(LTEBBPackagePCR)
admin.site.register(UnlimitedVoicePackages)
admin.site.register(Scheme)
admin.site.register(SchemeRule)
admin.site.register(SiaCsDataLab)