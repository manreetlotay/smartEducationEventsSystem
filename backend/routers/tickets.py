from typing import Annotated
from fastapi import APIRouter, HTTPException, Query
from sqlmodel import select
from db_session import SessionDep
from models.event import DbEvent
from models.ticket import Ticket, DbTicket, TicketPublic
from models.user import DbUser

router = APIRouter(prefix="/tickets", tags=["Tickets"])


@router.post("/", response_model=Ticket)
def create_ticket(ticket: Ticket, session: SessionDep):
    user = session.get(DbUser, ticket.user_id)
    event = session.get(DbEvent, ticket.event_id)
    if not user:
        raise HTTPException(status_code=404, detail="user not found")
    if not event:
        raise HTTPException(status_code=404, detail="event not found")
    db_ticket = DbTicket.model_validate(ticket)
    session.add(db_ticket)
    session.commit()
    session.refresh(db_ticket)
    return db_ticket


@router.get("/", response_model=list[TicketPublic])
def read_tickets(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
):
    tickets = session.exec(select(DbTicket).offset(offset).limit(limit)).all()
    return tickets


@router.get("/{ticket_id}", response_model=TicketPublic)
def read_ticket(ticket_id: int, session: SessionDep):
    ticket = session.get(DbTicket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="ticket not found")
    return ticket


@router.patch("/{ticket_id}", response_model=TicketPublic)
def update_ticket(ticket_id: int, ticket: Ticket, session: SessionDep):
    ticket_db = session.get(DbTicket, ticket_id)
    if not ticket_db:
        raise HTTPException(status_code=404, detail="Ticket not found")
    ticket_data = ticket.model_dump(exclude_unset=True)

    ticket_db.sqlmodel_update(ticket_data)
    session.add(ticket_db)
    session.commit()
    session.refresh(ticket_db)
    return ticket_db


@router.delete("/{ticket_id}")
def delete_ticket(ticket_id: int, session: SessionDep):
    ticket = session.get(DbTicket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    session.delete(ticket)
    session.commit()
    return {"ok": True}


@router.get("filter/{user_id}/{event_id}", response_model=list[TicketPublic])
def filter_tickets(user_id: int, event_id: int, session: SessionDep):
    query = (
        select(DbTicket)
        .where(DbTicket.event_id == event_id)
    )
    tickets = session.exec(query).all()
    return tickets


@router.delete("filter/{user_id}/{event_id}", response_model=list[TicketPublic])
def filter_delete_tickets(user_id: int, event_id: int, session: SessionDep):
    query = (
        select(DbTicket)
        .where(DbTicket.event_id == event_id)
    )
    tickets = session.exec(query).all()
    session.delete(tickets)
    session.commit()
    return {"ok": True}