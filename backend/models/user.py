from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    username: str = Field(index=True, nullable=False, unique=True)


class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str
    points: int = Field(default=0)


class UserPublic(UserBase):
    id: int
    points: int = Field(default=0)


class UserCreate(UserBase):
    password: str


class UserUpdate(UserBase):
    username: str | None = None
    password: str | None = None
