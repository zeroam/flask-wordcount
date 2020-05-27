### Source
- [flask-by-example](https://github.com/realpython/flask-by-example)


## Quick Start
### Set python environment
```bash
$ python -m venv venv
$ source venv/bin/activate
$ pip install -r requirements.txt
```

### Set database, redis using docker
```bash
# setup postgres
$ ./scripts/postgresql.sh

# setup redis
$ ./scripts/redis.sh
```

### Set up Migrations
```bash
$ python manage.py db init
$ python manage.py db migrate
$ python manage.py db upgrade
```

```bash
# worker process
python worker.py

# the app
python app.py
```