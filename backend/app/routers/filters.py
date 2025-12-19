from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import EdStay, Triage
from app.schemas import FilterOptions

router = APIRouter()


@router.get("/options", response_model=FilterOptions)
def get_filter_options(db: Session = Depends(get_db)):
    """Get available filter options for dropdowns."""
    # Get unique genders
    genders = [
        row[0]
        for row in db.query(EdStay.gender).distinct().order_by(EdStay.gender).all()
        if row[0]
    ]

    # Get unique races
    races = [
        row[0]
        for row in db.query(EdStay.race).distinct().order_by(EdStay.race).all()
        if row[0]
    ]

    # Get unique dispositions
    dispositions = [
        row[0]
        for row in db.query(EdStay.disposition)
        .distinct()
        .order_by(EdStay.disposition)
        .all()
        if row[0]
    ]

    # Get unique chief complaints
    chief_complaints = [
        row[0]
        for row in db.query(Triage.chiefcomplaint)
        .distinct()
        .order_by(Triage.chiefcomplaint)
        .all()
        if row[0]
    ]

    # Get date range
    date_range_result = db.query(
        func.min(EdStay.intime), func.max(EdStay.intime)
    ).first()

    date_range = {
        "min": date_range_result[0].isoformat() if date_range_result[0] else None,
        "max": date_range_result[1].isoformat() if date_range_result[1] else None,
    }

    return FilterOptions(
        genders=genders,
        races=races,
        dispositions=dispositions,
        chief_complaints=chief_complaints,
        date_range=date_range,
    )
