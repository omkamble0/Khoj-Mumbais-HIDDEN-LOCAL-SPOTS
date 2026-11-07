# Check coordinates sanity for Mumbai Metro network
import json

MUMBAI_BOUNDS = (18.88, 19.35, 72.78, 73.15)

def check_coord(lat, lng, name):
    if not (MUMBAI_BOUNDS[0] <= lat <= MUMBAI_BOUNDS[1] and MUMBAI_BOUNDS[2] <= lng <= MUMBAI_BOUNDS[3]):
        print(f"OUT OF BOUNDS: {name} ({lat}, {lng})")
        return False
    return True

print("Bounds validator ready.")

