import os
from PIL import Image, ImageDraw
import rasterio

# from config import DRIVE_SETTINGS

class ImageConverter:
    @staticmethod
    def tif_to_png(tif_path):
        """Convert TIFF to PNG while preserving geospatial data"""
        try:
            # Create output path
            png_path = os.path.splitext(tif_path)[0] + '.png'
            
            # Read TIFF with rasterio to handle geospatial data
            with rasterio.open(tif_path) as src:
                # Read all bands
                data = src.read()
                # profile = src.profile
            
            # Convert to PNG (using first 3 bands for RGB)
            if len(data) >= 3:
                rgb_data = data[:3]  # Take first 3 bands
                rgb_data = rgb_data.transpose(1, 2, 0)  # Change to HWC format
                
                # Normalize to 0-255 range
                rgb_data = ((rgb_data - rgb_data.min()) * (255 / (rgb_data.max() - rgb_data.min()))).astype('uint8')
                
                # Save as PNG
                Image.fromarray(rgb_data).save(png_path)
                print(f"Converted {os.path.basename(tif_path)} to PNG")
                
                # Optionally delete original TIFF
                os.remove(tif_path)
                return png_path
            else:
                print(f"Not enough bands in {tif_path} for RGB conversion")
                return None
                
        except Exception as e:
            print(f"Failed to convert {tif_path}: {str(e)}")
            return None

    @staticmethod
    def process_directory(directory):
        """Convert all TIFFs in a directory to PNGs"""
        converted_files = []
        for filename in os.listdir(directory):
            if filename.lower().endswith('.tif') or filename.lower().endswith('.tiff'):
                tif_path = os.path.join(directory, filename)
                png_path = ImageConverter.tif_to_png(tif_path)
                if png_path:
                    converted_files.append(png_path)
        return converted_files
    


    def resize_image(image_path, output_path, new_width, new_height):
        """
        Resizes an image to the specified dimensions.

        Args:
            image_path (str): Path to the input image.
            output_path (str): Path to save the resized image.
            new_width (int): Desired width of the resized image.
            new_height (int): Desired height of the resized image.
        """
        try:
            img = Image.open(image_path)
            resized_img = img.resize((new_width, new_height))
            resized_img.save(output_path)
            print(f"Image resized and saved to {output_path}")
        except FileNotFoundError:
            print(f"Error: Image file not found at {image_path}")
        except Exception as e:
            print(f"An error occurred: {e}")
            
    def resizer(project_name):
        image_path = f"D:\\GlobalStoragePro\\CrunchyHedgehogs\\landsat_copernicus_export\\downloaded_images\\copernicus_images\\{project_name}_Copernicus_Image.png"
        
        ImageConverter.resize_image(image_path, image_path, 600,600)
        #landsat resize
        image_path = f"D:\\GlobalStoragePro\\CrunchyHedgehogs\\landsat_copernicus_export\\downloaded_images\\landsat_images\\{project_name}_Landsat_Image.png"
        
        ImageConverter.resize_image(image_path, image_path, 600,600)

    def roi_definer(points, project_name):
        # 1. Load the image
        image = Image.open(f"D:\\GlobalStoragePro\\CrunchyHedgehogs\\landsat_copernicus_export\\downloaded_images\\landsat_images\\{project_name}_Landsat_Image.png").convert("RGBA")  # Replace with your image path
        # image = Image.open("your_image.jpg").convert("RGBA")
        width, height = image.size

        # 2. Define the four points of the polygon (in order)
        pts = points

        # 3. Create a semi-transparent blue overlay
        overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))  # Transparent
        draw = ImageDraw.Draw(overlay)
        draw.polygon(pts, fill=(100, 200, 255, 128))  # Light blue with 50% opacity (alpha=128)

        # 4. Blend the overlay with the original image
        highlighted_image = Image.alpha_composite(image, overlay)
        img_file = f"D:\\GlobalStoragePro\\CrunchyHedgehogs\\landsat_copernicus_export\\downloaded_images\\landsat_images\\{project_name}_Landsat_Image.png"
        # 5. Save/display the result (convert back to RGB if saving as JPEG)
        # highlighted_image.show()
        highlighted_image.convert("RGB").save(img_file)
        return img_file  # JPEG doesn't support transparency  # Save as PNG (supports transparency)

    def highlight_point_if_inside_polygon(image_path, polygon_points, test_point, project_name):
        """
        Highlights a test point in red if it lies inside a polygon defined by the given points.
        
        Args:
            image_path (str): Path to the input image.
            polygon_points (list): List of (x, y) tuples defining the polygon.
            test_point (tuple): (x, y) point to check.
            output_path (str): Path to save the output image.
        """
        # 1. Load the image
        image = Image.open(image_path).convert("RGBA")
        width, height = image.size
        
        # 2. Check if the test point is inside the polygon
        def is_point_in_polygon(point, polygon):
            """
            Ray-casting algorithm to determine if a point is inside a polygon.
            Source: https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
            """
            x, y = point
            n = len(polygon)
            inside = False
            p1x, p1y = polygon[0]
            for i in range(n + 1):
                p2x, p2y = polygon[i % n]
                if y > min(p1y, p2y):
                    if y <= max(p1y, p2y):
                        if x <= max(p1x, p2x):
                            if p1y != p2y:
                                xinters = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                            if p1x == p2x or x <= xinters:
                                inside = not inside
                p1x, p1y = p2x, p2y
            return inside
        
        is_inside = is_point_in_polygon(test_point, polygon_points)
        
        # 3. Draw a red dot if the point is inside the polygon
        draw = ImageDraw.Draw(image)
        if is_inside:
            # 3. Create a transparent overlay
            overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))  # Fully transparent
            draw = ImageDraw.Draw(overlay)
            
            x, y = test_point
            radius = 10  # Half-width/height of the rectangle
            # 4. Draw a semi-transparent red rectangle (alpha=128 for 50% opacity)
            draw.rectangle(
                [(x - radius, y - radius), (x + radius, y + radius)],
                fill=(255, 0, 0, 128),  # Red with 50% opacity
                outline=(255, 0, 0, 255)  # Non-transparent outline (optional)
            )
            
            # 5. Blend the overlay with the original image
            image = Image.alpha_composite(image, overlay)
            output_path = f"landsat_copernicus_export//frontend//public"
    # 6. Save as PNG (to preserve transparency)
            image.save(output_path)
            return output_path

if __name__ == "__main__":
    a = ImageConverter
    points = [(0,500),(570,570),(570,87),(50,50)]
    tp = (99,99)
    x = a.roi_definer(points=points)
    a.highlight_point_if_inside_polygon(x,points,tp)