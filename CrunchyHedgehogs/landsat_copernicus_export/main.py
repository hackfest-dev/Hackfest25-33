import os
from roi_utils import create_roi
from landsat_export import process_landsat_image
from copernicus_export import process_copernicus_image
from drive_utils import DriveManager
from config import COPERNICUS_SETTINGS, LANDSAT_SETTINGS , DRIVE_SETTINGS
from image_utils import ImageConverter
# from flask import Flask, request, jsonify
# import os
from gemini import algorithm

def process_coordinates(coord_list, project_name):
    """
    Process a list of coordinates to export both Landsat and Copernicus images,
    then download and clean up from Drive.
    """
    drive_manager = DriveManager()
    
    for i, (lat, lon) in enumerate(coord_list, 1):
        print(f"\nProcessing coordinates {i}: ({lat}, {lon})")
        
        # Create ROI
        roi = create_roi(lat, lon)
        
        # Export images
        landsat_prefix = f'{project_name}_Landsat_Image'
        copernicus_prefix = f'{project_name}_Copernicus_Image'
        drive_manager.delete_all_files_in_drive_folder(LANDSAT_SETTINGS['export_folder'])
        drive_manager.delete_all_files_in_drive_folder(COPERNICUS_SETTINGS['export_folder'])
        process_landsat_image(roi, project_name)
        process_copernicus_image(roi, project_name)
        
        # Process Landsat export
        print("\nProcessing Landsat export...")
        landsat_path = drive_manager.process_export(
            LANDSAT_SETTINGS['export_folder'],
            landsat_prefix,
            folder_type='landsat'  # NEW: Specify folder type
        )
        
        # Process Copernicus export
        print("\nProcessing Copernicus export...")
        copernicus_path = drive_manager.process_export(
            COPERNICUS_SETTINGS['export_folder'],
            copernicus_prefix,
            folder_type='copernicus'  # NEW: Specify folder type
        )
        
        print(f"\nCompleted processing for coordinate {i}:")
        print(f"Landsat saved to: {landsat_path}")
        print(f"Copernicus saved to: {copernicus_path}")
        print("\nConverting downloaded files to PNG...")
    landsat_converted = ImageConverter.process_directory(
        os.path.join(DRIVE_SETTINGS['download_dir'], DRIVE_SETTINGS['landsat_dir'])
    )
    copernicus_converted = ImageConverter.process_directory(
        os.path.join(DRIVE_SETTINGS['download_dir'], DRIVE_SETTINGS['copernicus_dir'])
    )

    print(f"\nConversion complete:")
    print(f"Landsat PNGs: {len(landsat_converted)} files")
    print(f"Copernicus PNGs: {len(copernicus_converted)} files")
    

if __name__ == "__main__":
    project = "Anisha"
    coordinates= [#(40.741895,-73.989308),
                  (12.884149081259784,74.85278629437317)]
    process_coordinates(coord_list=coordinates, project_name=project)
    t_n = algorithm(project)
    a = ImageConverter
    points = [(0,500),(570,570),(570,87),(50,50)]
    x = a.roi_definer(points,project)
    a.highlight_point_if_inside_polygon(x,points,t_n,project)