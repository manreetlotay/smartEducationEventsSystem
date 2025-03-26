from fastapi import APIRouter
from db_session import SessionDep
from models.event import Event, DbEvent

router = APIRouter(prefix="/events", tags=["Events"])


@router.post("/", response_model=Event)
def create_event(event: Event, session: SessionDep):
    db_event = DbEvent.model_validate(event)
    session.add(db_event)
    session.commit()
    session.refresh(db_event)
    return db_event