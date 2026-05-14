# Fake News Detection System

A full-stack web application that uses Machine Learning to detect whether a news article is **Real**, **Fake**, or **Misleading**. Users can paste news text or URLs, get an instant prediction with a confidence score, and view their prediction history. Admins can manage users and view system-wide analytics.

## 🌟 Features

- **Instant Analysis**: Analyze news articles using advanced LLMs and Machine Learning.
- **URL & Text Support**: Provide either a direct URL or paste the raw text.
- **Authentication**: Secure JWT-based authentication with role-based access control (Guest, User, Admin).
- **Prediction History**: Keep track of all your past analyses.
- **Admin Dashboard**: System-wide statistics, user management, and global prediction history.
- **Premium UI**: Modern dark theme with smooth animations and responsive design.

## 💻 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript & Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4, shadcn/ui
- **State Management**: Zustand
- **API Client**: Axios

### Backend (Node.js)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT, bcryptjs
- **Validation**: Zod

### ML Microservice (Python)
- **Framework**: FastAPI
- **AI Orchestration**: LangChain
- **LLM Engine**: Groq (Llama 3.3 70B)
- **Web Scraping**: Playwright, BeautifulSoup4

## 📁 Project Structure

```
fake-news-detection-system/
├── backend/          # Express.js + TypeScript REST API
├── frontend/         # React + Vite + Tailwind CSS frontend
├── ml-service/       # Python FastAPI Machine Learning microservice
└── PRD.md            # Product Requirements Document
```

## 🛠️ Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.12+)
- [PostgreSQL](https://www.postgresql.org/)

## 🚀 Getting Started

The project is divided into three main components. You will need to run all three concurrently for the full system to work.

### 1. Database Setup

Ensure your PostgreSQL instance is running and create a database named `fakenews_db` (or update your `.env` connection string accordingly).

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` or with the following variables:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fakenews_db
   JWT_SECRET=your_super_secret_jwt_key
   ML_SERVICE_URL=http://localhost:8001
   PORT=8000
   ```
4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:8000`.*

### 3. ML Microservice Setup

1. Navigate to the ML service directory:
   ```bash
   cd ml-service
   ```
2. Set up a Python virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn main:app --port 8001 --reload
   ```
   *The ML service will start on `http://localhost:8001`.*

### 4. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will open at `http://localhost:5173`.*

## 📚 API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT
- `GET /api/auth/me` - Get current user profile

### Predictions
- `POST /api/predict` - Analyze a news article (text or URL)
- `GET /api/history` - Get user's prediction history
- `GET /api/history/:id` - Get details of a specific prediction

### Admin
- `GET /api/admin/stats` - Get system-wide statistics
- `GET /api/admin/users` - List all users
- `DELETE /api/admin/users/:id` - Delete a user
- `PUT /api/admin/users/:id/role` - Update a user's role
- `GET /api/admin/predictions` - Get all global predictions
