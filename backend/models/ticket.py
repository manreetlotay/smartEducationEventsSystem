from sqlmodel import Field, SQLModel
from enum import Enum
import datetime as dt

from models.user import User
from models.event import Event


class UserRole(str, Enum):
    ORGANIZER = "organizer",
    ATTENDEE = "attendee",
    SPEAKER = "speaker",
    SPONSOR = "sponsor",
    STAKEHOLDER = "stakeholder",
    EVENT_ADMIN = "eventAdmin",


class TicketBase(SQLModel):
    user: User
    event: Event


class Ticket(TicketBase):
    role: UserRole = Field(default=UserRole.ATTENDEE)
    access_code: str | None = Field(default=None)
    virtual_link: str | None = Field(default=None)
    qr_code: str | None = Field(default=None)
    registration_date: dt.datetime
    is_bonus_ticket: bool


class DbTicket(Ticket, table=True):
    id: int | None = Field(default=None, primary_key=True)


class TicketPublic(Ticket):
    id: int
