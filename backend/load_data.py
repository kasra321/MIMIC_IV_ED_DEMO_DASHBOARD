#!/usr/bin/env python3
"""
Load MIMIC IV ED Demo data from CSV.gz files into SQLite database.
"""
import gzip
import csv
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional

# Add app directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, Base
from app.models import EdStay, Triage, VitalSign, Diagnosis, MedRecon, Pyxis
from sqlalchemy.orm import Session

# Path to MIMIC IV ED data files
DATA_PATH = Path("/Users/kasra/Documents/Mimic Demo/mimic-iv-ed-demo-2.2/ed")


def parse_datetime(value: str) -> Optional[datetime]:
    """Parse datetime string to datetime object."""
    if not value or value.strip() == "":
        return None
    try:
        return datetime.fromisoformat(value.replace(" ", "T"))
    except ValueError:
        return None


def parse_float(value: str) -> Optional[float]:
    """Parse string to float, returning None for empty values."""
    if not value or value.strip() == "":
        return None
    try:
        return float(value)
    except ValueError:
        return None


def parse_int(value: str) -> Optional[int]:
    """Parse string to int, returning None for empty values."""
    if not value or value.strip() == "":
        return None
    try:
        return int(float(value))
    except ValueError:
        return None


def load_csv_gz(filename: str):
    """Generator to read gzipped CSV files."""
    filepath = DATA_PATH / filename
    print(f"Loading {filepath}...")
    with gzip.open(filepath, "rt", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            yield row


def load_edstays(session: Session):
    """Load edstays table."""
    count = 0
    for row in load_csv_gz("edstays.csv.gz"):
        edstay = EdStay(
            stay_id=int(row["stay_id"]),
            subject_id=int(row["subject_id"]),
            hadm_id=parse_int(row.get("hadm_id", "")),
            intime=parse_datetime(row["intime"]),
            outtime=parse_datetime(row["outtime"]),
            gender=row["gender"],
            race=row.get("race", None) or None,
            arrival_transport=row.get("arrival_transport", None) or None,
            disposition=row["disposition"],
        )
        session.add(edstay)
        count += 1
    session.commit()
    print(f"  Loaded {count} edstays records")


def load_triage(session: Session):
    """Load triage table."""
    count = 0
    for row in load_csv_gz("triage.csv.gz"):
        triage = Triage(
            subject_id=int(row["subject_id"]),
            stay_id=int(row["stay_id"]),
            temperature=parse_float(row.get("temperature", "")),
            heartrate=parse_float(row.get("heartrate", "")),
            resprate=parse_float(row.get("resprate", "")),
            o2sat=parse_float(row.get("o2sat", "")),
            sbp=parse_float(row.get("sbp", "")),
            dbp=parse_float(row.get("dbp", "")),
            pain=row.get("pain", None) or None,
            acuity=parse_int(row.get("acuity", "")),
            chiefcomplaint=row.get("chiefcomplaint", None) or None,
        )
        session.add(triage)
        count += 1
    session.commit()
    print(f"  Loaded {count} triage records")


def load_vitalsigns(session: Session):
    """Load vitalsigns table."""
    count = 0
    for row in load_csv_gz("vitalsign.csv.gz"):
        vital = VitalSign(
            subject_id=int(row["subject_id"]),
            stay_id=int(row["stay_id"]),
            charttime=parse_datetime(row["charttime"]),
            temperature=parse_float(row.get("temperature", "")),
            heartrate=parse_float(row.get("heartrate", "")),
            resprate=parse_float(row.get("resprate", "")),
            o2sat=parse_float(row.get("o2sat", "")),
            sbp=parse_float(row.get("sbp", "")),
            dbp=parse_float(row.get("dbp", "")),
            rhythm=row.get("rhythm", None) or None,
            pain=row.get("pain", None) or None,
        )
        session.add(vital)
        count += 1
    session.commit()
    print(f"  Loaded {count} vitalsign records")


def load_diagnoses(session: Session):
    """Load diagnoses table."""
    count = 0
    for row in load_csv_gz("diagnosis.csv.gz"):
        diagnosis = Diagnosis(
            subject_id=int(row["subject_id"]),
            stay_id=int(row["stay_id"]),
            seq_num=int(row["seq_num"]),
            icd_code=row["icd_code"],
            icd_version=int(row["icd_version"]),
            icd_title=row.get("icd_title", None) or None,
        )
        session.add(diagnosis)
        count += 1
    session.commit()
    print(f"  Loaded {count} diagnosis records")


def load_medrecon(session: Session):
    """Load medrecon table."""
    count = 0
    for row in load_csv_gz("medrecon.csv.gz"):
        med = MedRecon(
            subject_id=int(row["subject_id"]),
            stay_id=int(row["stay_id"]),
            charttime=parse_datetime(row.get("charttime", "")),
            name=row.get("name", None) or None,
            gsn=row.get("gsn", None) or None,
            ndc=row.get("ndc", None) or None,
            etc_rn=parse_int(row.get("etc_rn", "")),
            etccode=row.get("etccode", None) or None,
            etcdescription=row.get("etcdescription", None) or None,
        )
        session.add(med)
        count += 1
    session.commit()
    print(f"  Loaded {count} medrecon records")


def load_pyxis(session: Session):
    """Load pyxis table."""
    count = 0
    for row in load_csv_gz("pyxis.csv.gz"):
        med = Pyxis(
            subject_id=int(row["subject_id"]),
            stay_id=int(row["stay_id"]),
            charttime=parse_datetime(row.get("charttime", "")),
            med_rn=parse_int(row.get("med_rn", "")),
            name=row.get("name", None) or None,
            gsn_rn=parse_int(row.get("gsn_rn", "")),
            gsn=row.get("gsn", None) or None,
        )
        session.add(med)
        count += 1
    session.commit()
    print(f"  Loaded {count} pyxis records")


def main():
    """Main function to create database and load all data."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)

    print("\nLoading data from CSV files...")
    with Session(engine) as session:
        load_edstays(session)
        load_triage(session)
        load_vitalsigns(session)
        load_diagnoses(session)
        load_medrecon(session)
        load_pyxis(session)

    print("\nDatabase loaded successfully!")


if __name__ == "__main__":
    main()
