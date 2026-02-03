
from flask import Blueprint, request, jsonify
import requests

search_bp = Blueprint('search', __name__)

@search_bp.route('/search/<query>', methods=['GET'])
def search_location(query):
    try:
        # Nominatim API
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            'q': query,
            'format': 'json',
            'limit': 5,
            'addressdetails': 1
        }
        headers = {
            'User-Agent': 'SmartCropAdvisorySystem/1.0'
        }
        
        res = requests.get(url, params=params, headers=headers)
        data = res.json()
        
        results = []
        for item in data:
            results.append({
                "name": item.get('display_name'),
                "latitude": float(item.get('lat')),
                "longitude": float(item.get('lon'))
            })
            
        return jsonify(results)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
