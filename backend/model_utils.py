import os
import uuid
import cv2
import torch
import numpy as np
import torch.nn.functional as F
from PIL import Image
from torchvision import transforms

from classification_model import build_classification_model
from segmentation_model import UNet


DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CLASSIFICATION_MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "floodrescue_classification_model.pth"
)

SEGMENTATION_MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "floodrescue_segmentation_unet.pth"
)

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "outputs")
os.makedirs(OUTPUT_DIR, exist_ok=True)


classification_model = build_classification_model()

classification_checkpoint = torch.load(
    CLASSIFICATION_MODEL_PATH,
    map_location=DEVICE
)

classification_model.load_state_dict(
    classification_checkpoint["model_state_dict"]
)

class_names = classification_checkpoint["classes"]

classification_model = classification_model.to(DEVICE)
classification_model.eval()


segmentation_model = UNet().to(DEVICE)

segmentation_checkpoint = torch.load(
    SEGMENTATION_MODEL_PATH,
    map_location=DEVICE
)

segmentation_model.load_state_dict(
    segmentation_checkpoint["model_state_dict"]
)

segmentation_model.eval()


classification_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


def predict_classification(image_path):
    image = Image.open(image_path).convert("RGB")

    tensor = classification_transform(image)
    tensor = tensor.unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        outputs = classification_model(tensor)
        probabilities = F.softmax(outputs, dim=1)
        confidence, predicted_class = torch.max(probabilities, 1)

    label = class_names[predicted_class.item()]
    confidence_score = confidence.item() * 100

    return label, confidence_score


def predict_segmentation(image_path):
    image_bgr = cv2.imread(image_path)

    if image_bgr is None:
        raise ValueError("Image could not be read")

    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)

    original_h, original_w = image_rgb.shape[:2]

    resized = cv2.resize(image_rgb, (256, 256))
    normalized = resized / 255.0

    tensor = np.transpose(normalized, (2, 0, 1)).astype(np.float32)
    tensor = torch.tensor(tensor).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        output = segmentation_model(tensor)
        output = torch.sigmoid(output)

    mask = output.squeeze().cpu().numpy()
    mask = (mask > 0.5).astype(np.uint8)

    mask_resized = cv2.resize(mask, (original_w, original_h))

    flood_pixels = np.sum(mask_resized > 0)
    total_pixels = original_h * original_w

    flood_percentage = (flood_pixels / total_pixels) * 100

    if flood_percentage < 15:
        severity = "Mild Flood"
    elif flood_percentage < 35:
        severity = "Moderate Flood"
    else:
        severity = "Severe Flood"

    overlay = image_rgb.copy()
    overlay[mask_resized > 0] = [255, 0, 0]

    blended = cv2.addWeighted(image_rgb, 0.7, overlay, 0.3, 0)

    output_filename = f"overlay_{uuid.uuid4().hex}.png"
    output_path = os.path.join(OUTPUT_DIR, output_filename)

    blended_bgr = cv2.cvtColor(blended, cv2.COLOR_RGB2BGR)
    cv2.imwrite(output_path, blended_bgr)

    return severity, float(round(flood_percentage, 2)), output_filename


def analyze_flood_image(image_path):
    prediction, confidence = predict_classification(image_path)

    if prediction == "flood":
        severity, flood_area, overlay_filename = predict_segmentation(image_path)
    else:
        severity = "No Flood Risk"
        flood_area = 0.0
        overlay_filename = None

    return {
        "prediction": prediction,
        "confidence": float(round(confidence, 2)),
        "severity": severity,
        "flood_area_percentage": flood_area,
        "overlay_image": overlay_filename
    }