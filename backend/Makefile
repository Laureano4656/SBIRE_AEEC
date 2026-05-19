.PHONY: help install up down restart logs migrate rollback new-migration dev setup reset-db shell

# ===== CONFIG =====

APP=app.main:app
PORT=8000

# ===== HELP =====

help:
	@echo ""
	@echo "Available commands:"
	@echo ""
	@echo "  make setup              -> Initial project setup"
	@echo "  make up                 -> Start PostgreSQL container"
	@echo "  make down               -> Stop containers"
	@echo "  make restart            -> Restart containers"
	@echo "  make logs               -> View Docker logs"
	@echo ""
	@echo "  make migrate            -> Run database migrations"
	@echo "  make rollback           -> Rollback last migration"
	@echo "  make new-migration name=create_users"
	@echo ""
	@echo "  make dev                -> Start FastAPI development server"
	@echo "  make shell              -> Activate virtual environment shell"
	@echo ""
	@echo "  make reset-db           -> DESTROYS database and recreates it"
	@echo ""

# ===== INITIAL SETUP =====

setup:
	python3 -m venv .venv
	. .venv/bin/activate && pip install -r requirements.txt
	sudo docker compose up -d
	. .venv/bin/activate && dbmate up

# ===== DOCKER =====

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose down
	docker compose up -d

logs:
	docker compose logs -f

# ===== DATABASE =====

migrate:
	. .venv/bin/activate && dbmate up

rollback:
	. .venv/bin/activate && dbmate rollback

new-migration:
	@if [ -z "$(name)" ]; then \
		echo "Usage: make new-migration name=create_users"; \
		exit 1; \
	fi
	. .venv/bin/activate && dbmate new $(name)

reset-db:
	docker compose down -v
	docker compose up -d
	sleep 3
	. .venv/bin/activate && dbmate up

# ===== DEVELOPMENT =====

dev:
	. .venv/bin/activate && PYTHONPATH=. fastapi dev app/api/main.py

shell:
	@echo "Run:"
	@echo ""
	@echo "source .venv/bin/activate"