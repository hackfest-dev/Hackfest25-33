from google import genai
from config import API_KEY, PROMPT , GEMINI_MODEL
from image_utils import ImageConverter

@staticmethod
def algorithm(project_name):
    client = genai.Client(api_key=API_KEY)
    img_path = f"landsat_copernicus_export\\downloaded_images\\copernicus_images\\{project_name}_Copernicus_Image.png"
    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=[PROMPT,img_path]       
    )

    # smth = dict(response.text)
    # print(smth)
    print(response.text)
    t_text = eval(response.text)
    print(t_text)
    return t_text


# if __name__ == "__main__":
#     t_n = algorithm()
#     a = ImageConverter
#     points = [(0,500),(570,570),(570,87),(50,50)]
#     x = a.roi_definer(points)
#     a.highlight_point_if_inside_polygon(x,points,t_n)