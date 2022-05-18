# assignment-full-stack-dev-2022-ioigoume
The SongBook service

## Install

### Build the Python image
docker-compose build

### Pull the database
docker-compose pull

### Install python dependencies
docker-compose run --rm --no-deps web pip install --upgrade pip
docker-compose run --rm --no-deps web pip install -r requirements.txt

### Run Database deployment
docker-compose run --rm web alembic revision --autogenerate -m 'Initial Migration'
docker-compose run --rm web alembic upgrade head