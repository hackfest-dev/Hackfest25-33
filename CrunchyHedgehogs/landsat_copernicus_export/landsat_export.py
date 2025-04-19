import ee
from config import LANDSAT_SETTINGS, EXPORT_SETTINGS
from roi_utils import get_roi_bounds

def process_landsat_image(roi, project_name):
    """
    Process and export a Landsat image for the given ROI
    Args:
        roi: ee.Geometry object
        index: Index number for file naming
    """
    # Load and filter Landsat data
    dataset = (ee.ImageCollection(LANDSAT_SETTINGS['collection'])
               .filterDate(*LANDSAT_SETTINGS['date_range'])
               .filterBounds(roi)
               .filterMetadata('CLOUD_COVER', 'less_than', 
                             LANDSAT_SETTINGS['max_cloud_cover']))
    
    # Rescale bands
    def rescale(image):
        optical = image.select('SR_B.*').multiply(0.0000275).add(-0.2)
        thermal = image.select('ST_B.*').multiply(0.00341802).add(149.0)
        return image.addBands(optical, None, True).addBands(thermal, None, True)
    
    # Process image
    img = dataset.map(rescale).median()
    rgb_img = img.select(LANDSAT_SETTINGS['rgb_bands'])
    
    # Visualize and export
    img_visualized = rgb_img.visualize(**LANDSAT_SETTINGS['visualization'])
    
    export_task = ee.batch.Export.image.toDrive(
        image=img_visualized,
        description=f'Landsat_Image_{project_name}',
        folder=LANDSAT_SETTINGS['export_folder'],
        fileNamePrefix=f'{project_name}_Landsat_Image',
        region=get_roi_bounds(roi),
        **EXPORT_SETTINGS
    )
    export_task.start()
    print(f"Started Landsat export task {project_name}")