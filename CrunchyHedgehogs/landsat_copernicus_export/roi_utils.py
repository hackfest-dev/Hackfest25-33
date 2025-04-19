import ee
from config import EE_PROJECT

# Initialize Earth Engine
ee.Initialize(project=EE_PROJECT)

def create_roi(lat, lon, buffer_size=3000):
    """
    Create a circular region of interest around given coordinates
    Args:
        lat, lon: Center coordinates
        buffer_size: Radius in meters
    Returns:
        ee.Geometry: Circular ROI
    """
    point = ee.Geometry.Point([lon, lat])
    return point.buffer(buffer_size)

def get_roi_bounds(roi):
    """
    Get the bounding coordinates of an ROI
    Args:
        roi: ee.Geometry object
    Returns:
        list: Bounding coordinates
    """
    return roi.bounds().getInfo()['coordinates']