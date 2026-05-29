# FloodRescue AI

FloodRescue AI is an end-to-end flood intelligence platform that uses computer vision to analyze uploaded images and estimate flood risk severity. The project combines:

- **Image classification** (flood vs. non-flood)
- **Flood segmentation** (pixel-level inundation mapping)
- **Severity estimation** (mild, moderate, severe based on affected area)
- **GPS metadata extraction** (when available in image EXIF)
- **Modern React dashboard** for visualization and reporting

---

## Why FloodRescue AI

During floods, response speed matters. FloodRescue AI is designed to support rapid situational awareness by turning raw field images into actionable information:

- Is this image showing a flood?
- How much area appears inundated?
- How severe might the event be?
- Where was the image captured (if GPS metadata exists)?

This helps emergency teams and analysts prioritize response and monitor impact more efficiently.

---

## Core Features

- **FastAPI backend** with file upload + inference pipeline
- **Deep learning models**:
  - EfficientNet-B0 for classification
  - U-Net for segmentation
- **Flood area estimation** as a percentage of image pixels
- **Severity bands**:
  - Mild Flood (`< 15%`)
  - Moderate Flood (`15% - <35%`)
  - Severe Flood (`>= 35%`)
- **Overlay generation** highlighting detected flooded regions
- **Frontend dashboard** built with React + Vite + Tailwind + Recharts

---

## Tech Stack

### Backend
- Python
- FastAPI + Uvicorn
- PyTorch + Torchvision
- OpenCV
- Pillow
- NumPy

### Frontend
- React (Vite)
- React Router
- Axios
- Tailwind CSS
- Recharts

---

## Project Structure

```text
FloodRescue-AI/
├── backend/
│   ├── app.py
│   ├── model_utils.py
│   ├── classification_model.py
│   ├── segmentation_model.py
│   ├── utils/
│   │   └── gps_utils.py
│   ├── uploads/
│   └── outputs/
├── frontend/
│   ├── src/
│   └── package.json
├── models/
│   ├── floodrescue_classification_model.pth
│   └── floodrescue_segmentation_unet.pth
└── README.md
```

> Note: Ensure the `models/` directory contains the trained `.pth` files expected by `backend/model_utils.py`.

---

## API Overview

### `GET /`
Health message confirming backend is running.

### `POST /predict`
Upload an image and receive flood analysis.

#### Request
- `multipart/form-data`
- Field: `file`

#### Example Response

```json
{
  "prediction": "flood",
  "confidence": 97.43,
  "severity": "Moderate Flood",
  "flood_area_percentage": 22.18,
  "overlay_image": "overlay_abc123.png",
  "overlay_url": "/outputs/overlay_abc123.png",
  "gps": {
    "latitude": 12.9716,
    "longitude": 77.5946
  }
}
```

---

## Local Setup

## 1) Clone the repository

```bash
git clone https://github.com/aayusPrasad
cd FloodRescue-AI
```

## 2) Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### Run backend

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`

## 3) Frontend setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: `https://aayup78bm-floodrescueai-1.hf.space`

---

## How Inference Works

1. User uploads an image.
2. Classification model predicts **flood** or **non-flood**.
3. If flood is detected:
   - U-Net generates a flood mask.
   - Flood pixel ratio is computed.
   - Severity level is assigned.
   - Overlay image is saved in `backend/outputs/`.
4. GPS coordinates are extracted from EXIF metadata when present.
5. API returns structured JSON for frontend visualization.

---

## Model Notes

- **Classification Model:** EfficientNet-B0 with custom classifier head (2 classes).
- **Segmentation Model:** U-Net binary segmentation architecture.
- **Device selection:** Automatically uses CUDA if available, otherwise CPU.


## Current Limitations

- Accuracy depends on training data diversity and quality.
- GPS extraction works only when EXIF geotags exist.
- Segmentation thresholds and severity bands are heuristic and may require region-specific calibration.
- Very low-light, obstructed, or low-resolution images can reduce reliability.

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request with a clear description

---

## License

This project is licensed under the terms of the MIT LICENSE file in this repository.

---
