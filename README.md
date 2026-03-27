# Jharkhand Tourism Platform

A comprehensive, AI-enhanced, and VR-integrated web platform designed to promote tourism in Jharkhand, India. The platform serves as a one-stop solution for tourists to explore heritage sites, book personalized tours with local guides, buy local handicrafts, and plan their trips using intelligent AI tools.

## ✨ Key Features

### 🌍 Immersive Exploration
* **VR Heritage Viewer**: Experience stunning 360-degree panoramas of Jharkhand's iconic locations (Baidyanath Temple, Dassam Falls, Betla National Park, etc.) before visiting.
* **Cultural Highlights**: Detailed guides on local art, tribes, festivals (Sarhul, Karma), and cuisine.

### 🤖 AI-Powered Assistance
* **Smart Itinerary Generator**: Receive customized daily travel plans based on your interests (nature, history, spiritual), duration, and group size.
* **Multilingual Chatbot (Rasa/Python/Gemini)**: 24/7 AI travel assistant capable of answering queries in multiple languages (English, Hindi, Bengali, Santali).

### 👥 Guide & Hotel Booking System
* **Verified Local Guides**: Tourists can browse profiles, check availability, read reviews, and book local experts by the hour or for complete packages.
* **Integrated Hotel Stays**: Guides can list partner hotels. Tourists can seamlessly add hotel accommodations (with check-in/out dates) during their tour booking.
* **Role-Based Dashboards**: 
  * *Tourist Dashboard*: Manage bookings, reschedule, cancel, leave feedback, and view hotel details.
  * *Guide Dashboard*: Manage tour packages, hotel listings, accept/reject booking requests, and view upcoming tours.

### 🛍️ Digital Marketplace
* **Local Handicrafts**: E-commerce section to buy authentic Jharkhand crafts (Dokra art, Paitkar paintings, bamboo crafts, silk).
* **Order Management**: Users can track their purchases, while admins can manage marketplace inventory and fulfill orders.

### 🛠️ Admin Control Panel
* **Comprehensive Oversight**: Admins can approve new guides, manage users, supervise all marketplace orders, global hotel listings, and track platform revenue.
* **Analytics**: Real-time charts showing user growth, sentiment analysis of reviews, and booking trends.

---

## 💻 Tech Stack

**Frontend**
* React 18 (Vite)
* Tailwind CSS (Styling)
* React Router DOM (Navigation)
* Recharts (Data Visualization)
* Pannellum (360° VR Viewer)

**Backend**
* Node.js & Express.js
* MongoDB & Mongoose (Database)
* JSON Web Tokens (JWT Authentication)
* Bcrypt.js (Password Hashing)

**AI & Python Services**
* Python 3.9+ 
* Flask (API integration for AI features)
* Google Generative AI (Gemini for Itineraries & Chat)
* Rasa / NLTK (NLP Processing)

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v16+)
* MongoDB (Local instance or Atlas URI)
* Python (v3.9+)

### Installation

1. **Clone the repository**
   ```bash

   cd jharkhand-tourism-platform
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   
   # Create a .env file based on the provided .env.example
   # Define PORT, MONGO_URI, JWT_SECRET
   
   npm start # or npm run dev for nodemon
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   
   # Set up API_BASE URL in src/config.js to point to your backend/AI services
   
   npm run dev
   ```

4. **AI/Python Setup (Optional for core functionality)**
   ```bash
   cd ../ai
   pip install -r requirements.txt
   
   # Add your GEMINI_API_KEY to environment variables
   
   python app.py
   ```

---

## 🔒 Roles & Access
* **Tourist**: Browse sites/VR, buy items, generate itineraries, chat with AI, book guides, book hotels, leave reviews.
* **Guide**: (Requires admin approval) Create tour packages, list partner hotels, manage incoming bookings, edit profile.
* **Admin**: Manage all users, approve guides, add/edit heritage sites, manage transport hubs, view analytics, process marketplace orders, manage global hotels.

---

## 📜 License
This project is part of a Capstone curriculum. All rights reserved.
