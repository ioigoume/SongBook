from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select

from app.database import get_session
from app.models import *

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/ping")
def pong():
    return {"ping": "pong!"}


@app.post("/songs/",
          response_model=SongRead,
          tags=["songs"])
def create_song(*, session: Session = Depends(get_session), song: SongCreate):
    db_song = Song.from_orm(song)
    session.add(db_song)
    session.commit()
    session.refresh(db_song)
    return db_song


@app.get("/songs/",
         response_model=List[SongRead],
         tags=["songs"])
def read_songs(
        *,
        session: Session = Depends(get_session),
        offset: int = 0,
        limit: int = Query(default=100, lte=100),
):
    songs = session.exec(select(Song).offset(offset).limit(limit)).all()
    return songs


@app.get("/songs/{song_id}",
         response_model=SongRead,
         tags=["songs"])
def read_song(*, session: Session = Depends(get_session), song_id: int):
    song = session.get(Song, song_id)
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    return song


@app.patch("/songs/{song_id}",
           response_model=SongRead,
           tags=["songs"])
def update_song(
        *, session: Session = Depends(get_session), song_id: int, song: SongUpdate
):
    db_song = session.get(Song, song_id)
    if not db_song:
        raise HTTPException(status_code=404, detail="Song not found")
    song_data = song.dict(exclude_unset=True)
    for key, value in song_data.items():
        setattr(db_song, key, value)
    session.add(db_song)
    session.commit()
    session.refresh(db_song)
    return db_song


@app.delete("/songs/{song_id}",
            tags=["songs"])
def delete_song(*, session: Session = Depends(get_session), song_id: int):
    song = session.get(Song, song_id)
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    session.delete(song)
    session.commit()
    return {"ok": True}


# User
@app.post("/users/",
          response_model=UserCreate,
          tags=["users"])
def create_user(*, session: Session = Depends(get_session), user: UserCreate):
    db_user = User.from_orm(user)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


@app.get("/users/",
         response_model=List[UserRead],
         tags=["users"])
def read_users(
        *,
        session: Session = Depends(get_session),
        offset: int = 0,
        limit: int = Query(default=100, lte=100),
):
    users = session.exec(select(User).offset(offset).limit(limit)).all()
    return users


@app.get("/users/{user_id}/songs",
         response_model=List[UserSongsRead],
         tags=["songs", "collections"])
def read_user_songs(
        *,
        session: Session = Depends(get_session),
        offset: int = 0,
        limit: int = Query(default=100, lte=100),
        user_id: int
):
    songs = session.exec(select(Song).where(Song.user_id == user_id).offset(offset).limit(limit)).all()
    return songs


@app.get("/users/{user_id}",
         response_model=UserRead,
         tags=["users"])
def read_user(
        *,
        session: Session = Depends(get_session),
        user_id: int):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.patch("/users/{user_id}",
           response_model=UserUpdate,
           tags=["users"])
def update_user(
        *, session: Session = Depends(get_session), user_id: int, user: UserUpdate
):
    db_user = session.get(User, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    user_data = user.dict(exclude_unset=True)
    for key, value in user_data.items():
        setattr(db_user, key, value)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


@app.delete("/users/{user_id}",
            tags=["users"])
def delete_user(*, session: Session = Depends(get_session), user_id: int):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    session.delete(user)
    session.commit()
    return {"ok": True}


@app.post("/users/login",
          response_model=UserLoginResponse,
          tags=["users", "authentication"])
def login_user(
        user_login: UserLogin,
        session: Session = Depends(get_session)
):
    statement = select(User).where(User.email == user_login.email, User.password == user_login.password)
    result_set = session.exec(statement)
    user = result_set.first()
    if user:
        return user
    else:
        return {}
