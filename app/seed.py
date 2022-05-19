from sqlmodel import SQLModel, Session, create_engine
from models import *
from database import *
import typer

url = os.getenv('DATABASE_URL')
engine = create_engine(url)

# Create/Initialize the database structure
def init():
    SQLModel.metadata.create_all(engine)

# Seed the database
def seed():
    with Session(engine) as session:
        # Users
        # todo: Use array and iterate over it
        user_1 = User(first_name="John", last_name="Doe", email="john.doe@mailinator.com", password="1234")
        user_2 = User(first_name="Bob", last_name="Builder", email="bob.builder@mailinator.com", password="1234")
        session.add(user_1)
        session.add(user_2)
        session.commit()
        # Songs
        song_1 = Song(title="Dynamite", artist="BTS", release_date="12/12/12", user_id=user_1.id)
        song_2 = Song(title="Sunflower", artist="Post Malone and Swae",release_date= "12/12/12", user_id=user_1.id)
        song_3 = Song(title="Perfect", artist="Ed Sheeran",release_date= "12/12/12", user_id=user_1.id)
        song_4 = Song(title="Chandelier", artist="Sia", release_date="12/12/12", user_id=user_1.id)
        song_5 = Song(title="Hello", artist="Adele", release_date="12/12/12", user_id=user_2.id)
        song_6 = Song(title="Circles", artist="Post Malone",release_date= "12/12/12", user_id=user_2.id)
        session.add(song_1)
        session.add(song_2)
        session.add(song_3)
        session.add(song_4)
        session.add(song_5)
        session.add(song_6)
        session.commit()
        # Comment


if __name__ == "__main__":
    typer.run(seed)