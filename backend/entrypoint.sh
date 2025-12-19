#!/bin/bash
set -e

# Check if database exists
DB_PATH="${DATABASE_PATH:-/app/db/mimic_ed.db}"
DATA_DIR="${DATA_PATH:-/app/data}"

# Create db directory if it doesn't exist
mkdir -p "$(dirname "$DB_PATH")"

# Initialize database if it doesn't exist and data files are present
if [ ! -f "$DB_PATH" ]; then
    if [ -d "$DATA_DIR" ] && [ -f "$DATA_DIR/edstays.csv.gz" ]; then
        echo "Database not found. Initializing from data files..."
        python load_data.py
        echo "Database initialized successfully!"
    else
        echo "Warning: No data files found in $DATA_DIR"
        echo "Please mount the MIMIC IV ED data files to /app/data"
        echo "Starting server anyway (API will return empty results)..."
        # Create empty database with tables
        python -c "from app.database import engine, Base; Base.metadata.create_all(bind=engine)"
    fi
else
    echo "Database found at $DB_PATH"
fi

# Start the server
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
