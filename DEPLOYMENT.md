# Deployment Guide: Jharkhand Tourism Platform

This guide will help you deploy the MERN stack application (MongoDB, Express, React, Node.js) along with the Python AI integration.

## 1. Deploying the Backend (Render / Railway)

We recommend using **Render** or **Railway** for the Node.js backend.

1. Create an account on [Render.com](https://render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Set the following details:
   * **Root Directory**: `server`
   * **Environment**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
5. **Environment Variables**: Add the following variables in the Render dashboard:
   * `PORT`: `5000` (or leave default, Render sets this)
   * `MONGO_URI`: Your MongoDB Atlas connection string (e.g., `mongodb+srv://<user>:<pwd>@cluster...`)
   * `JWT_SECRET`: A strong random string for user authentication
   * `OPENWEATHER_API_KEY`: Your OpenWeather API key
6. Click **Deploy**. Copy the provided backend URL (e.g., `https://jharkhand-api.onrender.com`).

## 2. Deploying the Frontend (Vercel / Netlify)

We recommend **Vercel** for the Vite React frontend.

1. Go to [Vercel.com](https://vercel.com/) and create a new project.
2. Import your GitHub repository.
3. Set the **Framework Preset** to `Vite`.
4. Set the **Root Directory** to `client`.
5. **Environment Variables**:
   * Name: `VITE_API_URL`
   * Value: `<Your Deployed Backend URL>` (e.g., `https://jharkhand-api.onrender.com`)
6. Click **Deploy**. Vercel will build and host your frontend.

### Frontend Routing Fix (Vercel)
If you face issues with React Router returning 404s on page refresh, add a `vercel.json` file inside the `client` directory with:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## 3. Deploying the AI Service (Render / Railway)

1. Create another **Web Service** on Render.
2. Connect your repo and set:
   * **Root Directory**: `ai`
   * **Environment**: `Python`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `gunicorn app:app` (or `python app.py`)
3. **Environment Variables**:
   * `GEMINI_API_KEY`: Your Google Gemini API Key.
4. Once deployed, if your Node.js backend communicates with the Python API, ensure you update the endpoint URL in your Node.js environment variables.

---
### Final Checklist
✅ MongoDB Atlas is accepting connections from anywhere (IP Whitelist: `0.0.0.0/0`).
✅ Frontend `VITE_API_URL` points to the live backend.
✅ Backend CORS is configured correctly (currently allows all).
✅ Both services are live and pinging successfully.
