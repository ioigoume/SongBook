import os

from sqlmodel import create_engine, SQLModel, Session

# Initialize
# SQLALCHEMY_DATABASE_URL: This is defined in the docker-compose.yml file
# todo: For production remove echo parameter
url = os.getenv('SQLALCHEMY_DATABASE_URL')
engine = create_engine(url, echo=True)

def init():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
