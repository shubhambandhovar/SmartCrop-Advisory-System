
from flask import Flask
from flask_cors import CORS
from routes.prediction_routes import prediction_bp
from routes.search_routes import search_bp
from routes.dev_routes import dev_bp
import os
from dotenv import load_dotenv

# Load env
load_dotenv()

app = Flask(__name__)
CORS(app) # Enable CORS for frontend

# Register Blueprints
app.register_blueprint(prediction_bp, url_prefix='/api')
app.register_blueprint(search_bp, url_prefix='/api')
app.register_blueprint(dev_bp, url_prefix='/api/dev')

@app.route('/')
def home():
    return {"message": "Smart Crop Advisory System API is running"}

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
