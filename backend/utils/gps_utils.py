import exifread


def convert_to_decimal(coords, ref):
    degrees = float(coords[0].num) / float(coords[0].den)
    minutes = float(coords[1].num) / float(coords[1].den)
    seconds = float(coords[2].num) / float(coords[2].den)

    decimal = degrees + (minutes / 60.0) + (seconds / 3600.0)

    if ref in ['S', 'W']:
        decimal = -decimal

    return decimal


def extract_gps(image_path):
    try:
        with open(image_path, 'rb') as image_file:
            tags = exifread.process_file(image_file)

        lat = tags.get("GPS GPSLatitude")
        lat_ref = tags.get("GPS GPSLatitudeRef")

        lon = tags.get("GPS GPSLongitude")
        lon_ref = tags.get("GPS GPSLongitudeRef")

        if lat and lat_ref and lon and lon_ref:

            latitude = convert_to_decimal(lat.values, lat_ref.values)
            longitude = convert_to_decimal(lon.values, lon_ref.values)

            return {
                "latitude": round(latitude, 6),
                "longitude": round(longitude, 6)
            }

        return None

    except Exception as e:
        print("GPS Extraction Error:", e)
        return None