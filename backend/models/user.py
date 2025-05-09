from sqlmodel import Field, SQLModel, LargeBinary
from enum import Enum


class UserType(str, Enum):
    INDIVIDUAL = "individual",
    ORGANIZATION = "organization",


class User(SQLModel):
    points: int = Field(default=0)
    email: str = Field(index=True, nullable=False, unique=True)
    phone_number: str
    profile_image: bytes | None = Field(default=None, sa_column=LargeBinary)
    user_type: UserType = Field(default=UserType.INDIVIDUAL)
    profession: str | None = Field(nullable=True, default=None)
    first_name: str | None = Field(nullable=True, default=None)
    last_name: str | None = Field(nullable=True, default=None)
    affiliation: str | None = Field(nullable=True, default=None)
    organization_name: str | None = Field(default=None)
    organization_address: str | None = Field(default=None)
    is_site_admin: bool = Field(default=False)


class DbUser(User, table=True):
    __tablename__ = "users"
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str


class UserPublic(User):
    id: int


class UserCreate(User):
    password: str


class UserUpdate(User):
    email: str | None = None
    password: str | None = None
    points: int | None = None
    phone_number: str | None = None
    profile_image: bytes | None = None
    user_type: UserType | None = None
    profession: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    affiliation: str | None = None
    organization_name: str | None = None
    organization_address: str | None = None
    is_site_admin: bool | None = None