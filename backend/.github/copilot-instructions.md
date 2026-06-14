# SBIRE — Instrucciones para GitHub Copilot
# Proyecto Travesía · Summit Labs · FI-UNMdP

## Contexto del proyecto

SBIRE (Sistema de Detección Temprana de Deserción Estudiantil) es una API REST en Python/FastAPI que se integra al campus Moodle del Departamento de Ingeniería Industrial de la UNMdP mediante LTI 1.3. El sistema detecta estudiantes en riesgo de abandono universitario, genera alertas y facilita el registro de intervenciones por parte de tutores.

**Stack:**
- Python 3.12 + FastAPI 0.115
- asyncpg (sin ORM — SQL puro)
- PostgreSQL 15
- dbmate (migraciones SQL manuales)
- APScheduler (cron jobs)
- Pydantic v2
- pytest + pytest-asyncio + httpx

---

## Comandos principales (Makefile)

```bash
make setup           # venv + deps + dbmate + DB
make up              # levantar PostgreSQL (Docker)
make migrate         # aplicar migraciones dbmate
make dev             # FastAPI dev server
make new-migration name=create_users
make rollback
make reset-db        # recrea DB (destruye data)
```

```bash
pytest
pytest path/al/test_file.py::test_name
```

---

## Arquitectura — Repository + Service Layer

El proyecto sigue un patrón estricto de cuatro capas. Las dependencias **solo fluyen hacia abajo**. Nunca al revés, nunca saltando capas.

```
Router → Service → Repository → PostgreSQL
           ↑
        (también usado por Jobs/cron)
```

El wiring principal vive en `app/api/main.py`: define el `lifespan` que inicializa y cierra el pool de `asyncpg` (`app/core/database.py`) y registra routers bajo el prefijo `/api/v1`. Los routers obtienen una conexión por request con `app/api/deps.get_conn()` y pasan esa conexión a los services.

### Estructura de directorios

```
app/
├── api/
│   ├── deps.py                    # get_conn() (inyección de asyncpg)
│   └── main.py                    # FastAPI app + lifespan + include_router
├── routers/                       # Un archivo por entidad (e.g. carreras_routes.py)
├── schemas/                       # Pydantic: request/response por entidad
├── services/                      # Lógica de negocio pura
├── repositories/
│   ├── base.py                    # BaseRepository genérico con _map() y _map_many()
│   └── <entidad>_repository.py
├── models/                        # DTOs internos Pydantic (no ORM)
└── core/
    ├── config.py                  # Settings con pydantic-settings
    └── database.py                # Pool asyncpg: init_pool(), close_pool(), get_pool()

db/
└── migrations/                    # SQL manual dbmate (archivos .sql)
```

### Responsabilidades por capa

| Capa | Hace | No hace |
|------|------|---------|
| **Router** | Recibe HTTP, valida con schemas Pydantic, llama al service, devuelve response | Lógica de negocio, SQL |
| **Service** | Reglas de negocio, orquesta repositories, lanza HTTPException | SQL directo, conocer HTTP |
| **Repository** | Queries SQL con asyncpg, convierte Record → modelo | Reglas de negocio, llamadas a red |
| **Model** | Estructura de datos interna (DTO) | Mapeo ORM, lógica |

---

## Convenciones de código

### Nombrado

```python
# Archivos
carrera_repository.py    # snake_case, singular
carrera_service.py
carreras.py              # router: plural

# Clases
class CarreraRepository  # PascalCase
class CarreraService
class CarreraCreate      # schema de entrada
class CarreraUpdate      # schema de PATCH (todos los campos opcionales)
class CarreraResponse    # schema de salida

# Funciones async siempre
async def listar_carreras(...)
async def get_by_id(...)
async def crear(...)

# Endpoints: verbos en español que describen la acción
async def listar_carreras(...)
async def obtener_carrera(...)
async def crear_carrera(...)
async def actualizar_carrera(...)
async def desactivar_carrera(...)
```

### Tipos

```python
# Siempre tipado. Sin Any salvo casos excepcionales documentados.
async def get_by_id(self, id: UUID) -> Carrera | None: ...
async def listar(self, solo_activas: bool = True) -> list[Carrera]: ...

# UUID para todas las PKs y FKs
from uuid import UUID, uuid4

# Timestamps con timezone
from datetime import datetime, date
# En SQL: TIMESTAMPTZ — nunca TIMESTAMP sin zona
```

### Imports — orden estricto

```python
# 1. Stdlib
from uuid import UUID
from datetime import date

# 2. Terceros
import asyncpg
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

# 3. Internos (siempre con prefijo app.)
from app.core.database import get_pool
from app.api.deps import get_conn, get_current_user
from app.models.carrera import Carrera
from app.repositories.carrera_repository import CarreraRepository
from app.services.carrera_service import CarreraService
```

