from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db_session import create_db_and_tables
import uvicorn


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create Tables
    create_db_and_tables()
    yield
    # Maybe do something here later

from routers import auth, users, events

app = FastAPI(lifespan=lifespan)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(events.router)

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
    uvicorn.run(app, host="localhost", port=8000)
