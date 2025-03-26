from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from db_session import SessionDep
from auth.auth import Token, authenticate_user, create_access_token, \
    create_refresh_token, verify_token

router = APIRouter(prefix="/token", tags=["Authentication"])


@router.post("/")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: SessionDep
) -> Token:
    user = authenticate_user(
        session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": user.username}
    )
    refresh_token = create_refresh_token(
        data={"sub": user.username})
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer")


@router.post("/refresh")
async def refresh_access_token(
    refresh_token: str
) -> Token:
    payload = verify_token(refresh_token)
    user = payload.get("sub")
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    new_access_token = create_access_token(data={"sub": user})
    new_refresh_token = create_refresh_token(data={"sub": user})
    return Token(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        token_type="bearer")
