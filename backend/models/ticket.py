from typing import Optional
from sqlmodel import Field, Relationship, SQLModel
from enum import Enum
import datetime as dt
from models.event import DbEvent, Event
from models.user import DbUser, User


class UserRole(str, Enum):
    ORGANIZER = "organizer",
    ATTENDEE = "attendee",
    SPEAKER = "speaker",
    SPONSOR = "sponsor",
    STAKEHOLDER = "stakeholder",
    EVENT_ADMIN = "eventAdmin",


class TicketBase(SQLModel):
    user_id: Optional[int] = Field(default=None, foreign_key="user.id", primary_key=True)
    event_id: Optional[int] = Field(default=None, foreign_key="event.id", primary_key=True)


class Ticket(TicketBase):
    role: UserRole = Field(default=UserRole.ATTENDEE)
    access_code: str | None = Field(default=None)
    virtual_link: str | None = Field(default=None)
    qr_code: str | None = Field(default=None)
    registration_date: dt.datetime
    is_bonus_ticket: bool


class DbTicket(Ticket, table=True):
    __tablename__ = "tickets"
    id: int | None = Field(default=None, primary_key=True)
    user: Optional[DbUser] = Relationship(back_populates="tickets")
    event: Optional[DbEvent] = Relationship(back_populates="tickets")


class TicketPublic(Ticket):
    id: int
