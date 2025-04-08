from typing import Annotated, List
from fastapi import APIRouter, HTTPException, Query, Body
from sqlmodel import select
from db_session import SessionDep
from models.event import Event, DbEvent, EventPublic
from models.ticket import DbTicket, UserRole
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
        .where(DbTicket.event_id == event_id and
               DbTicket.role == UserRole.ORGANIZER)
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
        .where(DbTicket.event_id == event_id and
               DbTicket.role == UserRole.ATTENDEE)
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
        .where(DbTicket.event_id == event_id and
               DbTicket.role == UserRole.SPEAKER)
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
        .where(DbTicket.event_id == event_id and
               DbTicket.role == UserRole.SPONSOR)
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
        .where(DbTicket.event_id == event_id and
               DbTicket.role == UserRole.STAKEHOLDER)
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
        .where(DbTicket.event_id == event_id and
               DbTicket.role == UserRole.EVENT_ADMIN)
    )
    users = session.exec(query).all()
    return users


# New endpoint for removing users from an event
class RemoveUsersRequest(BaseModel):
    userIds: List[str]
    role: UserRole

@router.post("/{event_id}/remove-users")
def remove_users_from_event(
    event_id: int, 
    request: RemoveUsersRequest,
    session: SessionDep
):
    # Verify the event exists
    event = session.get(DbEvent, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Convert string IDs to integers
    user_ids = [int(user_id) for user_id in request.userIds]
    
    # Find tickets matching the criteria
    # Fix: Use proper SQLAlchemy syntax for conditions
    statement = select(DbTicket).where(
        (DbTicket.event_id == event_id) &
        (DbTicket.user_id.in_(user_ids)) &
        (DbTicket.role == request.role)
    )
    tickets = session.exec(statement).all()
    
    if not tickets:
        raise HTTPException(status_code=404, detail="No matching tickets found")
    
    # Delete the tickets
    for ticket in tickets:
        session.delete(ticket)
    
    session.commit()
    
    return {"message": f"Successfully removed {len(tickets)} users from the event", "removed_count": len(tickets)}