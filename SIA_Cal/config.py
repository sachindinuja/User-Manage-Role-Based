# Database configuration
DATABASE_CONFIG = {
    #'host': 'localhost',
    'host': 'db', #changes
    'database': 'SALES_INCENTIVE', #changes
    'user': 'postgres',
    'password': 'mad123',
    'port': 5432
}

# Slab eligibility products
SLAB_ELIGIBLE_PRODUCTS = [
    'AB-FTTH', 'AB-LTE', 'PEO-COPPER', 'PEO-FTTH', 
    'BB-FTTH', 'CUPON-BEARER', 'CUPON-PACKAGE'
]

# PCR eligible products
PCR_ELIGIBLE_PRODUCTS = [
    'AB-FTTH', 'AB-LTE', 'SIM-LTE', 'ADSL', 
    'PEO-COPPER', 'PEO-FTTH', 'BB-FTTH', 'CUPON-PACKAGE'
]

# Slab level definitions
SLAB_LEVELS = {
    'min_eligible': 10,
    'level1': {'min': 10, 'max': 29, 'rate': 0.40},
    'level2': {'min': 30, 'max': 49, 'rate': 0.60},
    'level3': {'min': 50, 'rate': 1.00}
}

# Stage percentages
STAGE_PERCENTAGES = {
    'stage1': 0.30,
    'stage2': 0.70,
    'stage3': 1.00
}

