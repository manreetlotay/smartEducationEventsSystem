from typing import List
from sqlmodel import Field, Relationship, SQLModel, LargeBinary
from enum import Enum

from models.ticket import Ticket


class UserType(str, Enum):
    INDIVIDUAL = "individual",
    ORGANIZATION = "organization",


class UserBase(SQLModel):
    username: str = Field(index=True, nullable=False, unique=True)


class User(UserBase):
    points: int = Field(default=0)
    email: str = Field(index=True, nullable=False, unique=True)
    phone_number: str
    profile_image: bytes | None = Field(default=None, sa_column=LargeBinary)
    user_type: UserType = Field(default=UserType.INDIVIDUAL)
    profession: str | None = Field(nullable=True)
    first_name: str
    last_name: str
    affiliation: str | None
    organization_name: str | None
    organization_address: str | None


class DbUser(User, table=True):
    __tablename__ = "users"
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str
    events: List["Event"] = Relationship(back_populates="users", link_model=Ticket)


class UserPublic(User):
    id: int


class UserCreate(User):
    password: str


class UserUpdate(User):
    username: str | None = None
    password: str | None = None
