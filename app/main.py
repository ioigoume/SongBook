from fastapi import Depends, FastAPI
# from sqlalchemy.future import select
# from sqlalchemy.ext.asyncio import AsyncSession

# from app.db import get_session
# from app.models import Song, SongCreate

app = FastAPI()


@app.get("/ping")
async def pong():
    return {"ping": "pong!"}