# Tariff rates with TARIFF_ID and TARIFF_NAME
TARIFF_RATES = {
    # Voice Packages (100% in Stage 1)
    '42520': {'name': 'Unltd Home My Phone 1st Line', 'pcr': 750.00},
    '': {'name': 'Unltd Home My Phone 2nd Line', 'pcr': 750.00},
    '42525': {'name': 'Voice Unltd Office SLT Phone 2nd Line', 'pcr': 750.00},
    '42524': {'name': 'Voice Unltd Office SLT Phone 1st Line', 'pcr': 750.00},
    '42522': {'name': 'Voice Unltd Home SLT Phone 1st Line', 'pcr': 750.00},
    '': {'name': 'Voice Unltd Home SLT Phone 2nd Line', 'pcr': 750.00},
    '': {'name': 'Copper Unltd Home SLT Phone', 'pcr': 750.00},
    '': {'name': 'Copper Unltd Home My Phone', 'pcr': 750.00},
    '': {'name': 'Copper Unltd Religious SLT Phone', 'pcr': 750.00},
    '': {'name': 'Copper Unltd Office SLT Phone', 'pcr': 750.00},
    '36183': {'name': 'Home DP BB 1st Line with My Phone', 'pcr': 750.00},
    '36187': {'name': 'Home TP 1st Line with My Phone', 'pcr': 750.00},
    '43985': {'name': 'Unlimited_My Phone 1st Line', 'pcr': 750.00},
    '43046': {'name': 'Voice Unlimited_TP Trio Vibe', 'pcr': 750.00},

    # FTTH BB Packages
    '38627': {'name': 'Fibre Unlimited 10', 'pcr': 430.00},
    '38929': {'name': 'Fibre Unlimited 25', 'pcr': 780.00},
    '38631': {'name': 'Fibre Unlimited 50', 'pcr': 700.00},
    '43058': {'name': 'Home Bundle Triple Play Trio Vibe Plus', 'pcr': 820.00},
    '43054': {'name': 'Home Bundle Triple Play Trio Shine', 'pcr': 1000.00},
    '': {'name': 'Unlimited Flash 10 Ftth', 'pcr': 2400.00},
    '': {'name': 'Unlimited Family', 'pcr': 2500.00, 'additional': 650.00},
    '': {'name': 'Unlimited Flash 25 Ftth', 'pcr': 4150.00},
    '': {'name': 'Unlimited Boost', 'pcr': 4250.00},
    '': {'name': 'Unlimited Blast', 'pcr': 9000.00, 'additional': 2250.00},
    '': {'name': 'Unlimited Turbo', 'pcr': 12000.00, 'additional': 4000.00},
    '42245': {'name': 'Ultra Flash Prime', 'pcr': 25000.00, 'additional': 5000.00},
    '42239': {'name': 'Ultra Prime', 'pcr': 25000.00, 'additional': 5000.00},
    '41699': {'name': 'Ftth100 Any Flix', 'pcr': 600.00},
    '41703': {'name': 'Ftth100 Any Tide', 'pcr': 1000.00},
    '41701': {'name': 'Ftth100 Any Blaze', 'pcr': 1000.00},
    '41709': {'name': 'Ftth100 Any Glam', 'pcr': 3500.00},
    '41711': {'name': 'Ftth100 Any Delight', 'pcr': 4500.00},
    '41713': {'name': 'Ftth100 Any Xtreme', 'pcr': 6500.00},
    '17193': {'name': 'Ftth Web Family Plus', 'pcr': 700.00},
    '17945': {'name': 'Ftth Web Family Xtra', 'pcr': 1000.00},
    '17947': {'name': 'Ftth Web Pro', 'pcr': 1500.00},
    '34215': {'name': 'Ftth Web Pal', 'pcr': 600.00},
    '43054': {'name': 'Home Bundle Triple Play Trio Shine', 'pcr': 1300.00},
    '43058': {'name': 'Home Bundle Triple Play Trio Vibe', 'pcr': 950.00},
    '43056': {'name': 'Home Bundle Triple Play Trio Vibe Plus', 'pcr': 1000.00},
    '36274': {'name': 'Web Booster', 'pcr': 1200.00},
    '36272': {'name': 'Web Family Active', 'pcr': 800.00},
    # '': {'name': 'Unlimited Broadband', 'pcr': 2000.00},
    '38635': {'name': 'Fibre Unlimited Flash 10', 'pcr': 2400.00},
    '38633': {'name': 'Fibre Unlimited Flash 25', 'pcr': 2400.00},

    # LTE Packages
    '36743': {'name': 'Any Joy', 'pcr': 550.00},
    '36745': {'name': 'Any Beat', 'pcr': 750.00},
    '36747': {'name': 'Any Flix', 'pcr': 750.00},
    '36749': {'name': 'Any Blaze', 'pcr': 1000.00},
    '37253': {'name': 'Any Tide', 'pcr': 1500.00},
    '37255': {'name': 'Any Spike', 'pcr': 2000.00},
    '37257': {'name': 'Any Storm', 'pcr': 2000.00},
    # 'L008': {'name': 'Any Glam', 'pcr': 2000.00},
    # 'L009': {'name': 'Any Delight', 'pcr': 2000.00},
    # 'L010': {'name': 'Any Xtreme', 'pcr': 2000.00},
    '39061': {'name': 'Lte Unlimited Flash 5', 'pcr': 750.00},
    '39063': {'name': 'Lte Unlimited Flash 10', 'pcr': 1500.00},
    '38615': {'name': 'Lte Unlimited 2', 'pcr': 1000.00},
    '38617': {'name': 'Lte Unlimited 4', 'pcr': 2000.00},
    '38619': {'name': 'Lte Unlimited 8', 'pcr': 2000.00},
    '16741': {'name': 'Lte Web Starter', 'pcr': 550.00},
    '16747': {'name': 'Lte Web Family Xtra', 'pcr': 1500.00},
    '16745': {'name': 'Lte Web Family Plus', 'pcr': 750.00},
    '16743': {'name': 'Lteweb Pal', 'pcr': 550.00},
    '16749': {'name': 'Lteweb Pro', 'pcr': 2000.00},
    '36272': {'name': 'Web Family Active', 'pcr': 750.00},
    '30523': {'name': '4g Net Pal', 'pcr': 600.00},
    
    # New Anytime Packages
    # 'L023': {'name': '4g Lte Hbb Anytime 50gb New', 'pcr': 500.00},
    # 'L024': {'name': '4g Lte Hbb Anytime 85gb New', 'pcr': 750.00},
    # 'L025': {'name': '4g Lte Hbb Anytime 115gb New', 'pcr': 1000.00},
    # 'L026': {'name': '4g Lte Hbb Anytime 200gb New', 'pcr': 1500.00},
    # 'L027': {'name': '4g Lte Hbb Anytime 400gb New', 'pcr': 2000.00},

    # PEO Packages
    '43702': {'name': 'Bronze Loyalty Offer 01 6990', 'pcr': 480.00},
    '43704': {'name': 'Bronze Loyalty Offer 02 9990', 'pcr': 480.00},
    '29911': {'name': 'Cu Peo Entertainment', 'pcr': 1400.00},
    '29923': {'name': 'Cu Peo Silver', 'pcr': 800.00},
    '29917': {'name': 'Cu Peo Unnatham', 'pcr': 800.00},
    '42414': {'name': 'Ftth Peo Bronze', 'pcr': 600.00},
    '17929': {'name': 'Ftth Peo Entertainment', 'pcr': 1400.00},
    '17931': {'name': 'Ftth Peo Gold', 'pcr': 1400.00},
    '17933': {'name': 'Ftth Peo Platinum', 'pcr': 1800.00},
    '23357': {'name': 'Ftth Peo Silver', 'pcr': 800.00},
    '17205': {'name': 'Ftth Peo Silver Plus', 'pcr': 1000.00},
    '17935': {'name': 'Ftth Peo Titanium', 'pcr': 2000.00},
    '31986': {'name': 'Peo Family', 'pcr': 1200.00},
    '31984': {'name': 'Peo Family Ftth', 'pcr': 1200.00},
    '24809': {'name': 'Peo Unnatham Ftth', 'pcr': 800.00},
    '36185': {'name': 'Home Dp Peo 1st Line With My Phone', 'pcr': 750.00},
    '25148': {'name': 'Tr 2016 Ftth Office Double Ply 1stline', 'pcr': 1500.00},
    '25646': {'name': 'Web Lite', 'pcr': 1000.00},
    '44220': {'name': 'In Advance Hbb Anytime 50gb', 'pcr': 1000.00},
    '29885': {'name': 'Home Triple Play With My Phone', 'pcr': 2000.00},
    '38627': {'name': 'Fibre Unlimited 10', 'pcr': 500.00},
}

