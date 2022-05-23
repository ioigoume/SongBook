from typing import List, Optional
from sqlmodel import Field, Relationship, Session, SQLModel
from sqlalchemy import UniqueConstraint
from datetime import datetime


# User
class UserBase(SQLModel):
    first_name: str
    last_name: str
    email: str = Field(index=True)
    password: str


class User(UserBase, table=True):
    __table_args__ = (UniqueConstraint("email"),)
    id: Optional[int] = Field(default=None, primary_key=True)

    songs: List["Song"] = Relationship(back_populates="song")


class UserCreate(UserBase):
    pass


class UserRead(UserBase):
    id: int


class UserUpdate(SQLModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None


class UserLogin(SQLModel):
    email: str
    password: str

class UserLoginResponse(SQLModel):
    id: int
    email: str
    first_name: str
    last_name: str


# Songs
class SongBase(SQLModel):
    title: str
    artist: str
    release_date: str

    user_id: Optional[int] = Field(default=None, foreign_key="user.id")


class Song(SongBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    user: Optional[User] = Relationship(back_populates="users")


class SongRead(SongBase):
    id: int


class UserSongsRead(SongBase):
    id: int


class SongCreate(SongBase):
    pass


class SongUpdate(SQLModel):
    title: Optional[str] = None
    artist: Optional[str] = None
    release_date: Optional[datetime] = None
    user_id: Optional[int] = None


# Songs
class CommentBase(SQLModel):
    comment: str
    created: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    song_id: Optional[int] = Field(default=None, foreign_key="song.id")


class Comment(CommentBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    user: Optional[User] = Relationship(back_populates="users")
    song: Optional[Song] = Relationship(back_populates="songs")


class CommentRead(CommentBase):
    id: int


class CommentCreate(CommentBase):
    pass


class CommentUpdate(SQLModel):
    comment: Optional[str] = None