---

## Patrones de implementación

### Router — plantilla

```python
# app/routers/<entidad>_routes.py
router = APIRouter(prefix="/<entidad>s", tags=["<entidad>s"])

@router.get("/", response_model=list[<Entidad>Response])
async def listar_<entidad>s(
    conn: asyncpg.Connection = Depends(get_conn),
) -> list[<Entidad>Response]:
    service = <Entidad>Service(conn)
    items = await service.listar()
    return [<Entidad>Response.model_validate(i) for i in items]
```

### Service — plantilla

```python
# app/services/<entidad>s_service.py
class <Entidad>Service:
    def __init__(self, conn: asyncpg.Connection) -> None:
        self.repo = <Entidad>Repository(conn)

    async def crear(self, nombre: str, ...) -> <Entidad>:
        # 1. Validar reglas de negocio
        existente = await self.repo.get_by_campo_unico(nombre)
        if existente:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya existe un registro con ese valor.",
            )
        # 2. Delegar al repository
        return await self.repo.create(nombre=nombre, ...)

    async def obtener_por_id(self, id: UUID) -> <Entidad>:
        item = await self.repo.get_by_id(id)
        if not item:
            raise HTTPException(status_code=404, detail="No encontrado.")
        return item
```

### Repository — plantilla

```python
# app/repositories/<entidad>_repository.py
class <Entidad>Repository(BaseRepository[<Entidad>]):
    def __init__(self, conn: asyncpg.Connection) -> None:
        super().__init__(conn, <Entidad>)

    async def create(self, campo1: str, campo2: int) -> <Entidad>:
        # Siempre usar RETURNING para evitar SELECT adicional
        # Siempre parámetros posicionales ($1, $2...) — nunca f-strings con valores
        row = await self.conn.fetchrow(
            """
            INSERT INTO <tabla> (id, campo1, campo2)
            VALUES ($1, $2, $3)
            RETURNING *
            """,
            uuid4(), campo1, campo2,
        )
        return self._map(row)  # type: ignore[return-value]
```

### Schema — plantilla

```python
# app/schemas/<entidad>.py
class <Entidad>Create(BaseModel):
    campo: str = Field(..., min_length=1, max_length=200)
    numero: int = Field(..., ge=1, le=100)

class <Entidad>Update(BaseModel):
    # PATCH: todos los campos opcionales
    campo: str | None = Field(None, min_length=1, max_length=200)
    numero: int | None = Field(None, ge=1, le=100)

class <Entidad>Response(BaseModel):
    id: UUID
    campo: str
    numero: int

    class Config:
        from_attributes = True
```

### Model (DTO interno) — plantilla

```python
# app/models/<entidad>.py
class <Entidad>(BaseModel):
    """Representa una fila completa de la tabla `<tabla>`."""
    id: UUID
    campo: str
    numero: int
    activo: bool

    class Config:
        from_attributes = True
```

---

## Reglas de SQL

```sql
-- SIEMPRE: parámetros posicionales, nunca interpolación
await self.conn.fetchrow("SELECT * FROM tabla WHERE id = $1", id)

-- NUNCA: vulnerable a SQL injection
await self.conn.fetchrow(f"SELECT * FROM tabla WHERE id = '{id}'")  # ❌

-- SIEMPRE: RETURNING en INSERT y UPDATE para evitar roundtrip extra
INSERT INTO tabla (id, nombre) VALUES ($1, $2) RETURNING *

-- SIEMPRE: soft delete con activo=FALSE, nunca DELETE físico
UPDATE tabla SET activo = FALSE WHERE id = $1

-- SIEMPRE: TIMESTAMPTZ, nunca TIMESTAMP
creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()

-- SIEMPRE: constraints con nombre explícito
CONSTRAINT pk_tabla PRIMARY KEY (id)
CONSTRAINT fk_tabla_carrera REFERENCES carrera(id) ON DELETE RESTRICT
CONSTRAINT uq_tabla_campo UNIQUE (campo)
CONSTRAINT ck_tabla_rango CHECK (valor >= 0 AND valor <= 1)
```

---

## Dominio — entidades y reglas de negocio

### Etapas de deserción

| Etapa | Criterio | Modelo de detección |
|-------|----------|-------------------|
| `temprana` | Primer año de ingreso | Solo notas de parciales y finales |
| `tardia` | Segundo año en adelante | Notas + encuestas + trayectoria |
| `extendida` | Cursada > duración teórica × factor (default 1.5) | Indicadores de finalización |

### Niveles de riesgo