# Exclusion rules
EXCLUSIONS = {
    'CUSTOMER_TYPES': ['SLT'],
    'BB_TARIFF_EXCLUSIONS': [
        'Internet Freedom + Bb Internet Ftth',
        'Internet Freedom + Bb Internet Copper (Adsl)'
    ],
    'LTE_BB_PACKAGES': True,
    'CUPON_SALES': 'CUPON_BEARER'
}

# FTTH Bearer Rates
# FTTH_BEARER_RATES = {
#     'NEW_CONNECTION': {
#         'WITH_BB': {'price': 1000, 'products': ['SLT Smartline Triple Play', 'DOUBLE_PLAY_+_BB']},
#         'WITHOUT_BB': {'price': 600, 'products': ['PEO', 'SINGLE_PLAY', 'PV', 'DP_V+TV']},
#     },
#     'MIGRATION': {
#         'NORMAL': {
#             'WITH_BB': {'price': 1000, 'products': ['TRIPLE_PLAY', 'DOUBLE_PLAY_+_BB']},
#             'WITHOUT_BB': {'price': 600, 'products': ['PEO', 'SINGLE_PLAY', 'PV']},
#         },
#         'GIGA': {
#             'price': 2500, 'products': ['SLT Smartline Double Play (BV)', 'DOUBLE_PLAY_+ SLT Smartline Triple Play', 'TP'],
#             'NEW_CONNECTION_OTHER': {'price': 4000, 'products': ['OTHER_ALL']}
#         }
#     },
#     'RECONNECTION': {
#         'price': 600, 'products': ['PEO', 'SINGLE_PLAY', 'PV']
#     }
# }

