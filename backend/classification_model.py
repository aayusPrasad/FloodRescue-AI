import torch.nn as nn
from torchvision import models


def build_classification_model():
    model = models.efficientnet_b0(weights=None)

    num_features = model.classifier[1].in_features

    model.classifier = nn.Sequential(
        nn.Dropout(0.3),
        nn.Linear(num_features, 2)
    )

    return model