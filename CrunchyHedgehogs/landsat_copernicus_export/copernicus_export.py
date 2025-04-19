import ee
from config import COPERNICUS_SETTINGS, EXPORT_SETTINGS
from roi_utils import get_roi_bounds

def process_copernicus_image(roi, project_name):
    """
    Process and export a Copernicus image for the given ROI
    Args:
        roi: ee.Geometry object
        index: Index number for file naming
    """
    # Load Copernicus data
    dataset = ee.imagecollection.ImageCollection(COPERNICUS_SETTINGS['image_id']).first()
    
    # Visualize and export
    img_visualized = dataset.visualize(
        bands=[COPERNICUS_SETTINGS['band']],
        # **COPERNICUS_SETTINGS['visualization']
    )
    
    export_task = ee.batch.Export.image.toDrive(
        image=img_visualized,
        description=f'Copernicus_Image_{project_name}',
        folder=COPERNICUS_SETTINGS['export_folder'],
        fileNamePrefix=f'{project_name}_Copernicus_Image',
        region=get_roi_bounds(roi),
        **EXPORT_SETTINGS
    )
    export_task.start()
    print(f"Started Copernicus export task {project_name}")