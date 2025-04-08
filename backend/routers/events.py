from typing import Annotated, List
from fastapi import APIRouter, HTTPException, Query, Body
from sqlmodel import select
from db_session import SessionDep
from models.event import Event, DbEvent, EventPublic
from models.ticket import DbTicket, TicketPublic, UserRole
from models.user import DbUser, UserPublic
from pydantic import BaseModel

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


@router.get("/{event_id}/users", response_model=list[UserPublic])
def users(
    event_id: int,
    session: SessionDep,
):
    query = (
        select(DbUser)
        .join(DbTicket, DbUser.id == DbTicket.user_id)
        .where(DbTicket.event_id == event_id)
    )
    users = session.exec(query).all()
    return users


@router.get("/{event_id}/organizers", response_model=list[UserPublic])
def organizers(
    event_id: int,
    session: SessionDep,
):
    query = (
        select(DbUser)
        .join(DbTicket, DbUser.id == DbTicket.user_id)
        .where(DbTicket.event_id == event_id)
        .where(DbTicket.role == UserRole.ORGANIZER)
    )
    users = session.exec(query).all()
    return users


@router.get("/{event_id}/attendees", response_model=list[UserPublic])
def attendees(
    event_id: int,
    session: SessionDep,
):
    query = (
        select(DbUser)
        .join(DbTicket, DbUser.id == DbTicket.user_id)
        .where(DbTicket.event_id == event_id)
        .where(DbTicket.role == UserRole.ATTENDEE)
    )
    users = session.exec(query).all()
    return users


@router.get("/{event_id}/speakers", response_model=list[UserPublic])
def speakers(
    event_id: int,
    session: SessionDep,
):
    query = (
        select(DbUser)
        .join(DbTicket, DbUser.id == DbTicket.user_id)
        .where(DbTicket.event_id == event_id)
        .where(DbTicket.role == UserRole.SPEAKER)
    )
    users = session.exec(query).all()
    return users


@router.get("/{event_id}/sponsors", response_model=list[UserPublic])
def sponsors(
    event_id: int,
    session: SessionDep,
):
    query = (
        select(DbUser)
        .join(DbTicket, DbUser.id == DbTicket.user_id)
        .where(DbTicket.event_id == event_id)
        .where(DbTicket.role == UserRole.SPONSOR)
    )
    users = session.exec(query).all()
    return users


@router.get("/{event_id}/stakeholders", response_model=list[UserPublic])
def stakeholders(
    event_id: int,
    session: SessionDep,
):
    query = (
        select(DbUser)
        .join(DbTicket, DbUser.id == DbTicket.user_id)
        .where(DbTicket.event_id == event_id)
        .where(DbTicket.role == UserRole.STAKEHOLDER)
    )
    users = session.exec(query).all()
    return users


@router.get("/{event_id}/eventAdmins", response_model=list[UserPublic])
def eventAdmins(
    event_id: int,
    session: SessionDep,
):
    query = (
        select(DbUser)
        .join(DbTicket, DbUser.id == DbTicket.user_id)
        .where(DbTicket.event_id == event_id)
        .where(DbTicket.role == UserRole.EVENT_ADMIN)
    )
    users = session.exec(query).all()
    return users


router.get("/tickets/{event_id}/users", response_model=list[TicketPublic])
def user_tickets(
    event_id: int,
    session: SessionDep,
):
    query = (
        select(DbTicket)
        .where(DbTicket.event_id == event_id)
    )
    tickets = session.exec(query).all()
    return tickets


@router.get("/tickets/{event_id}/organizers", response_model=list[TicketPublic])
def organizer_tickets(
    event_id: int,
    session: SessionDep,
):
    query = (
        select(DbTicket)
        .where(DbTicket.event_id == event_id)
        .where(DbTicket.role == UserRole.ORGANIZER)
    )
    tickets = session.exec(query).all()
    return tickets


@router.get("/tickets/{event_id}/attendees", response_model=list[TicketPublic])
def attendee_tickets(
    event_id: int,
    session: SessionDep,
):
    query = (
        select(DbTicket)
        .where(DbTicket.event_id == event_id)
        .where(DbTicket.role == UserRole.ATTENDEE)
    )
    tickets = session.exec(query).all()
    return tickets


@router.get("/tickets/{event_id}/speakers", response_model=list[TicketPublic])
def speaker_tickets(
    event_id: int,
    session: SessionDep,
):
    query = (
        select(DbTicket)
        .where(DbTicket.event_id == event_id)
        .where(DbTicket.role == UserRole.SPEAKER)
    )
    tickets = session.exec(query).all()
    return tickets


@router.get("/tickets/{event_id}/sponsors", response_model=list[TicketPublic])
def sponsor_tickets(
    event_id: int,
    session: SessionDep,
):
    query = (
        select(DbTicket)
        .where(DbTicket.event_id == event_id)
        .where(DbTicket.role == UserRole.SPONSOR)
    )
    tickets = session.exec(query).all()
    return tickets


@router.get("/tickets/{event_id}/stakeholders", response_model=list[TicketPublic])
def stakeholder_tickets(
    event_id: int,
    session: SessionDep,
):
    query = (
        select(DbTicket)
        .where(DbTicket.event_id == event_id)
        .where(DbTicket.role == UserRole.STAKEHOLDER)
    )
    tickets = session.exec(query).all()
    return tickets


@router.get("/tickets/{event_id}/eventAdmins", response_model=list[TicketPublic])
def eventAdmin_tickets(
    event_id: int,
    session: SessionDep,
):
    query = (
        select(DbTicket)
        .where(DbTicket.event_id == event_id)
        .where(DbTicket.role == UserRole.EVENT_ADMIN)
    )
    tickets = session.exec(query).all()
    return tickets