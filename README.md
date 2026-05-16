# FinAI Nexus

FinAI Nexus is a full-stack financial technology application. It consists of a React frontend and a Python backend.

## Project Structure
- `frontend/` - React frontend built with Vite and TailwindCSS
- `backend/` - Python backend API
- `admin/` - Backup of Admin Panel React components

## Prerequisites
Before running the project, make sure you have installed:
- [Node.js](https://nodejs.org/) (for the frontend)
- [Python 3.8+](https://www.python.org/) (for the backend)

---

## 🚀 How to Run the Project locally

You need to run both the frontend and the backend at the same time in two separate terminal windows.

### 1. Start the Backend Server
Open a terminal, navigate to the `backend` folder, install the Python dependencies, and run `app.py`:

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 2. Start the Frontend App
Open a **new** terminal window, navigate to the `frontend` folder, install the Node packages, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

Once the frontend starts, it will give you a local URL (e.g., `http://localhost:5173/`). Open that URL in your browser to view the application!
