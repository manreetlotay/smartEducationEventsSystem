from typing import List
from sqlmodel import JSON, Column, Field, LargeBinary, Relationship, SQLModel
from enum import Enum
import datetime as dt

from models.ticket import Ticket
from models.user import User


class EventFormat(str, Enum):
    ONLINE = "online",
    PERSON = "in-person",
    HYBRID = "hybrid",


class EventBase(SQLModel):
    name: str = Field(index=True, nullable=False, unique=True)


class Event(EventBase):
    description: str
    event_format: EventFormat
    tags: list[str] | None = Field(default=None, sa_column=Column(JSON))
    banner_image: bytes | None = Field(default=None, sa_column=LargeBinary)
    start_date: dt.datetime
    end_date: dt.datetime
    capacity: int
    registration_deadline: dt.datetime | None
    address: str | None
    virtual_link: str | None = Field(default=None)
    is_free: bool
    price: float | None
    agenda: str
    admin: User


class DbEvent(Event, table=True):
    __tablename__ = "events"
    id: int | None = Field(default=None, primary_key=True)
    users: List["User"] = Relationship(back_populates="events", link_model=Ticket)


class EventPublic(Event):
    id: int
