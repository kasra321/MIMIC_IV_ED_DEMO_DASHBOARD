from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class EdStay(Base):
    __tablename__ = "edstays"

    stay_id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, nullable=False, index=True)
    hadm_id = Column(Integer, nullable=True)
    intime = Column(DateTime, nullable=False, index=True)
    outtime = Column(DateTime, nullable=False)
    gender = Column(String(1), nullable=False, index=True)
    race = Column(String(100), nullable=True, index=True)
    arrival_transport = Column(String(50), nullable=True)
    disposition = Column(String(50), nullable=False, index=True)

    # Relationships
    triage = relationship("Triage", back_populates="edstay", uselist=False)
    vitalsigns = relationship("VitalSign", back_populates="edstay")
    diagnoses = relationship("Diagnosis", back_populates="edstay")
    medrecon = relationship("MedRecon", back_populates="edstay")
    pyxis = relationship("Pyxis", back_populates="edstay")


class Triage(Base):
    __tablename__ = "triage"

    id = Column(Integer, primary_key=True, autoincrement=True)
    subject_id = Column(Integer, nullable=False)
    stay_id = Column(Integer, ForeignKey("edstays.stay_id"), nullable=False, index=True)
    temperature = Column(Float, nullable=True)
    heartrate = Column(Float, nullable=True)
    resprate = Column(Float, nullable=True)
    o2sat = Column(Float, nullable=True)
    sbp = Column(Float, nullable=True)
    dbp = Column(Float, nullable=True)
    pain = Column(String(20), nullable=True)
    acuity = Column(Integer, nullable=True)
    chiefcomplaint = Column(Text, nullable=True, index=True)

    edstay = relationship("EdStay", back_populates="triage")


class VitalSign(Base):
    __tablename__ = "vitalsigns"

    id = Column(Integer, primary_key=True, autoincrement=True)
    subject_id = Column(Integer, nullable=False)
    stay_id = Column(Integer, ForeignKey("edstays.stay_id"), nullable=False, index=True)
    charttime = Column(DateTime, nullable=False, index=True)
    temperature = Column(Float, nullable=True)
    heartrate = Column(Float, nullable=True)
    resprate = Column(Float, nullable=True)
    o2sat = Column(Float, nullable=True)
    sbp = Column(Float, nullable=True)
    dbp = Column(Float, nullable=True)
    rhythm = Column(String(50), nullable=True)
    pain = Column(String(20), nullable=True)

    edstay = relationship("EdStay", back_populates="vitalsigns")


class Diagnosis(Base):
    __tablename__ = "diagnoses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    subject_id = Column(Integer, nullable=False)
    stay_id = Column(Integer, ForeignKey("edstays.stay_id"), nullable=False, index=True)
    seq_num = Column(Integer, nullable=False)
    icd_code = Column(String(20), nullable=False)
    icd_version = Column(Integer, nullable=False)
    icd_title = Column(Text, nullable=True)

    edstay = relationship("EdStay", back_populates="diagnoses")


class MedRecon(Base):
    __tablename__ = "medrecon"

    id = Column(Integer, primary_key=True, autoincrement=True)
    subject_id = Column(Integer, nullable=False)
    stay_id = Column(Integer, ForeignKey("edstays.stay_id"), nullable=False, index=True)
    charttime = Column(DateTime, nullable=True)
    name = Column(String(200), nullable=True)
    gsn = Column(String(20), nullable=True)
    ndc = Column(String(20), nullable=True)
    etc_rn = Column(Integer, nullable=True)
    etccode = Column(String(20), nullable=True)
    etcdescription = Column(Text, nullable=True)

    edstay = relationship("EdStay", back_populates="medrecon")


class Pyxis(Base):
    __tablename__ = "pyxis"

    id = Column(Integer, primary_key=True, autoincrement=True)
    subject_id = Column(Integer, nullable=False)
    stay_id = Column(Integer, ForeignKey("edstays.stay_id"), nullable=False, index=True)
    charttime = Column(DateTime, nullable=True)
    med_rn = Column(Integer, nullable=True)
    name = Column(String(200), nullable=True)
    gsn_rn = Column(Integer, nullable=True)
    gsn = Column(String(20), nullable=True)

    edstay = relationship("EdStay", back_populates="pyxis")
