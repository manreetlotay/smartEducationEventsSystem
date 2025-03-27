from contextlib import asynccontextmanager
import getpass
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from db_session import create_db_and_tables, engine
from auth.auth import get_password_hash
import sys
import uvicorn


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create Tables
    create_db_and_tables()
    yield
    # Maybe do something here later

from models.user import DbUser
from routers import auth, users, events, tickets

app = FastAPI(lifespan=lifespan)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(events.router)
app.include_router(tickets.router)

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


def create_admin():
    username = input("Enter username: ").strip()
    email = input("Enter email: ").strip()
    
    matching = False
    while not matching:
        password = getpass.getpass("Enter password: ").strip()
        confirm_password = getpass.getpass("Confirm password: ").strip()
        print(password)
        print(confirm_password)

        if password != confirm_password:
            print("Passwords do not match. Try again.")
        else:
            matching = True
    
    create_db_and_tables()
    hashed_password = get_password_hash(password=password)
    
    admin_user = DbUser(
        username=username,
        email=email,
        hashed_password=hashed_password,
        is_site_admin=True,
        phone_number="0000000000",
        first_name="Admin",
        last_name="User",
        user_type="individual",
        points=0,
        affiliation=None,
        profession=None,
        organization_name=None,
        organization_address=None,
    )

    with Session(engine) as session:
        session.add(admin_user)
        session.commit()
        print(f"Admin user {username} created successfully.")


@app.get("/")
async def root():
    return {"message": "Hello API"}

if __name__ == "__main__":
    args = sys.argv

    if 'create_admin' in args:
        create_admin()
    else:
        uvicorn.run(app, host="localhost", port=8000)
