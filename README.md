# MIMIC IV ED Demo Dashboard

A full-stack dashboard for exploring the MIMIC IV Emergency Department Demo dataset. Built with FastAPI (Python) backend and React (TypeScript) frontend.

## Features

- **Encounter List** - Browse 222 ED encounters with filtering and pagination
- **Advanced Filtering** - Filter by gender, race, disposition, date range, and chief complaint
- **Sortable Columns** - Sort by arrival time, stay ID, or disposition
- **Encounter Details** - View complete patient information including:
  - Demographics and stay duration
  - Triage assessment with initial vitals
  - Interactive vital signs timeline chart
  - Diagnoses (ICD codes)
  - Medications (medrecon + pyxis)

## Tech Stack

- **Backend**: Python, FastAPI, SQLAlchemy, SQLite
- **Frontend**: React, TypeScript, Tailwind CSS, Recharts
- **Data**: MIMIC IV ED Demo dataset (222 encounters)

## Project Structure

```
mimic-iv-ed-dashboard/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── database.py          # SQLite connection
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic schemas
│   │   └── routers/
│   │       ├── encounters.py    # Encounter endpoints
│   │       └── filters.py       # Filter options endpoint
│   ├── load_data.py             # CSV to SQLite loader
│   ├── requirements.txt
│   └── mimic_ed.db              # SQLite database
│
└── frontend/
    └── src/
        ├── api/client.ts        # API calls
        ├── components/          # React components
        ├── pages/               # List & Detail pages
        └── types/               # TypeScript interfaces
```

## Prerequisites

- Docker & Docker Compose (recommended)
- OR: Python 3.9+ and Node.js 18+
- MIMIC IV ED Demo dataset

## Quick Start with Docker

The easiest way to run the dashboard is with Docker:

```bash
# Clone the repository
git clone https://github.com/kasra321/MIMIC_IV_ED_DEMO_DASHBOARD.git
cd MIMIC_IV_ED_DEMO_DASHBOARD

# Create data directory and copy your MIMIC IV ED files
mkdir -p data
cp /path/to/mimic-iv-ed-demo-2.2/ed/*.csv.gz data/

# Build and run with Docker Compose
docker-compose up --build
```

The dashboard will be available at **http://localhost:3000**

### Docker Configuration

The docker-compose setup includes:
- **Frontend**: Nginx serving the React app on port 3000
- **Backend**: FastAPI server (internal, proxied through nginx)
- **Database**: SQLite (persisted in a Docker volume)

To stop the containers:
```bash
docker-compose down
```

To reset the database:
```bash
docker-compose down -v  # Removes volumes
docker-compose up --build
```

## Manual Setup (Development)

### 1. Clone the repository

```bash
git clone https://github.com/kasra321/MIMIC_IV_ED_DEMO_DASHBOARD.git
cd MIMIC_IV_ED_DEMO_DASHBOARD
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Load data into SQLite (update DATA_PATH in load_data.py if needed)
python load_data.py

# Start the backend server
uvicorn app.main:app --reload --port 8000
```

The API will be available at http://localhost:8000 with docs at http://localhost:8000/docs

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The dashboard will be available at http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/encounters` | List encounters with filters & pagination |
| GET | `/api/encounters/{stay_id}` | Get single encounter details |
| GET | `/api/filters/options` | Get filter dropdown options |
| GET | `/health` | Health check |

### Query Parameters for `/api/encounters`

- `gender` - Filter by gender (M/F)
- `race` - Filter by race (multiple allowed)
- `disposition` - Filter by disposition (multiple allowed)
- `date_from` - Filter by start date
- `date_to` - Filter by end date
- `chief_complaint` - Search chief complaint text
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 20)
- `sort_by` - Sort column (intime, outtime, stay_id, disposition)
- `sort_order` - Sort direction (asc, desc)

## Screenshots

### Encounter List
- Filterable table with color-coded acuity and disposition badges
- Pagination and sorting controls

### Encounter Detail
- Patient demographics header
- Triage vitals cards
- Interactive vital signs chart with toggleable series
- Diagnoses and medications tables

## Data Source

This dashboard uses the [MIMIC IV ED Demo dataset](https://physionet.org/content/mimic-iv-ed/), which contains de-identified emergency department data including:

- **edstays**: 222 ED encounters
- **triage**: Initial triage assessments
- **vitalsign**: 1,038 vital sign measurements
- **diagnosis**: 545 diagnoses (ICD codes)
- **medrecon**: 2,764 medication reconciliation records
- **pyxis**: 1,082 medication dispensing records

## License

This project is for demonstration purposes using the MIMIC IV ED Demo dataset.