# # LTE Bearer Rates
# LTE_BEARER_RATES = {
#     'NEW_CPE': {'PREPAID': 1000, 'POSTPAID': 1000},
#     'REFURBISHED': {'PREPAID': 250, 'POSTPAID': 250},
#     'SIM': {'CONCESSIONARY': 250, 'FULL_PAYMENT': 250}
# }

# # Giga FTTH Packages
# GIGA_FTTH_PACKAGES = [
#     'Unlimited Blast',
#     'Unlimited Turbo',
#     'Ultra Prime',
#     'Ultra Flash Prime'
# ]

FTTH_BEARER_RATES = {
    'NORMAL': {
        'NEW_CONNECTION': {
            'WITH_BB': {'price': 2500, 'products': ['SLT Smartline Triple Play', 'SLT Smartline Double Play (BV)']},
            'WITHOUT_BB': {'price': 2500, 'products': ['PEO', 'SLT Smartline Single Play', 'SLT Smartline Double Play (PV)', 'DP_V+TV']}
            },
            'MIGRATION': {
                'WITH_BB': {'price': 1000, 'products': ['SLT Smartline Triple Play', 'SLT Smartline Double Play (BV)']},
                'WITHOUT_BB': {'price': 600, 'products': ['PEO', 'SLT Smartline Single Play', 'SLT Smartline Double Play (PV)']},
            },
            'RECONNECTION': {
                'WITH_BB': {'price': 1000, 'products': ['SLT Smartline Triple Play', 'SLT Smartline Double Play (BV)']},
                'WITHOUT_BB': {'price': 600, 'products': ['PEO', 'SLT Smartline Single Play', 'SLT Smartline Double Play (PV)']},
            },
        'GIGA': {
            'MIGRATION': {'price': 2500, 'products': ['SLT Smartline Double Play (BV)', 'SLT Smartline Triple Play']},
            'NEW_CONNECTION': {
                
                'price': 4000,
                'products': [
                    'FTTH Home Bundle TP Trio Pet',
                    'FTTH Home Bundle TP Trio Shine',
                    'FTTH Home Bundle TP Trio Vibe',
                    'FTTH Home Bundle TP Trio Vibe Plus',
                    'SLT Fiber Plan Double Play BV',
                    'SLT Fiber Plan Triple Play',
                    'SLT FTTH 1 Gbps Double Play Package (BV)',
                    'SLT FTTH 1 Gbps Triple Play Package',
                    'SLT FTTH Credit Card Offer Double Play Package (BV)',
                    'SLT FTTH DP Unlimited School Learning Package',
                    'SLT FTTH TP Unlimited School Learning Package',
                    'SLT LTE 4G Biz Pal Package',
                    'SLT LTE 4G Net Pal Package',
                    'SLT LTE 4G Voice Pal Basic Package',
                    'SLT LTE Pre-Paid Single Play Package',
                    'SLT LTE Double Play Package',
                    'SLT Megaline Triple Play Package',
                    'SLT Megaline Double Play (PV) Package',
                    'SLT Megaline Double Play (PV) Freedom Package',
                    'SLT Megaline Double Play (BV) Package',
                    'SLT Megaline Single Play Freedom Package',
                    'SLT Smartline Double Play BIZ',
                    'SLT Smartline Triple Play BIZ'
                ]
            }
        }
    }
}

# Enhanced LTE Bearer Rates
LTE_BEARER_RATES = {
    'New CPE': {
        'Prepaid': 1000,
        'Postpaid': {
            'Concessionary': -1500,
            'Full payment': 1750
        }
    },
    'Refurbished': {
        'Prepaid': 750,
        'Postpaid': {
            'Concessionary': 1000,
            'Full payment': 1000
        }
    },
    'SIM': {
        'Prepaid': 0,  # No commission
        'Postpaid': {
            'Concessionary': 250,
            'Full payment': 250
        }
    }
}

# Giga FTTH Packages
GIGA_FTTH_PACKAGES = [
    'Unlimited Blast',
    'Unlimited Turbo',
    'Ultra Prime',
    'Ultra Flash Prime'
]