| Nivel | Score | Acción |
|-------|-------|--------|
| `bajo` | < umbral_amarillo | Sin alerta |
| `medio` | umbral_amarillo ≤ score < umbral_rojo | Alerta informativa |
| `alto` | umbral_rojo ≤ score < 0.8 | Alerta con acción sugerida |
| `critico` | score ≥ 0.8 **o** 3+ aplazos en el mismo final | Alerta urgente |

Los umbrales `umbral_amarillo` y `umbral_rojo` vienen de la tabla `configuracion_indicador`, **nunca** son constantes en el código.

### Reglas críticas de negocio

```
# ALERTAS
- Una alerta NUNCA se cierra automáticamente (DD-06)
- Solo estados 'resuelta' o 'falso_positivo' son cierres válidos
- Si ya hay una alerta 'nueva' o 'en_revision' para el estudiante, no crear otra
- Al insertar una INTERVENCION, la alerta pasa automáticamente a 'intervenida'
  (trigger en BD — no reimplementar en el service)
- La descripción de una intervención es PRIVADA — nunca incluirla en
  responses que pueda ver el estudiante

# SCORES
- Cada cálculo genera NUEVOS registros en score_riesgo — nunca UPDATE (DD-04)
- score_total = SUM(score_riesgo.score × factor_aplicado) por estudiante por día
- El campo 'nivel' en score_riesgo es un snapshot — no recalcular al leer
- El campo 'factores' (JSONB) contiene el desglose para explicabilidad

# USUARIOS / PERMISOS
- docente_tutor: solo ve alertas de sus estudiantes asignados
- admin_departamental: ve toda su carrera, gestiona tutores y docentes_carga
- administrador: acceso total a todas las carreras
- asesor_par: solo ve sus asignados, puede registrar intervenciones,
              NO ve scores ni encuestas
- estudiante: solo ve su propio dashboard, NO ve su score de riesgo

# ENCUESTAS
- Si un estudiante no responde dentro del plazo → alerta de tipo 'omision_encuesta'
- La encuesta de ingreso (modalidad='unica_ingreso') se dispara una sola vez
- Las periódicas se asignan automáticamente al finalizar cada cuatrimestre

# TUTORES
- max_casos_activos en USUARIO limita las alertas activas por tutor (RF-08e)
- Al asignar una alerta a un tutor, verificar que no superó su límite
```

### Roles y permisos en endpoints

```python
# Sin restricción de rol (cualquier autenticado):
Depends(get_current_user)

# Solo admin_departamental o administrador:
Depends(require_admin_departamental)

# Solo administrador global:
Depends(require_admin)

# Verificación contextual en el service (el endpoint recibe el usuario):
if usuario.rol == RolEnum.docente_tutor:
    # filtrar solo sus estudiantes asignados
```

---

## Enums del dominio

```python
# Definidos como Python Enum Y como PostgreSQL TYPE
# Siempre usar el mismo nombre en ambos lados

class EtapaDesercion(str, Enum):
    temprana = "temprana"
    tardia = "tardia"
    extendida = "extendida"

class NivelRiesgo(str, Enum):
    bajo = "bajo"
    medio = "medio"
    alto = "alto"
    critico = "critico"

class OrigenAlerta(str, Enum):
    score_riesgo = "score_riesgo"
    omision_encuesta = "omision_encuesta"

class EstadoAlerta(str, Enum):
    nueva = "nueva"
    en_revision = "en_revision"
    intervenida = "intervenida"
    resuelta = "resuelta"
    falso_positivo = "falso_positivo"

class RolUsuario(str, Enum):
    administrador = "administrador"
    admin_departamental = "admin_departamental"
    docente_carga = "docente_carga"
    docente_tutor = "docente_tutor"
    asesor_par = "asesor_par"
    estudiante = "estudiante"

class TipoIntervencion(str, Enum):
    tutoria_academica = "tutoria_academica"
    entrevista = "entrevista"
    derivacion = "derivacion"
    contacto_familiar = "contacto_familiar"
    seguimiento_virtual = "seguimiento_virtual"
    asesoria_par = "asesoria_par"
    otro = "otro"

class ResultadoIntervencion(str, Enum):
    positivo = "positivo"
    neutro = "neutro"
    negativo = "negativo"
    sin_contacto = "sin_contacto"
```

---

## Tablas del modelo de datos

### Grupos funcionales

| Grupo | Tablas |
|-------|--------|
| Estructura académica | `carrera`, `plan_estudio`, `materia`, `correlativa` |
| Estudiantes | `estudiante`, `inscripcion_cuatrimestre`, `cursada` |
| Notas | `parcial`, `intento_final`, `asistencia` |
| Importación | `importacion_archivo` |
| Encuestas | `encuesta`, `pregunta`, `opcion_respuesta`, `asignacion_encuesta`, `respuesta` |
| Detección | `configuracion_indicador`, `score_riesgo`, `score_total` |
| Alertas e intervención | `alerta`, `entrevista_planificada`, `intervencion`, `usuario` |

