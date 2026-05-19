## Development Workflow
# SBIRE Backend

Backend API built with:
- FastAPI
- PostgreSQL
- dbmate
- Docker

Install the following tools before starting:


- [Docker](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository) (In WSL if in windows)
- WSL2 (Windows only)
- Python 3.12+
- make:  
    ``sudo apt install make``
- dbmate\
    ``sudo curl -fsSL -o /usr/local/bin/dbmate https://github.com/amacneil/dbmate/releases/latest/download/dbmate-linux-amd64``

    ``sudo chmod +x /usr/local/bin/dbmate``

### Initial setup
Clone the repository get into it and then:
```bash
make setup
```

### Start database

```bash
make up
```

### Run migrations

```bash
make migrate
```

### Start API

```bash
make dev
```

# Migration workflow
### Creating Migrations

Create migration:

```bash
make new-migration name=create_users
```

Apply migrations:

```bash
make migrate
```

Commit:
- migration file
- updated schema.sql