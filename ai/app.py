from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

# Mock Data for Itinerary
ATTRACTIONS = {
    "nature": ["Hundru Falls", "Dalma Wildlife Sanctuary", "Betla National Park"],
    "heritage": ["Jagannath Temple", "Sun Temple", "Pahari Mandir"],
    "spiritual": ["Baidyanath Dham", "Rajrappa Temple", "Itkhori"]
}

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '').lower()
    
    if "hello" in message:
        response = "Namaste! Welcome to Jharkhand via AI. How can I help you plan your trip?"
    elif "plan" in message or "trip" in message:
        response = "I can help with that! Tell me what you like: Nature, Heritage, or Spiritual?"
    elif "nature" in message:
        response = "Jharkhand is full of waterfalls and forests! You should visit Hundru Falls and Betla National Park."
    elif "heritage" in message:
        response = "To explore our history, visit the Sun Temple and Jagannath Temple."
    else:
        response = "I'm still learning! Ask me about planning a trip or specific places."
        
    return jsonify({"response": response})

@app.route('/itinerary', methods=['POST'])
def generate_itinerary():
    data = request.json
    preferences = data.get('preferences', [])
    
    itinerary = []
    for pref in preferences:
        if pref.lower() in ATTRACTIONS:
            itinerary.extend(ATTRACTIONS[pref.lower()])
            
    # Add random if empty or generic
    if not itinerary:
        itinerary = ["Hundru Falls", "Jagannath Temple", "Ranchi Lake"]
        
    return jsonify({"itinerary": list(set(itinerary))})

if __name__ == '__main__':
    app.run(port=5003, debug=True)
