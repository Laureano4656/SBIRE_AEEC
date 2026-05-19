## Development Workflow
# SBIRE Backend

Backend API built with:
- FastAPI
- PostgreSQL
- dbmate
- Docker

Install the following tools before starting:


- Docker(In WSL if in windows)
- WSL2 (Windows only)
- Python 3.12+
- make:  
    ``sudo apt install make``
- dbmate\
    ``sudo curl -fsSL -o /usr/local/bin/dbmate https://github.com/amacneil/dbmate/releases/latest/download/dbmate-linux-amd64``

    ``sudo chmod +x /usr/local/bin/dbmate``
- Compilador de C:
    ```
    sudo apt update && sudo apt install -y build-essential
    ```
----
----
## Install docker

### Configure directory
```
sudo apt update
sudo apt install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```
```
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```
### Install
```
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```
---
---
## Install python _deadsnakes_ repositories
```
sudo apt install software-properties-common -y
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update
sudo apt install python3.12 python3.12-venv python3.12-dev -y
```

---
---
## Initial setup
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