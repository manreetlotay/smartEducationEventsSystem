from typing import Annotated
from fastapi import APIRouter, HTTPException, Query
from sqlmodel import select
from db_session import SessionDep
from models.event import Event, DbEvent, EventPublic

router = APIRouter(prefix="/events", tags=["Events"])


@router.post("/", response_model=Event)
def create_event(event: Event, session: SessionDep):
    db_event = DbEvent.model_validate(event)
    session.add(db_event)
    session.commit()
    session.refresh(db_event)
    return db_event


@router.get("/", response_model=list[EventPublic])
def read_events(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
):
    events = session.exec(select(DbEvent).offset(offset).limit(limit)).all()
    return events


@router.get("/{event_id}", response_model=EventPublic)
def read_event(event_id: int, session: SessionDep):
    event = session.get(DbEvent, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="event not found")
    return event


@router.patch("/{event_id}", response_model=EventPublic)
def update_event(event_id: int, event: Event, session: SessionDep):
    event_db = session.get(DbEvent, event_id)
    if not event_db:
        raise HTTPException(status_code=404, detail="Event not found")
    event_data = event.model_dump(exclude_unset=True)

    event_db.sqlmodel_update(event_data)
    session.add(event_db)
    session.commit()
    session.refresh(event_db)
    return event_db


@router.delete("/{event_id}")
def delete_event(event_id: int, session: SessionDep):
    event = session.get(DbEvent, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    session.delete(event)
    session.commit()
    return {"ok": True}