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
    role = data.get('role', 'tourist')
    
    # --- Role-Based Logic ---
    if role == 'guide':
        if "schedule" in message or "tour" in message:
            response = "You can view your upcoming bookings in your Guide Dashboard under 'My Tours'. Do you need help with a specific date?"
        elif "booking" in message or "more" in message:
            response = "To get more bookings, try adding more competitive packages or improving your bio. I can help you write a better bio if you like!"
        elif "profile" in message:
            response = "You can update your languages, rates, and experience in the 'Edit Profile' section of your dashboard."
        else:
            response = "Hello Guide! I'm here to help you manage your profile and tours. How can I assist you today?"
            
    elif role == 'admin':
        if "stats" in message or "statistics" in message:
            response = "Platform stats show a 15% increase in tourist registrations this month. Check the Admin Dashboard for detailed charts."
        elif "approval" in message or "pending" in message:
            response = "There are currently 3 pending guide applications. You can review them in the 'Guide Management' tab."
        elif "log" in message:
            response = "System logs are clean. No critical errors reported in the last 24 hours."
        else:
            response = "Welcome Admin. I can help you with system overviews, user management, and platform health. What do you need?"
            
    else: # Default/Tourist
        if "hello" in message:
            response = "Namaste! Welcome to Jharkhand. I can help you find guides, plan itineraries, or explore attractions."
        elif "plan" in message or "trip" in message:
            response = "I can help with that! Tell me what you like: Nature, Heritage, or Spiritual?"
        elif "nature" in message:
            response = "Jharkhand is full of waterfalls and forests! You should visit Hundru Falls and Betla National Park."
        elif "heritage" in message:
            response = "To explore our history, visit the Sun Temple and Jagannath Temple."
        elif "guide" in message:
            response = "You can browse available experts in the 'Guides' section to find a local who knows the area best."
        else:
            response = "I'm your Jharkhand Travel Assistant. Ask me about planning a trip, finding guides, or top attractions!"
        
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
