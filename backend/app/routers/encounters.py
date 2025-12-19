from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from typing import Optional, List
from datetime import datetime

from app.database import get_db
from app.models import EdStay, Triage, VitalSign, Diagnosis, MedRecon, Pyxis
from app.schemas import (
    EncounterListItem,
    EncounterListResponse,
    EncounterDetail,
    TriageSchema,
    VitalSignSchema,
    DiagnosisSchema,
    MedicationSchema,
)

router = APIRouter()


@router.get("", response_model=EncounterListResponse)
def get_encounters(
    gender: Optional[str] = None,
    race: Optional[List[str]] = Query(None),
    disposition: Optional[List[str]] = Query(None),
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    chief_complaint: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    sort_by: str = Query("intime", regex="^(intime|outtime|stay_id|disposition)$"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    db: Session = Depends(get_db),
):
    """Get list of encounters with filtering and pagination."""
    # Base query with triage join
    query = db.query(EdStay, Triage).outerjoin(Triage, EdStay.stay_id == Triage.stay_id)

    # Apply filters
    conditions = []
    if gender:
        conditions.append(EdStay.gender == gender)
    if race:
        conditions.append(EdStay.race.in_(race))
    if disposition:
        conditions.append(EdStay.disposition.in_(disposition))
    if date_from:
        try:
            dt_from = datetime.fromisoformat(date_from)
            conditions.append(EdStay.intime >= dt_from)
        except ValueError:
            pass
    if date_to:
        try:
            dt_to = datetime.fromisoformat(date_to)
            conditions.append(EdStay.intime <= dt_to)
        except ValueError:
            pass
    if chief_complaint:
        conditions.append(Triage.chiefcomplaint.ilike(f"%{chief_complaint}%"))

    if conditions:
        query = query.filter(and_(*conditions))

    # Get total count
    total = query.count()

    # Apply sorting
    sort_column = getattr(EdStay, sort_by, EdStay.intime)
    if sort_order == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())

    # Apply pagination
    offset = (page - 1) * per_page
    results = query.offset(offset).limit(per_page).all()

    # Build response items
    items = []
    for edstay, triage in results:
        duration_hours = (edstay.outtime - edstay.intime).total_seconds() / 3600
        items.append(
            EncounterListItem(
                stay_id=edstay.stay_id,
                subject_id=edstay.subject_id,
                hadm_id=edstay.hadm_id,
                intime=edstay.intime,
                outtime=edstay.outtime,
                gender=edstay.gender,
                race=edstay.race,
                arrival_transport=edstay.arrival_transport,
                disposition=edstay.disposition,
                chiefcomplaint=triage.chiefcomplaint if triage else None,
                acuity=triage.acuity if triage else None,
                duration_hours=round(duration_hours, 2),
            )
        )

    total_pages = (total + per_page - 1) // per_page

    return EncounterListResponse(
        items=items,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages,
    )


@router.get("/{stay_id}", response_model=EncounterDetail)
def get_encounter_detail(stay_id: int, db: Session = Depends(get_db)):
    """Get detailed information for a single encounter."""
    # Get edstay
    edstay = db.query(EdStay).filter(EdStay.stay_id == stay_id).first()
    if not edstay:
        raise HTTPException(status_code=404, detail="Encounter not found")

    # Get triage
    triage = db.query(Triage).filter(Triage.stay_id == stay_id).first()
    triage_schema = None
    if triage:
        triage_schema = TriageSchema(
            temperature=triage.temperature,
            heartrate=triage.heartrate,
            resprate=triage.resprate,
            o2sat=triage.o2sat,
            sbp=triage.sbp,
            dbp=triage.dbp,
            pain=triage.pain,
            acuity=triage.acuity,
            chiefcomplaint=triage.chiefcomplaint,
        )

    # Get vital signs (sorted by time)
    vitalsigns = (
        db.query(VitalSign)
        .filter(VitalSign.stay_id == stay_id)
        .order_by(VitalSign.charttime)
        .all()
    )
    vitalsigns_schema = [
        VitalSignSchema(
            charttime=v.charttime,
            temperature=v.temperature,
            heartrate=v.heartrate,
            resprate=v.resprate,
            o2sat=v.o2sat,
            sbp=v.sbp,
            dbp=v.dbp,
            rhythm=v.rhythm,
            pain=v.pain,
        )
        for v in vitalsigns
    ]

    # Get diagnoses (sorted by sequence)
    diagnoses = (
        db.query(Diagnosis)
        .filter(Diagnosis.stay_id == stay_id)
        .order_by(Diagnosis.seq_num)
        .all()
    )
    diagnoses_schema = [
        DiagnosisSchema(
            seq_num=d.seq_num,
            icd_code=d.icd_code,
            icd_version=d.icd_version,
            icd_title=d.icd_title,
        )
        for d in diagnoses
    ]

    # Get medications (combined from medrecon and pyxis)
    medications = []

    # Add medrecon entries
    medrecon_entries = db.query(MedRecon).filter(MedRecon.stay_id == stay_id).all()
    for m in medrecon_entries:
        medications.append(
            MedicationSchema(
                charttime=m.charttime,
                name=m.name,
                source="medrecon",
                gsn=m.gsn,
                description=m.etcdescription,
            )
        )

    # Add pyxis entries
    pyxis_entries = db.query(Pyxis).filter(Pyxis.stay_id == stay_id).all()
    for p in pyxis_entries:
        medications.append(
            MedicationSchema(
                charttime=p.charttime,
                name=p.name,
                source="pyxis",
                gsn=p.gsn,
                description=None,
            )
        )

    # Sort medications by charttime
    medications.sort(key=lambda x: x.charttime or datetime.min)

    duration_hours = (edstay.outtime - edstay.intime).total_seconds() / 3600

    return EncounterDetail(
        stay_id=edstay.stay_id,
        subject_id=edstay.subject_id,
        hadm_id=edstay.hadm_id,
        intime=edstay.intime,
        outtime=edstay.outtime,
        gender=edstay.gender,
        race=edstay.race,
        arrival_transport=edstay.arrival_transport,
        disposition=edstay.disposition,
        duration_hours=round(duration_hours, 2),
        triage=triage_schema,
        vitalsigns=vitalsigns_schema,
        diagnoses=diagnoses_schema,
        medications=medications,
    )
