import datetime as dt
from enum import Enum
from typing import Annotated

import jwt
from passlib.context import CryptContext

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, SecurityScopes

from pydantic import BaseModel, ValidationError

from db_session import SessionDep

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "b3ab602365eca4438f5464af051346593a69cde811da985e230010b06e8a4ee1"
REFRESH_SECRET_KEY = \
    "85cefc14a9af6a182ceebd79252407c0786e1a4bd770f748cb8766eee6822c61"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 10

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token",
        scopes={
            "read_public": "Public Read Access",
            "read_owned_private": "Owned Read Access",
            "read_unowned_private": "Unowned Private Read Access",
            "write_owned_private": "Private Write Access",
            "write_public": "Public Write Access",
            "write_unowned_private": "Unowned Private Write Access",
        },
    )


def user_permissions():
    return ["read_public", "read_owned_private", "write_owned_private"]


def admin_permissions():
    return ["read_public", "read_owned_private", "write_owned_private",
            "read_unowned_private", "write_public", "write_unowned_private",]


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class TokenType(str, Enum):
    ACCESS = "access"
    REFRESH = "refresh"


class TokenData(BaseModel):
    username: str | None = None
    scopes: list[str] = []


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(session: SessionDep, username: str, password: str):
    from routers.users import search_user
    user = search_user(username, session)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = dt.datetime.now(dt.timezone.utc) + \
        dt.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "token_type": TokenType.ACCESS})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = dt.datetime.now(dt.timezone.utc).replace(tzinfo=None) + \
        dt.timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "token_type": TokenType.REFRESH})
    encoded_jwt: str = \
        jwt.encode(to_encode, REFRESH_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str):
    try:
        payload = jwt.decode(token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Invalid token")


async def get_current_user(security_scopes: SecurityScopes, 
                    token: Annotated[str, Depends(oauth2_scheme)], 
                    session: SessionDep):
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = "Bearer"
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": authenticate_value},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_scopes = payload.get("scopes", [])
        token_data = TokenData(username=username, scopes=token_scopes)
    except (jwt.InvalidTokenError, ValidationError):
        raise credentials_exception
    from routers.users import search_user
    user = search_user(username=token_data.username, session=session)
    if user is None:
        raise credentials_exception
    for scope in security_scopes.scopes:
        if scope not in token_data.scopes:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not enough permissions",
                headers={"WWW-Authenticate": authenticate_value},
            )
    return user
