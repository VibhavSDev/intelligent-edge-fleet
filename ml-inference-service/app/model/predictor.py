import pygeohash as pgh
import numpy as np
from datetime import datetime

class ETAPredictor:
    def __init__(self):
        pass

    def estimate_duration(self, pickup_lat: float, pickup_lng: float, dropoff_lat: float, dropoff_lng: float, weather: str) -> int:
        """
        Accepts raw telemetry routing params, extracts spatial/temporal features, 
        and calculates a high-precision ETA prediction.
        """

        # Geohashing simplifies spatial coordinate combinations into clear categorical groups
        pickup_geohash = pgh.encode(pickup_lat, pickup_lng, precision=6)
        dropoff_geohash = pgh.encode(dropoff_lat, dropoff_lng, precision=6)

        now = datetime.now()
        hour_of_day = now.hour
        day_of_week = now.weekday() # 0 = Monday, 6 = Sunday

        # Compute Baseline Haversine Approximation (Distance)
        lat1, lng1, lat2, lng2 = map(np.radians, [pickup_lat, pickup_lng, dropoff_lat, dropoff_lng])
        dlat = lat2 - lat1
        dlng = lng2 - lng1
        a = np.sin(dlat/2.0)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlng/2)**2
        distance_km = 6371 * (2 * np.arcsin(np.sqrt(a)))

        # Base traveling calculation: roughly 45 km/h base speed converted to seconds
        base_time_seconds = (distance_km / 45.0) * 3600

        # Apply environmental weight coefficients
        weather_multiplier = 1.35 if weather.upper() in ["RAIN", "STORMY", "SNOW"] else 1.0

        # Rush-hour congestion multipliers (e.g., 8-10 AM or 5-7 PM)
        is_rush_hour = (8 <= hour_of_day <= 10) or (17 <= hour_of_day <= 19)
        traffic_multiplier = 1.50 if (is_rush_hour and day_of_week < 5) else 1.0

        predicted_eta = int(base_time_seconds * weather_multiplier * traffic_multiplier)

        return max(predicted_eta, 60)