### Relaciones clave (para JOIN correctos)

```sql
-- Score total → sus componentes
score_riesgo.score_total_id → score_total.id

-- Alerta → su origen
alerta.score_id        → score_riesgo.id   (cuando origen = 'score_riesgo')
alerta.asignacion_id   → asignacion_encuesta.id (cuando origen = 'omision_encuesta')

-- Entrevista → su resultado
entrevista_planificada.intervencion_id → intervencion.id  (nullable)

-- Usuario → su carrera (para filtros de visibilidad)
usuario.carrera_id → carrera.id
```

---

## Migraciones — flujo de trabajo en equipo

```bash
# Crear nueva migración (vacía — SQL manual)
make new-migration name=create_users

# Aplicar migraciones pendientes
make migrate

# Revertir una migración
make rollback
```

### Reglas obligatorias de migraciones

```
✓ Una migración por feature/PR
✓ Nunca editar una migración ya mergeada a main
✓ Mantener db/schema.sql actualizado al sumar migraciones
✓ SQL manual en db/migrations con marcadores -- migrate:up / -- migrate:down
✗ No usar autogeneración — todo SQL es manual
```

---

## Tests — convenciones

```python
# Estructura de un test de endpoint
@pytest.mark.asyncio
async def test_crear_carrera_duplicado(client: AsyncClient, db_conn):
    # 1. Arrange — estado inicial
    await db_conn.execute("INSERT INTO carrera ...")

    # 2. Act — llamada al endpoint
    response = await client.post("/api/v1/carreras", json={
        "nombre": "Ingeniería Industrial",
        "codigo": "II",
        "duracion_cuatrimestres": 10,
    })

    # 3. Assert — verificar resultado
    assert response.status_code == 409
    assert "código" in response.json()["detail"]
```

```python
# Estructura de un test de service (sin HTTP)
@pytest.mark.asyncio
async def test_desactivar_carrera_con_estudiantes(conn):
    # Usar conexión real o mock según el caso
    service = CarreraService(conn)
    with pytest.raises(HTTPException) as exc:
        await service.desactivar(uuid_con_estudiantes)
    assert exc.value.status_code == 409
```

---

## Cron jobs — patrón

```python
# jobs/deteccion_job.py
# Los jobs usan services directamente — NUNCA hacen requests HTTP internos

async def ejecutar_deteccion():
    async with get_pool().acquire() as conn:
        service = DeteccionService(conn)
        estudiantes = await EstudianteRepository(conn).get_activos()
        for estudiante in estudiantes:
            await service.calcular_para_estudiante(estudiante.id)
```

---

## Lo que Copilot NO debe hacer en este proyecto

```
✗ Usar SQLAlchemy ORM (models, session, relationship, Column)
✗ Usar select(), insert() de SQLAlchemy — solo SQL puro en strings
✗ Escribir lógica de negocio en routers
✗ Escribir queries SQL en services
✗ Usar DELETE físico — siempre soft delete con activo=FALSE
✗ Hardcodear umbrales de riesgo — siempre vienen de configuracion_indicador
✗ Exponer descripcion de intervención en responses del estudiante
✗ Cerrar alertas automáticamente desde el código
✗ Usar TIMESTAMP sin zona — siempre TIMESTAMPTZ
✗ Crear constraints sin nombre explícito en SQL
✗ Usar f-strings con valores de usuario en queries SQL
✗ Importar un repository directamente desde un router
✗ Importar un service desde otro service del mismo nivel
✗ Editar migraciones ya existentes en el historial de git
```

---

## Referencia rápida — archivos de ejemplo

Los siguientes archivos en el repositorio son la referencia canónica del patrón:

| Archivo | Qué ilustra |
|---------|-------------|
| `app/models/carrera.py` | DTO interno sin ORM |
| `app/schemas/carrera.py` | Separación Create / Update / Response |
| `app/repositories/base.py` | BaseRepository con _map() y _map_many() |
| `app/repositories/carrera_repository.py` | UPDATE dinámico, RETURNING, soft delete |
| `app/services/carreras_service.py` | Validaciones de negocio, orquestación |
| `app/routers/carreras_routes.py` | Endpoints REST, Depends, permisos |
| `app/api/deps.py` | get_conn() (conn asyncpg por request) |
| `app/core/database.py` | Pool asyncpg, init/close |
| `app/api/main.py` | Lifespan, CORS, registro de routers |
| `db/migrations/*.sql` | SQL manual dbmate |

Al generar código para una entidad nueva, seguir exactamente la misma estructura que estos archivos cambiando solo los nombres de entidad, tabla y campos.