from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.routers.carreras_routes import router as carreras_router
from app.routers.estudiantes_routes import router as estudiantes_router
from app.routers.plan_estudios_routes import router as plan_estudios_router
from app.routers.auth_routes import router as auth_router
from app.core.config import settings
from app.core.database import init_pool, close_pool #, get_pool
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(carreras_router)
app.include_router(plan_estudios_router)
app.include_router(estudiantes_router)


@app.get("/")
def read_root():
    return {"Hello": "World"}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── STARTUP ───────────────────────────────────────────────────────────────
    print(f"🚀 Iniciando {settings.APP_NAME} v{settings.APP_VERSION}...")

    # Inicializar el pool de conexiones asyncpg.
    # Esto establece las conexiones mínimas (DB_POOL_MIN_SIZE) a PostgreSQL
    # antes de recibir el primer request.
    await init_pool()
    print(f" Pool de conexiones inicializado (min={settings.DB_POOL_MIN_SIZE}, max={settings.DB_POOL_MAX_SIZE})")

    # TODO: inicializar el scheduler de APScheduler para los cron jobs
    # from app.jobs.scheduler import start_scheduler
    # await start_scheduler()

    yield  # La app corre aquí

    # ── SHUTDOWN ──────────────────────────────────────────────────────────────
    # Se ejecuta cuando la app recibe SIGTERM (ej. en un deploy o Ctrl+C).
    # Espera a que las conexiones activas terminen antes de cerrar el pool.
    print("⏹  Cerrando pool de conexiones...")
    await close_pool()
    print("👋 Aplicación cerrada correctamente.")


# ── Instancia de FastAPI ──────────────────────────────────────────────────────

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "API REST del Sistema de Detección Temprana de Deserción Estudiantil. "
        "Integrado con Moodle via LTI 1.3."
    ),
    # En producción, deshabilitar la documentación pública:
    # docs_url=None if not settings.DEBUG else "/docs",
    # redoc_url=None if not settings.DEBUG else "/redoc",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)


# ── CORS ──────────────────────────────────────────────────────────────────────
# Necesario para que el iframe de Moodle pueda hacer requests a la API.
# En producción, reemplazar "*" con la URL exacta del campus Moodle.

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://campus.fi.mdp.edu.ar",  # producción
        "http://localhost:3000",           # desarrollo frontend
        "http://localhost:8080",           # desarrollo Moodle local
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


# ── Registro de routers ───────────────────────────────────────────────────────
# Todos los routers viven bajo /api/v1/ para versionado.
# Si en el futuro se necesita una v2 con breaking changes,
# se agrega un nuevo prefijo sin afectar a los clientes de v1.

API_PREFIX = "/api/v1"

app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(carreras_router, prefix=API_PREFIX)
app.include_router(plan_estudios_router, prefix=API_PREFIX)
app.include_router(estudiantes_router, prefix=API_PREFIX)

# Al agregar nuevas entidades:
# app.include_router(estudiantes_router, prefix=API_PREFIX)
# app.include_router(alertas_router, prefix=API_PREFIX)
# app.include_router(encuestas_router, prefix=API_PREFIX)
# app.include_router(scores_router, prefix=API_PREFIX)
# app.include_router(intervenciones_router, prefix=API_PREFIX)


# ── Health check ──────────────────────────────────────────────────────────────
# Endpoint mínimo para que el servidor de producción (nginx, Docker)
# verifique que la app está viva. No requiere autenticación.

@app.get("/health", tags=["Sistema"], include_in_schema=False)
async def health_check() -> dict: # type: ignore[return-value]
    return { # type: ignore[return-value]
        "status": "ok",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }
