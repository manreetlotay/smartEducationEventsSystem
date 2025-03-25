from contextlib import asynccontextmanager

from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from sqlmodel import create_engine, SQLModel, Session
import uvicorn

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create Tables
    create_db_and_tables()
    yield
    # Maybe do something here later

SessionDep = Annotated[Session, Depends(get_session)]

from routers import auth, users

app = FastAPI(lifespan=lifespan)

app.include_router(auth.router)
app.include_router(users.router)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
