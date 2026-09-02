# ClarioMed 🏥✨

**ClarioMed** is an AI-powered Medical Report Simplifier & Lab Results Explainer. It translates dense, complex medical laboratory reports, clinical notes, and diagnostic documents into clear, patient-friendly plain language while highlighting key findings, color-coded lab status indicators, and actionable questions for doctor visits.

---

## 🌟 Key Features

- 📑 **Multi-Modal Document Processing**: Support for PDFs and image formats (PNG, JPEG, WebP). PyMuPDF (`fitz`) renders multi-page PDF documents into visual page streams.
- 🤖 **Google Gemini 2.5 Flash Integration**: Leverages Google's unified `google-genai` SDK for empathetic, accurate medical report simplification.
- 🩸 **Lab Test Breakdown**: Extracts lab test names, observed values, reference ranges, and color-coded status badges:
  - 🔴 **High**: Values above standard reference ranges.
  - 🔵 **Low**: Values below standard reference ranges.
  - 🟢 **Normal**: Values within healthy limits.
- 📋 **Doctor Visit Preparation**: Generates tailored, actionable questions patients can ask their physician during follow-up visits.
- 🔒 **HIPAA-First & Privacy Conscious**: Designed with zero client-side key exposure and strict database Row-Level Security (RLS).

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology | Deployment |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide Icons | Vercel |
| **Backend** | Python 3.11+, FastAPI, Pydantic v2, PyMuPDF (`fitz`) | Render |
| **AI Model** | Google Gemini API (`google-genai` SDK, `gemini-2.5-flash`) | Google AI |
| **Database & Vector** | Supabase (PostgreSQL, `pgvector` 768-dim, Storage, RLS) | Supabase Cloud |

---

## 📁 Repository Structure

```
ClarioMed/
├── backend/                  # FastAPI Python Backend
│   ├── app/
│   │   ├── models/           # Pydantic v2 data models
│   │   ├── routers/          # API route definitions (/health, /reports)
│   │   ├── services/         # PyMuPDF, Gemini 2.5 Flash, Supabase integrations
│   │   ├── config.py         # App configuration & settings
│   │   └── main.py           # FastAPI entry point & CORS configuration
│   ├── requirements.txt      # Backend Python dependencies
│   └── .env.example          # Backend environment variable template
├── frontend/                 # Next.js 15 Frontend App
│   ├── src/
│   │   ├── app/              # App router pages & layouts
│   │   ├── components/       # Header, ReportUploader, ReportSummary, LabResultBadge
│   │   └── types/            # TypeScript interfaces
│   ├── .env.example          # Frontend environment variable template
│   └── package.json          # Node dependencies
├── supabase/                 # Supabase SQL Migrations & Database Schemas
│   └── schema.sql            # Table definitions, pgvector, and RLS policies
├── README.md                 # Project Documentation
└── AGENT.md                  # Project System Prompt (git-ignored)
```

---

## ⚡ Quick Start

### 1. Prerequisites

- Python 3.11+
- Node.js 18+ & npm
- Google Gemini API Key
- Supabase Project (URL & Keys)

### 2. Backend Setup

```bash
cd backend

# Create & activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from template
cp .env.example .env
```

Fill in your credentials in `backend/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
GEMINI_EMBEDDING_MODEL=text-embedding-004
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Run the backend server:
```bash
uvicorn app.main:app --reload --port 8000
```
Backend API interactive documentation available at: `http://localhost:8000/docs`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file from template
cp .env.example .env.local
```

Ensure `NEXT_PUBLIC_API_URL` points to your running backend:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run the frontend dev server:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🛢️ Supabase Database Setup

1. Open your Supabase SQL Editor.
2. Execute the migration script located at [`supabase/schema.sql`](./supabase/schema.sql).
3. This creates the `reports`, `lab_results`, and `report_embeddings` tables with 768-dim `pgvector` support and Row-Level Security policies.

---

## ⚠️ Medical Disclaimer

*ClarioMed is an educational tool built to simplify medical information for patient comprehension. It does not provide formal medical diagnosis, treatment advice, or prescriptions. Patients should always consult a licensed medical professional regarding lab results and health conditions.*

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.
