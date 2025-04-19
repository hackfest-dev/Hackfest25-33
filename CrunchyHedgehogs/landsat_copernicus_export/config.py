# Configuration settings shared across modules

# Earth Engine initialization settings
EE_PROJECT = "ee-rahulpaiai23"

# Default export settings
EXPORT_SETTINGS = {
    'scale': 10,
    'maxPixels': 1e13
}

# Landsat settings
LANDSAT_SETTINGS = {
    'collection': 'LANDSAT/LC09/C02/T1_L2',
    'date_range': ('2022-01-01', '2022-02-01'),
    'max_cloud_cover': 5,
    'visualization': {
        'min': 0.0,
        'max': 0.35,
    
    },
    'rgb_bands': ['SR_B4', 'SR_B3', 'SR_B2'],
    'export_folder': 'LandsatExports'
}

# Copernicus settings
COPERNICUS_SETTINGS = {
    'image_id': 'ESA/WorldCover/v200',
    'band': 'Map',
    'visualization': {
        'min': 0,
        'max': 100,
        # 'palette': [
        #     '006400', 'ffbb22', 'ffff4c', 'f096ff', 'fa0000', 
        #     'b4b4b4', 'f0f0f0', '0064c8', '0096a0', '00cf75', 
        #     'fae6a0', 'b40000', '702200', 'b4d79e'
        # ]
    },
    'export_folder': 'CopernicusExports'
}

DRIVE_SETTINGS = {
    'token_file': 'token.json',
    'download_dir': 'downloaded_images',
    'landsat_dir': 'D:\\GlobalStoragePro\\CrunchyHedgehogs\\landsat_copernicus_export\\frontend\\public',       # NEW: Landsat subfolder
    'copernicus_dir': 'copernicus_images', # NEW: Copernicus subfolder
    'wait_timeout': 600,
    'poll_interval': 10,
    'image_conversion': {
        'delete_original': True,  # Whether to delete TIFF after conversion
        'quality': 100,           # PNG quality (1-100)
        'resize': None           # Optional: (width, height) or None
    }
}
GEMINI_MODEL = "gemini-2.0-flash"

API_KEY = "AIzaSyDHue-USShZ-R-45asfNitt3D6569RayWQ"

PROMPT = '''
The following image is processed satellite image 
and the below colors are the classifiers for the image
#006400	Tree cover
#ffbb22	Shrubland
#ffff4c	Grassland
#f096ff	Cropland
#fa0000	Built-up
#b4b4b4	Bare / sparse vegetation
#f0f0f0	Snow and ice
#0064c8	Permanent water bodies
#0096a0	Herbaceous wetland
#00cf75	Mangroves
#fae6a0	Moss and lichen
What would be the best possible coordinates in the image to build a large scale hospital complex
such that it takes into account for the nearby infrastructure and also having sustainablity while also
not trying to destroy nature/landscape/greenery of the place
RETURN ONLY IMAGE COORDINATES IN A TUPLE EXAMPLE "(X,Y)"
do not return any other character other than (x,y)
x,y <= 600
ONLY COORDINATES NOTHING ELSE
give me image coordinates without in respect to the satellite img radius
'''