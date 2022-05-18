from typing import List, Optional
from sqlmodel import Field, Relationship, Session, SQLModel, create_engine
from datetime import datetime


class User(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    fist_name: str
    last_name: str
    email: str = Field(index=True)
    password: str
    # Port has_many
    songs: List["Song"] = Relationship(back_populates="song")

class Song(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    artist: str
    release_date: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    # Foreign Keys
    user_id: Optional[int] = Field(default=None, foreign_key="user.id", index=True)
    # Port has_many
    comments: List["Comment"] = Relationship(back_populates="comment")

class Comment(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    comment: str
    # Foreign key
    song_id: Optional[int] = Field(default=None, foreign_key="song.id", index=True)
    user_id: Optional[int] = Field(default=None, foreign_key="user.id", index=True)



