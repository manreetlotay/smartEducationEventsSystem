from contextlib import asynccontextmanager
import getpass
from sqlmodel import select
from models.event import DbEvent
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from db_session import create_db_and_tables, engine
from auth.auth import get_password_hash
import datetime as dt
import sys
import uvicorn


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create Tables
    create_db_and_tables()
    yield
    # Maybe do something here later

from models.ticket import DbTicket
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
        print(f"Admin user {email} created successfully.")


def generate_mock_data():
    create_db_and_tables()
    karl = DbUser(
        email="karl@e.com",
        hashed_password=get_password_hash(password="iamkarl"),
        is_site_admin=True,
        phone_number="438-567-1234",
        first_name="Karl",
        last_name="Franz",
        user_type="individual",
        points=0,
        affiliation=None,
        profession=None,
        organization_name=None,
        organization_address=None,
    )

    linda = DbUser(
        email="ilikemoney@e.com",
        hashed_password=get_password_hash(password="iamlinda"),
        is_site_admin=True,
        phone_number="514-890-2345",
        first_name="Linda",
        last_name="Watt",
        user_type="individual",
        points=6e10,
        affiliation=None,
        profession=None,
        organization_name=None,
        organization_address=None,
    )

    rache = DbUser(
        email="rabid@e.com",
        hashed_password=get_password_hash(password="iamlrache"),
        is_site_admin=True,
        phone_number="461-456-1222",
        first_name="Rache",
        last_name="Bartmoss",
        user_type="individual",
        points=300,
        affiliation=None,
        profession=None,
        organization_name=None,
        organization_address=None,
    )

    with Session(engine) as session:
        session.add(karl)
        session.add(linda)
        session.add(rache)
        session.commit()

    print("Mock user data generated")

    with Session(engine) as session:
        rache_db = session.exec(select(DbUser).where(
            DbUser.email == "rabid@e.com")).first()
        linda_db = session.exec(select(DbUser).where(
            DbUser.email == "ilikemoney@e.com")).first()
        karl_db = session.exec(select(DbUser).where(
            DbUser.email == "karl@e.com")).first()
        

    e1 = DbEvent(
        name="Annual Tech Conference 2025",
        description="Join us for three days of inspiring talks and workshops on the latest technology trends and innovations. Network with industry leaders and gain insights into cutting-edge developments.",
        event_format="hybrid",
        start_date=dt.datetime.now() + dt.timedelta(days=30),
        end_date=dt.datetime.now() + dt.timedelta(days=31),
        tags=["technology", "conference", "networking", "innovation"],
        capacity=100,
        registration_deadline=dt.datetime.now() + dt.timedelta(days=10),
        address="123 Tech Boulevard, San Francisco, CA 94105",
        virtual_link="https://virtual-conference-platform.com/tech2025",
        is_free=True,
        price=None,
        agenda="Day 1: Opening Keynote (9:00 AM - 10:30 AM), Workshop Sessions (11:00 AM - 5:00 PM)\n\nDay 2: Industry Panel (9:00 AM - 11:00 AM), Tech Demos (1:00 PM - 5:00 PM)\n\nDay 3: Networking Event (9:00 AM - 12:00 PM), Closing Remarks (3:00 PM - 4:30 PM)",
        admin_id=rache_db.id,
    )

    e2 = DbEvent(
        name="Machine Learning Workshop",
        description="Join us for three days of inspiring talks and workshops on the latest technology trends and innovations. Network with industry leaders and gain insights into cutting-edge developments.",
        event_format="in-person",
        start_date=dt.datetime.now() + dt.timedelta(days=40),
        end_date=dt.datetime.now() + dt.timedelta(days=42),
        tags=["AI", "LLM", "Machine Learning"],
        capacity=60,
        registration_deadline=dt.datetime.now() + dt.timedelta(days=300),
        address="1430 Boul Maisonneuve, Montreal, QC",
        virtual_link=None,
        is_free=False,
        price=25,
        agenda= "Day 1: Opening Keynote (9:00 AM - 10:30 AM), Workshop Sessions (11:00 AM - 5:00 PM)\n\nDay 2: Industry Panel (9:00 AM - 11:00 AM), Tech Demos (1:00 PM - 5:00 PM)\n\nDay 3: Networking Event (9:00 AM - 12:00 PM), Closing Remarks (3:00 PM - 4:30 PM)",
        admin_id=linda_db.id,
    )

    e3 = DbEvent(
        name="Learn Calculus I",
        description="Enhance your mathematical skills",
        event_format="online",
        start_date=dt.datetime.now() + dt.timedelta(days=10),
        end_date=dt.datetime.now() + dt.timedelta(days=12),
        capacity=115,
        registration_deadline=dt.datetime.now() + dt.timedelta(days=1),
        address=None,
        virtual_link="https://virtual-conference-platform.com/tech2025",
        is_free=False,
        price=10,
        agenda="2 hour session to review high school math basics.\n\n Then, we move on to limits.",
        admin_id=karl_db.id,
    )

    print("Mock event data generated")

    with Session(engine) as session:
        session.add(e1)
        session.add(e2)
        session.add(e3)
        session.commit()

    with Session(engine) as session:
        rache_event = session.exec(select(DbEvent).where(
            DbEvent.admin_id == rache_db.id)).first()
        linda_event = session.exec(select(DbEvent).where(
            DbEvent.admin_id == linda_db.id)).first()
        karl_event = session.exec(select(DbEvent).where(
            DbEvent.admin_id == karl_db.id)).first()

    rache_admin_ticket = DbTicket(
        user_id=rache_db.id,
        event_id=rache_event.id,
        role="eventAdmin",
        access_code=None,
        virtual_link="https://virtual-conference-platform.com/tech2025",
        qr_code=None,
        registration_date=dt.datetime.now() - dt.timedelta(days=10),
    )

    linda_speaker_ticket = DbTicket(
        user_id=linda_db.id,
        event_id=rache_event.id,
        role="speaker",
        access_code=None,
        virtual_link="https://virtual-conference-platform.com/tech2025",
        qr_code=None,
        registration_date=dt.datetime.now() - dt.timedelta(days=10),
    )

    rache_organizer_ticket = DbTicket(
        user_id=rache_db.id,
        event_id=rache_event.id,
        role="organizer",
        access_code="BEYFNID-45678",
        virtual_link="https://liquipedia.net/counterstrike/Portal:Tournaments",
        qr_code=None,
        registration_date=dt.datetime.now() - dt.timedelta(days=10),
    )

    linda_admin_ticket = DbTicket(
        user_id=linda_db.id,
        event_id=linda_event.id,
        role="eventAdmin",
        access_code="ABXCED-45678",
        virtual_link=None,
        qr_code=None,
        registration_date=dt.datetime.now() - dt.timedelta(days=10),
    )

    linda_stakeholder_ticket = DbTicket(
        user_id=linda_db.id,
        event_id=linda_event.id,
        role="stakeholder",
        access_code="ABXCED-45678",
        virtual_link=None,
        qr_code=None,
        registration_date=dt.datetime.now() - dt.timedelta(days=10),
    )

    linda_sponsor_ticket = DbTicket(
        user_id=linda_db.id,
        event_id=karl_event.id,
        role="sponsor",
        access_code="ABXCED-45678",
        virtual_link=None,
        qr_code=None,
        registration_date=dt.datetime.now() - dt.timedelta(days=10),
    )

    rache_csgo_ticket = DbTicket(
        user_id=rache_db.id,
        event_id=linda_event.id,
        role="attendee",
        access_code="ABXCED-45678",
        virtual_link=None,
        qr_code=None,
        registration_date=dt.datetime.now() - dt.timedelta(days=10),
    )

    karl_admin_ticket = DbTicket(
        user_id=karl_db.id,
        event_id=karl_event.id,
        role="eventAdmin",
        access_code="BEYFNID-45678",
        virtual_link="https://liquipedia.net/counterstrike/Portal:Tournaments",
        qr_code=None,
        registration_date=dt.datetime.now() - dt.timedelta(days=10),
    )

    rache_org_ticket = DbTicket(
        user_id=rache_db.id,
        event_id=karl_event.id,
        role="organizer",
        access_code="BEYFNID-45678",
        virtual_link="https://liquipedia.net/counterstrike/Portal:Tournaments",
        qr_code=None,
        registration_date=dt.datetime.now() - dt.timedelta(days=10),
    )

    karl_speaker_ticket = DbTicket(
        user_id=karl_db.id,
        event_id=linda_event.id,
        role="speaker",
        access_code="ABXCED-45678",
        virtual_link=None,
        qr_code=None,
        registration_date=dt.datetime.now() - dt.timedelta(days=10),
    )

    karl_organizer_ticket = DbTicket(
        user_id=karl_db.id,
        event_id=linda_event.id,
        role="organizer",
        access_code="ABXCED-45678",
        virtual_link=None,
        qr_code=None,
        registration_date=dt.datetime.now() - dt.timedelta(days=10),
    )

    with Session(engine) as session:
        session.add(rache_admin_ticket)
        session.add(linda_admin_ticket)
        session.add(rache_csgo_ticket)
        session.add(karl_admin_ticket)
        session.add(karl_speaker_ticket)
        session.add(rache_organizer_ticket)
        session.add(linda_stakeholder_ticket)
        session.add(linda_sponsor_ticket)
        session.add(karl_organizer_ticket)
        session.add(linda_speaker_ticket)
        session.add(rache_org_ticket)
        session.commit()

    print("Mock ticket data generated")
        



@app.get("/")
async def root():
    return {"message": "Hello API"}

if __name__ == "__main__":
    args = sys.argv

    if 'create_admin' in args:
        create_admin()
    elif 'generate_mock_data' in args:
        generate_mock_data()
    else:
        uvicorn.run(app, host="localhost", port=8000)
