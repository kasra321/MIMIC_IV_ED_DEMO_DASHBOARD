from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class TriageSchema(BaseModel):
    temperature: Optional[float] = None
    heartrate: Optional[float] = None
    resprate: Optional[float] = None
    o2sat: Optional[float] = None
    sbp: Optional[float] = None
    dbp: Optional[float] = None
    pain: Optional[str] = None
    acuity: Optional[int] = None
    chiefcomplaint: Optional[str] = None

    class Config:
        from_attributes = True


class VitalSignSchema(BaseModel):
    charttime: datetime
    temperature: Optional[float] = None
    heartrate: Optional[float] = None
    resprate: Optional[float] = None
    o2sat: Optional[float] = None
    sbp: Optional[float] = None
    dbp: Optional[float] = None
    rhythm: Optional[str] = None
    pain: Optional[str] = None

    class Config:
        from_attributes = True


class DiagnosisSchema(BaseModel):
    seq_num: int
    icd_code: str
    icd_version: int
    icd_title: Optional[str] = None

    class Config:
        from_attributes = True


class MedicationSchema(BaseModel):
    charttime: Optional[datetime] = None
    name: Optional[str] = None
    source: str  # 'medrecon' or 'pyxis'
    gsn: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True


class EncounterListItem(BaseModel):
    stay_id: int
    subject_id: int
    hadm_id: Optional[int] = None
    intime: datetime
    outtime: datetime
    gender: str
    race: Optional[str] = None
    arrival_transport: Optional[str] = None
    disposition: str
    chiefcomplaint: Optional[str] = None
    acuity: Optional[int] = None
    duration_hours: float

    class Config:
        from_attributes = True


class EncounterListResponse(BaseModel):
    items: List[EncounterListItem]
    total: int
    page: int
    per_page: int
    total_pages: int


class EncounterDetail(BaseModel):
    stay_id: int
    subject_id: int
    hadm_id: Optional[int] = None
    intime: datetime
    outtime: datetime
    gender: str
    race: Optional[str] = None
    arrival_transport: Optional[str] = None
    disposition: str
    duration_hours: float
    triage: Optional[TriageSchema] = None
    vitalsigns: List[VitalSignSchema] = []
    diagnoses: List[DiagnosisSchema] = []
    medications: List[MedicationSchema] = []

    class Config:
        from_attributes = True


class FilterOptions(BaseModel):
    genders: List[str]
    races: List[str]
    dispositions: List[str]
    chief_complaints: List[str]
    date_range: dict
