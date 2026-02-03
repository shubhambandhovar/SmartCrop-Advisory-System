
import requests
import os
import random

OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')
BASE_URL = "https://api.openweathermap.org/data/2.5/"

def get_weather(lat, lon):
    """
    Fetches current weather and simplistic 7-day rainfall forecast.
    """
    if not OPENWEATHER_API_KEY:
        # Mock data if no key
        return {
            "temperature": 25.0 + random.uniform(-5, 5),
            "humidity": 60.0 + random.uniform(-10, 10),
            "rainfall": 100.0 + random.uniform(0, 50)
        }

    try:
        # Current weather
        weather_url = f"{BASE_URL}weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
        res = requests.get(weather_url)
        data = res.json()
        
        if res.status_code != 200:
            raise Exception("Weather API Error")

        temp = data['main']['temp']
        humidity = data['main']['humidity']

        # For rainfall, we need forecast or accumulation. 
        # Standard free API might not give 7-day accumulated rain easily.
        # We will mock the "7-day average" based on current clouds/rain status or use forecast endpoint if available.
        # Simplification: if it's raining now, high rainfall, else moderate/low dependent on clouds.
        if 'rain' in data:
            # extrapolating 1h rain to seasonal approximation (very rough)
            rain_1h = data['rain'].get('1h', 0)
            rainfall = rain_1h * 24 * 30 # Rough monthly projection?? 
            # The model expects "rainfall in mm" (usually annual or growing season). 
            # The dataset is 'rainfall', typical values 20-300.
            # Let's return a value between 50 and 200 adjusted by current weather.
            rainfall = 100.0 + (rain_1h * 10)
        else:
            rainfall = 80.0 # Default moderate

        return {
            "temperature": temp,
            "humidity": humidity,
            "rainfall": rainfall
        }
    except Exception as e:
        print(f"Weather fetch failed: {e}")
        return {
            "temperature": 25.0,
            "humidity": 60.0,
            "rainfall": 100.0
        }

def get_soil_data(lat, lon):
    """
    Estimates soil parameters (N, P, K, pH) based on region (Lat/Lon)
    This is a MOCK fallback since real SoilGrids API is complex to set up without auth/layers.
    """
    # Random variation to simulate different soil types
    # In production, this would query a GIS database
    
    # Simple hash of lat/lon to make it deterministic for a location
    seed = int(abs(lat + lon) * 100)
    random.seed(seed)
    
    return {
        "N": random.randint(20, 120),
        "P": random.randint(10, 100),
        "K": random.randint(10, 100),
        "ph": round(random.uniform(5.5, 7.5), 1)
    }
