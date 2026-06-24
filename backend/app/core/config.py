# core/config.py
# ─────────────────────────────────────────────────────────────────────────────
# Configuración centralizada de la aplicación.
# Usa pydantic-settings para leer variables de entorno automáticamente.
# Nunca hardcodear credenciales aquí — todo viene del .env o del entorno.
# ─────────────────────────────────────────────────────────────────────────────

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ── Base de datos ─────────────────────────────────────────────────────────
    # Formato: postgresql://usuario:password@host:puerto/nombre_db
    DATABASE_URL: str = "postgresql://laureano:laureano@localhost:5432/sbire"

    # Tamaño del pool de conexiones asyncpg.
    # min_size: conexiones siempre abiertas (reduce latencia en picos)
    # max_size: límite superior (evita saturar PostgreSQL)
    DB_POOL_MIN_SIZE: int = 5
    DB_POOL_MAX_SIZE: int = 20
    DB_COMMAND_TIMEOUT: int = 30  # segundos antes de cancelar una query

    # ── API ───────────────────────────────────────────────────────────────────
    APP_NAME: str = "SBIRE API"
    APP_VERSION: str = "1.1.0"
    DEBUG: bool = False

    # ── LTI 1.3 ──────────────────────────────────────────────────────────────
    # URL del endpoint JWKS de Moodle para validar los JWT de autenticación
    LTI_JWKS_URL: str 
    LTI_CLIENT_ID: str
    MOODLE_AUTH_URL: str
    REDIRECT_URI: str
    FRONTEND_URL: str
    # ── JWT ───────────────────────────────────────────────────────────────────
    # Clave secreta para firmar tokens de sesión. NUNCA debe estar en git.
    # Generar con: python -c "import secrets; print(secrets.token_urlsafe(32))"
    JWT_SECRET_KEY: str 

    # ── GEMINI API KEY ──────────────────────────────────────────────────────────────
    GEMINI_API_KEY: str 
    
    class Config:
        # Lee automáticamente desde un archivo .env en la raíz del proyecto
        env_file = ".env"
        env_file_encoding = "utf-8"


# Instancia global — se importa desde cualquier módulo con:
#   from app.core.config import settings
settings = Settings()
