
from typing import Annotated
from fastapi import APIRouter, HTTPException, Query, Security
from sqlmodel import select
from db_session import SessionDep
from auth.auth import get_current_user, get_password_hash
from models.user import DbUser, User, UserCreate, UserPublic, UserUpdate

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/", response_model=UserPublic)
def create_user(user: UserCreate, session: SessionDep):
    hashed_password = get_password_hash(user.password)
    db_user = DbUser.model_validate(
        user, update={"hashed_password": hashed_password})
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


@router.get("/", response_model=list[UserPublic])
def read_users(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
):
    users = session.exec(select(DbUser).offset(offset).limit(limit)).all()
    return users


@router.get("/me", response_model=UserPublic)
async def read_users_me(
    current_user: Annotated[User, Security(get_current_user,
                                           scopes=["read_owned_private"])],
):
    return current_user


@router.get("/{user_id}", response_model=UserPublic)
def read_user(user_id: int, session: SessionDep):
    user = session.get(DbUser, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/search/{username}", response_model=UserPublic)
def search_user(username: str, session: SessionDep):
    user = session.exec(
        select(DbUser).where(DbUser.username == username)
        ).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/{user_id}", response_model=UserPublic)
def update_user(user_id: int, user: UserUpdate, session: SessionDep):
    user_db = session.get(DbUser, user_id)
    if not user_db:
        raise HTTPException(status_code=404, detail="User not found")
    user_data = user.model_dump(exclude_unset=True)

    if "password" in user_data:
        user_data["hashed_password"] = \
            get_password_hash(user_data.pop("password"))

    user_db.sqlmodel_update(user_data)
    session.add(user_db)
    session.commit()
    session.refresh(user_db)
    return user_db


@router.delete("/{user_id}")
def delete_user(user_id: int, session: SessionDep):
    user = session.get(DbUser, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    session.delete(user)
    session.commit()
    return {"ok": True}