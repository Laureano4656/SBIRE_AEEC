from fastapi import APIRouter, Depends, FastAPI
from contextlib import asynccontextmanager

from app.api.deps import get_current_user
from app.routers.alertas_routes import router as alertas_router
from app.routers.asignaciones_encuestas_routes import router as asignaciones_encuestas_router
from app.routers.asistencias_routes import router as asistencias_router
from app.routers.carreras_routes import router as carreras_router
from app.routers.correlativas_routes import router as correlativas_router
from app.routers.cursadas_routes import router as cursadas_router
from app.routers.encuestas_routes import router as encuestas_router
from app.routers.inscripciones_cuatrimestres_routes import router as inscripciones_cuatrimestres_router
from app.routers.intentos_finales_routes import router as intentos_finales_router
from app.routers.materias_routes import router as materias_router
from app.routers.opciones_respuesta_routes import router as opciones_respuesta_router
from app.routers.parciales_routes import router as parciales_router
from app.routers.preguntas_routes import router as preguntas_router
from app.routers.respuestas_routes import router as respuestas_router
from app.routers.criterios_routes import router as criterios_router
from app.routers.estudiantes_routes import router as estudiantes_router
from app.routers.importacion_archivo_routes import router as importacion_archivo_router
from app.routers.plan_estudios_routes import router as plan_estudios_router
from app.routers.auth_routes import router as auth_router
from app.routers.dashboard_admin_dep_routes import router as dashboard_admin_dep_router
from app.routers.indicadores_routes import router as indicadores_router
from app.routers.intervenciones_routes import router as intervenciones_router
from app.routers.entrevista_planificada_routes import router as entrevista_planificada_router
from app.routers.semaforo_routes import router as semaforo_router
from app.core.config import settings
from app.core.database import init_pool, close_pool
from fastapi.middleware.cors import CORSMiddleware


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
        "http://localhost:3000",
        "http://127.0.0.1:5501",           # desarrollo frontend
        "http://localhost:8080",           # desarrollo Moodle local
        settings.FRONTEND_URL,             # desarrollo Vite
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


# ── Root redirect ──────────────────────────────────────────────────────────

@app.get("/")
def read_root():
    return {"Hello": "World"}


# ── Registro de routers ───────────────────────────────────────────────────────
# Todos los routers viven bajo /api/v1/ para versionado.
# auth_router se incluye directamente (público).
# El resto se agrupa bajo protected_router con autenticación global.

API_PREFIX = "/api/v1"

app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(dashboard_admin_dep_router, prefix=API_PREFIX)
app.include_router(indicadores_router, prefix=API_PREFIX)
app.include_router(intervenciones_router, prefix=API_PREFIX)
app.include_router(entrevista_planificada_router, prefix=API_PREFIX)
app.include_router(semaforo_router, prefix=API_PREFIX)

###################### TEMPORAL PARA PRUEBAAAA ############################
# protected_router = APIRouter(dependencies=[Depends(get_current_user)])
protected_router = APIRouter()

protected_router.include_router(carreras_router)
protected_router.include_router(materias_router)
protected_router.include_router(correlativas_router)
protected_router.include_router(inscripciones_cuatrimestres_router)
protected_router.include_router(cursadas_router)
protected_router.include_router(parciales_router)
protected_router.include_router(intentos_finales_router)
protected_router.include_router(asistencias_router)
protected_router.include_router(encuestas_router)
protected_router.include_router(preguntas_router)
protected_router.include_router(opciones_respuesta_router)
protected_router.include_router(asignaciones_encuestas_router)
protected_router.include_router(respuestas_router)
protected_router.include_router(plan_estudios_router)
protected_router.include_router(estudiantes_router)
protected_router.include_router(importacion_archivo_router)
protected_router.include_router(criterios_router)
protected_router.include_router(alertas_router)

app.include_router(protected_router, prefix=API_PREFIX)


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
