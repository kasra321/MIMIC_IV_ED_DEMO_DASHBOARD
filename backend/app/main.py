from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import encounters, filters

app = FastAPI(
    title="MIMIC IV ED Dashboard API",
    version="1.0.0",
    description="API for exploring MIMIC IV ED Demo dataset",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(encounters.router, prefix="/api/encounters", tags=["encounters"])
app.include_router(filters.router, prefix="/api/filters", tags=["filters"])


@app.get("/")
def root():
    return {"message": "MIMIC IV ED Dashboard API", "docs": "/docs"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
