from typing import Annotated

from fastapi import Depends

from sqlmodel import create_engine, SQLModel, Session

from design_patterns.singleton import Singleton

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}


class EngineSingleton(Singleton):
    def __init__(self, engine):
        if not hasattr(self, 'engine'):
            self.engine = engine


engine = create_engine(sqlite_url, connect_args=connect_args)
engine_singleton = EngineSingleton(engine)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine_singleton.engine)


def get_session():
    with Session(engine_singleton.engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]