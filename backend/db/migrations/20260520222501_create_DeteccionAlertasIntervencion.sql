-- migrate:up
-- =============================================================================
-- 1. TIPOS ENUM
-- =============================================================================
-- Los enums se definen como tipos propios de PostgreSQL.
-- Ventajas sobre VARCHAR con CHECK: validación en BD, mejor legibilidad en
-- queries, autocompletado en herramientas como DBeaver o pgAdmin.
--
-- Convención de nombres: <entidad>_<campo>_enum
-- Esto evita colisiones cuando dos entidades usan "estado" con valores distintos.
-- =============================================================================
CREATE TYPE rol_usuario_enum AS ENUM (
    'administrador',
    'admin_departamental',
    'docente_carga',
    'docente_tutor',
    'asesor_par',
    'estudiante'
);
-- ── Etapa de deserción del estudiante ────────────────────────────────────────
CREATE TYPE etapa_desercion_enum AS ENUM (
    'temprana',   -- Primer año de ingreso
    'tardia',     -- Segundo año en adelante
    'extendida'   -- Supera la duración teórica × factor configurable
);

-- ── Nivel de riesgo calculado ─────────────────────────────────────────────────
CREATE TYPE nivel_riesgo_enum AS ENUM (
    'bajo',       -- Score < umbral_amarillo
    'medio',      -- Score entre umbral_amarillo y umbral_rojo
    'alto',       -- Score entre umbral_rojo y 0.8
    'critico'     -- Score > 0.8 o 3+ aplazos en el mismo final (RF-03a)
);

-- ── Origen de la alerta ───────────────────────────────────────────────────────
CREATE TYPE origen_alerta_enum AS ENUM (
    'score_riesgo',      -- Generada por el motor de detección (RF-04a)
    'omision_encuesta'   -- Generada por no responder una encuesta (RF-04b)
);

-- ── Ciclo de vida de la alerta ────────────────────────────────────────────────
CREATE TYPE estado_alerta_enum AS ENUM (
    'nueva',          -- Generada automáticamente, sin revisar
    'en_revision',    -- Un tutor la tomó y está evaluando
    'intervenida',    -- Se registró al menos una intervención
    'resuelta',       -- Situación superada, cierre manual del tutor
    'falso_positivo'  -- El tutor determinó que no hay riesgo real
);




-- ── Tipo de intervención ─────────────────────────────────────────────────────
CREATE TYPE tipo_intervencion_enum AS ENUM (
    'tutoria_academica',
    'entrevista',
    'derivacion',
    'contacto_familiar',
    'seguimiento_virtual',
    'asesoria_par',
    'otro'
);

-- ── Resultado de una intervención ────────────────────────────────────────────
CREATE TYPE resultado_intervencion_enum AS ENUM (
    'positivo',      -- El estudiante respondió favorablemente
    'neutro',        -- Sin cambio observable aún
    'negativo',      -- No hubo respuesta o empeoró
    'sin_contacto'   -- No se pudo contactar al estudiante
);

-- ── Estado de una entrevista planificada ─────────────────────────────────────
CREATE TYPE estado_entrevista_enum AS ENUM (
    'pendiente',   -- Agendada, aún no realizada
    'realizada',   -- Ocurrió — se vincula a una INTERVENCION
    'cancelada'    -- Fue cancelada sin realizarse
);

-- ── Modalidad de entrevista ───────────────────────────────────────────────────
CREATE TYPE modalidad_entrevista_enum AS ENUM (
    'presencial',
    'virtual'
);

-- =============================================================================
-- 6. USUARIO
-- =============================================================================
-- Actores del sistema con acceso autenticado via LTI 1.3.
-- Se sincroniza desde Moodle: moodle_id es la clave de upsert.
-- El rol determina qué puede ver y hacer en el sistema.
-- =============================================================================

CREATE TABLE usuarios (
    id                      int            primary key generated always as identity NOT NULL ,
    carrera_id              int,  -- NULL para administradores globales

    nombre                  VARCHAR(200)    NOT NULL,
    apellido                VARCHAR(200)    NOT NULL,
    email                   VARCHAR(320)    NOT NULL,

    -- ID interno de Moodle — clave de sincronización (SA-06).
    -- Nunca cambia aunque el email o username cambien en Moodle.
    moodle_id               VARCHAR(100)    NOT NULL,

    rol                     rol_usuario_enum NOT NULL,

    -- Límite de alertas activas simultáneas para tutores (RF-08e).
    -- NULL = sin límite (aplica a coordinadores y admins).
    max_casos_activos       SMALLINT,

    activo                  BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en               TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    actualizado_en          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    
    CONSTRAINT uq_usuario_email
        UNIQUE (email),

    CONSTRAINT uq_usuario_moodle_id
        UNIQUE (moodle_id),

    CONSTRAINT ck_usuario_max_casos
        CHECK (max_casos_activos IS NULL OR max_casos_activos > 0),

    CONSTRAINT ck_usuario_email_formato
        CHECK (email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'),

    CONSTRAINT fk_usuario_carrera
        foreign key(carrera_id) REFERENCES carreras (id)
        ON DELETE SET NULL
);

-- =============================================================================
-- 2. CONFIGURACION_INDICADOR
-- =============================================================================
-- Almacena los umbrales del semáforo por etapa y carrera.
-- Son editables por el Administrador desde el panel — nunca hardcodeados
-- en el código (DD-05 del documento de diseño).
--
-- El motor de detección consulta esta tabla en cada ejecución del cron.
-- =============================================================================

CREATE TABLE configuracion_indicador (
    id int primary key generated always as identity not null,
    carrera_id          int         NOT NULL,
    etapa               etapa_desercion_enum NOT NULL,

    -- Umbrales del semáforo (valores de score entre 0.0 y 1.0)
    -- verde:    score < umbral_amarillo   → nivel bajo
    -- amarillo: umbral_amarillo ≤ score < umbral_rojo → nivel medio
    -- rojo:     score ≥ umbral_rojo       → nivel alto o crítico
    umbral_amarillo     FLOAT       NOT NULL DEFAULT 0.30,
    umbral_rojo         FLOAT       NOT NULL DEFAULT 0.60,

    -- Factor que determina cuándo una carrera se clasifica como "extendida".
    -- Extendida = cuatrimestres_cursados > duracion_teorica × factor_extension
    -- Solo aplica a etapa = 'extendida'. Para las otras etapas se ignora.
    factor_extension    FLOAT       NOT NULL DEFAULT 1.5,

    descripcion         TEXT,
    activo              BOOLEAN     NOT NULL DEFAULT TRUE,
    actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_por     int,  -- FK a usuario (nullable: puede ser sistema)

    -- Una sola configuración activa por carrera y etapa
    CONSTRAINT uq_configuracion_carrera_etapa
        UNIQUE (carrera_id, etapa),

    -- Los umbrales deben estar en orden ascendente y dentro de [0, 1]
    CONSTRAINT ck_umbrales_rango
        CHECK (
            umbral_amarillo >= 0.0 AND
            umbral_amarillo < umbral_rojo AND
            umbral_rojo <= 1.0
        ),

    CONSTRAINT ck_factor_extension_positivo
        CHECK (factor_extension > 0.0),

    -- FK a carrera (definida en otro módulo — se asume que la tabla existe)
    CONSTRAINT fk_configuracion_carrera
        foreign KEY(carrera_id) REFERENCES carreras(id)
        ON DELETE RESTRICT,  -- No eliminar carrera si tiene configuración

    -- FK a usuario (nullable: las configuraciones del sistema no tienen responsable)
    CONSTRAINT fk_configuracion_actualizado_por
       foreign key (actualizado_por) REFERENCES usuarios (id)
        ON DELETE SET NULL
);


-- =============================================================================
-- 3. SCORE_RIESGO
-- =============================================================================
-- Registro inmutable del score calculado para un estudiante en una etapa.
-- Cada ejecución del cron genera NUEVOS registros — nunca se sobreescribe
-- (DD-04: serie temporal para visualizar evolución del riesgo).
--
-- Un estudiante puede tener hasta 3 registros por día (uno por etapa).
-- La etapa activa del estudiante determina cuál score es el relevante.
-- =============================================================================

CREATE TABLE score_riesgo (
    id                  int        	primary key generated always as identity not null,
    estudiante_id       int			NOT NULL,
    configuracion_id    int        	not null,

    -- Score numérico continuo entre 0.0 (sin riesgo) y 1.0 (abandono inminente)
    score               FLOAT       NOT NULL,

    -- Nivel derivado del score según los umbrales de configuracion_indicador.
    -- Se persiste como snapshot: si los umbrales cambian, el nivel histórico
    -- conserva el valor con el que fue calculado originalmente.
    nivel               nivel_riesgo_enum NOT NULL,

    calculado_en        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Desglose de las variables que componen el score.
    -- Ejemplo: {"aplazos_mismo_final": 3, "promedio_parciales": 3.1,
    --           "asistencia_pct": 0.48, "peso_dominante": "aplazos_mismo_final"}
    -- Permite explicar la alerta al tutor sin recalcular (RF-03).
    -- factores            JSONB       NOT NULL DEFAULT '{}',

    -- Vínculo con score_total (relación discutida: FK directa con snapshot)
    -- NULL mientras no se haya calculado el score total del día
    score_total_id      int			default NULL,
    factor_aplicado     FLOAT       NOT NULL DEFAULT 1.0,
    score_ponderado     FLOAT       NOT NULL DEFAULT 0.0,

    -- PK
   
    CONSTRAINT ck_score_riesgo_rango
        CHECK (score >= 0.0 AND score <= 1.0),

    CONSTRAINT ck_factor_aplicado_positivo
        CHECK (factor_aplicado > 0.0),

    CONSTRAINT ck_score_ponderado_rango
        CHECK (score_ponderado >= 0.0 AND score_ponderado <= 1.0),

    CONSTRAINT fk_score_riesgo_estudiante
        foreign key (estudiante_id) REFERENCES estudiantes (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_score_riesgo_configuracion
        foreign key (configuracion_id) REFERENCES configuracion_indicador (id)
        ON DELETE RESTRICT

    -- NOTA: la FK a score_total se agrega mediante ALTER TABLE después
    -- de que score_total es creada (ver sección 4). No se define inline
    -- para evitar la dependencia circular entre ambas tablas.
);


-- =============================================================================
-- 4. SCORE_TOTAL
-- =============================================================================
-- Suma ponderada de los score_riesgo de un estudiante en un momento dado.
-- Un registro por estudiante por ejecución del cron (una vez por día).
-- Los score_riesgo que lo componen se vinculan via score_riesgo.score_total_id.
-- =============================================================================

CREATE TABLE score_total (
    id                  int        	primary key generated always as identity not null,
    estudiante_id       int        NOT NULL,

    -- Resultado de: SUM(score_riesgo.score × factor_aplicado)
    -- Este valor es el que determina el semáforo final del estudiante.
    valor               FLOAT       NOT NULL,

    creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    

    CONSTRAINT ck_score_total_rango
        CHECK (valor >= 0.0 AND valor <= 1.0),

    CONSTRAINT fk_score_total_estudiante
        foreign key(estudiante_id) REFERENCES estudiantes (id)
        ON DELETE RESTRICT
);

-- Ahora que score_total existe, se puede agregar la FK de score_riesgo.
-- Se usa ADD CONSTRAINT en lugar de haberla definido inline para evitar
-- la dependencia circular entre las dos tablas durante la creación.
ALTER TABLE score_riesgo
    ADD CONSTRAINT fk_score_riesgo_score_total
        FOREIGN KEY (score_total_id)
        REFERENCES score_total (id)
        ON DELETE SET NULL;


-- =============================================================================
-- 5. ALERTA
-- =============================================================================
-- Registro de una situación de riesgo detectada sobre un estudiante.
-- Puede originarse por score (motor de detección) o por omisión de encuesta.
--
-- Ciclo de vida gestionado siempre por el tutor — nunca se cierra
-- automáticamente aunque el score mejore (DD-06).
-- =============================================================================

CREATE TABLE alertas (
    id                  int        	primary key generated always as identity not null,
    estudiante_id       int        NOT NULL,

    -- Origen del score que disparó esta alerta.
    -- NULL si origen = 'omision_encuesta' (no hay score asociado).
    score_id            int,

    -- Asignación de encuesta que no fue completada.
    -- NULL si origen = 'score_riesgo'.
    asignacion_id       int,

    tipo_desercion      etapa_desercion_enum  NOT NULL,

    -- Snapshot del nivel al momento de generarse la alerta.
    -- No cambia aunque el score posterior mejore — preserva el historial (DD-04).
    nivel_riesgo        nivel_riesgo_enum     NOT NULL,

    origen              origen_alerta_enum    NOT NULL,
    estado              estado_alerta_enum    NOT NULL DEFAULT 'nueva',

    -- Año académico del estudiante cuando se generó la alerta.
    -- Desnormalizado aquí para soportar el filtro de RF-04f sin joins adicionales.
    anio_cursada        SMALLINT    NOT NULL,

    generada_en         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Momento en que el tutor marcó la alerta como resuelta o falso_positivo.
    -- NULL mientras la alerta esté abierta.
    fecha_cierre        TIMESTAMPTZ,


    -- Garantiza coherencia: si el origen es score_riesgo, debe haber score_id.
    -- Si el origen es omision_encuesta, debe haber asignacion_id.
    CONSTRAINT ck_alerta_origen_score
        CHECK (
            origen != 'score_riesgo' OR score_id IS NOT NULL
        ),
    CONSTRAINT ck_alerta_origen_encuesta
        CHECK (
            origen != 'omision_encuesta' OR asignacion_id IS NOT NULL
        ),

    -- La fecha de cierre solo puede existir en estados de cierre
    CONSTRAINT ck_alerta_cierre_consistente
        CHECK (
            fecha_cierre IS NULL OR
            estado IN ('resuelta', 'falso_positivo')
        ),

    CONSTRAINT ck_alerta_anio_cursada
        CHECK (anio_cursada >= 1),

    CONSTRAINT fk_alerta_estudiante
       foreign key(estudiante_id) REFERENCES estudiantes (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_alerta_score
     foreign key(score_id) REFERENCES score_riesgo (id)
        ON DELETE SET NULL,

    CONSTRAINT fk_alerta_asignacion
        foreign key(asignacion_id) REFERENCES asignacion_encuestas (id)
        ON DELETE SET NULL
);



-- Trigger para actualizar automáticamente actualizado_en
CREATE OR REPLACE FUNCTION set_actualizado_en()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_usuario_actualizado_en
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION set_actualizado_en();

-- =============================================================================
-- 8. INTERVENCION
-- =============================================================================
-- Registro de una acción concreta realizada sobre un estudiante en riesgo.
-- Una alerta puede acumular N intervenciones a lo largo del tiempo (RF-05c).
-- El campo descripcion es privado — nunca visible para el estudiante (RF-05d).
-- =============================================================================

CREATE TABLE intervenciones (
    id                  int        	primary key generated always as identity not null,
    alerta_id           int        NOT NULL,
    tutor_id            int        NOT NULL,

    tipo                tipo_intervencion_enum       NOT NULL,
    resultado           resultado_intervencion_enum  NOT NULL,

    -- Fecha en que ocurrió la intervención (puede diferir de creado_en
    -- si el tutor la registra con retraso).
    fecha               DATE        NOT NULL,

    -- Texto libre con el detalle de lo ocurrido.
    -- PRIVADO: solo accesible para tutores y coordinadores de la misma carrera.
    descripcion         TEXT,

    creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- La fecha de la intervención no puede ser futura
    CONSTRAINT ck_intervencion_fecha_no_futura
        CHECK (fecha <= CURRENT_DATE),

    CONSTRAINT fk_intervencion_alerta
       foreign key(alerta_id) REFERENCES alertas (id)
        ON DELETE RESTRICT,  -- No eliminar alerta si tiene intervenciones

    CONSTRAINT fk_intervencion_tutor
        foreign key(tutor_id) REFERENCES usuarios (id)
        ON DELETE RESTRICT
);

-- =============================================================================
-- 7. ENTREVISTA_PLANIFICADA
-- =============================================================================
-- Registro de una entrevista agendada ANTES de que ocurra.
-- Separada de INTERVENCION para cubrir el requerimiento de planificación
-- proactiva (RF-05a). Una entrevista planificada puede no llegar a realizarse.
--
-- Cuando se realiza, el tutor la vincula a un registro de INTERVENCION
-- mediante intervencion_id (FK opcional que se completa a posteriori).
-- =============================================================================

CREATE TABLE entrevista_planificada (
    id                  int        	primary key generated always as identity not null,
    alerta_id           int        NOT NULL,
    tutor_id            int        NOT NULL,
    estudiante_id       int        NOT NULL,

    fecha_propuesta     TIMESTAMPTZ NOT NULL,
    modalidad           modalidad_entrevista_enum NOT NULL,

    -- Notas previas: contexto que el tutor quiere tener en cuenta.
    -- Campo libre, solo visible para tutores y coordinadores.
    notas_previas       TEXT,

    estado              estado_entrevista_enum NOT NULL DEFAULT 'pendiente',

    -- Se completa cuando la entrevista se realiza y se registra como intervención.
    -- NULL mientras la entrevista no haya ocurrido o haya sido cancelada.
    intervencion_id     int,

    creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Si el estado es 'realizada', debe haber una intervención vinculada
    CONSTRAINT ck_entrevista_realizada_tiene_intervencion
        CHECK (
            estado != 'realizada' OR intervencion_id IS NOT NULL
        ),

    CONSTRAINT fk_entrevista_alerta
      foreign key(alerta_id)  REFERENCES alertas (id)
        ON DELETE CASCADE,  -- Si se elimina la alerta, se eliminan sus entrevistas

    CONSTRAINT fk_entrevista_tutor
        foreign key(tutor_id) REFERENCES usuarios (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_entrevista_estudiante
        foreign key(estudiante_id) REFERENCES estudiantes (id)
        ON DELETE RESTRICT,

    -- FK a intervencion (nullable — se vincula cuando la entrevista se realiza)
    CONSTRAINT fk_entrevista_intervencion
       foreign key(intervencion_id) REFERENCES intervenciones (id)
        ON DELETE SET NULL
);



-- Trigger: cuando se inserta una intervención, actualiza el estado de la alerta
-- a 'intervenida' si estaba en 'nueva' o 'en_revision'.
CREATE OR REPLACE FUNCTION actualizar_estado_alerta_en_intervencion()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE alerta
    SET estado = 'intervenida'
    WHERE id = NEW.alerta_id
      AND estado IN ('nueva', 'en_revision');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_intervencion_actualiza_alerta
    AFTER INSERT ON intervenciones
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_estado_alerta_en_intervencion();


-- =============================================================================
-- 9. ÍNDICES
-- =============================================================================
-- Solo se indexan las columnas que aparecen frecuentemente en WHERE, JOIN
-- u ORDER BY. Demasiados índices degradan el rendimiento de INSERT/UPDATE.
-- =============================================================================

-- ── configuracion_indicador ───────────────────────────────────────────────────
-- El motor de detección busca la configuración activa por carrera y etapa
-- en cada ejecución del cron.
CREATE INDEX idx_config_indicador_carrera_etapa
    ON configuracion_indicador (carrera_id, etapa)
    WHERE activo = TRUE;


-- ── score_riesgo ──────────────────────────────────────────────────────────────
-- Query más frecuente: últimos N scores de un estudiante ordenados por fecha.
CREATE INDEX idx_score_riesgo_estudiante_fecha
    ON score_riesgo (estudiante_id, calculado_en DESC);

-- Filtro por nivel para el dashboard (¿cuántos estudiantes están en crítico?)
CREATE INDEX idx_score_riesgo_nivel
    ON score_riesgo (nivel, calculado_en DESC);

-- Búsqueda de scores sin score_total asignado (para el job de cálculo)
CREATE INDEX idx_score_riesgo_sin_total
    ON score_riesgo (estudiante_id)
    WHERE score_total_id IS NULL;


-- ── score_total ───────────────────────────────────────────────────────────────
-- Evolución temporal del score total de un estudiante (dashboard individual).
CREATE INDEX idx_score_total_estudiante_fecha
    ON score_total (estudiante_id, creado_en DESC);


-- ── alerta ────────────────────────────────────────────────────────────────────
-- Panel de alertas: filtro por estado (tutores ven solo las abiertas).
CREATE INDEX idx_alerta_estudiante_estado
    ON alertas (estudiante_id, estado);

-- Filtro del dashboard institucional: alertas por año y tipo (RF-04f).
CREATE INDEX idx_alerta_anio_tipo
    ON alertas (anio_cursada, tipo_desercion, estado);

-- Filtro de nivel para alertas críticas.
CREATE INDEX idx_alerta_nivel_estado
    ON alertas (nivel_riesgo, estado)
    WHERE estado IN ('nueva', 'en_revision');


-- ── usuario ───────────────────────────────────────────────────────────────────
-- Sincronización Moodle: lookup por moodle_id en cada request LTI.
CREATE INDEX idx_usuario_moodle_id
    ON usuarios (moodle_id);

-- Filtro por rol y carrera (ej. "todos los tutores de Ingeniería Industrial").
CREATE INDEX idx_usuario_rol_carrera
    ON usuarios (rol, carrera_id)
    WHERE activo = TRUE;


-- ── intervencion ──────────────────────────────────────────────────────────────
-- Historial de intervenciones de una alerta.
CREATE INDEX idx_intervencion_alerta
    ON intervenciones (alerta_id, fecha DESC);

-- Intervenciones por tutor (panel de actividad del tutor).
CREATE INDEX idx_intervencion_tutor_fecha
    ON intervenciones (tutor_id, fecha DESC);


-- ── entrevista_planificada ────────────────────────────────────────────────────
-- Próximas entrevistas pendientes de un tutor.
CREATE INDEX idx_entrevista_tutor_pendiente
    ON entrevista_planificada (tutor_id, fecha_propuesta)
    WHERE estado = 'pendiente';




-- migrate:down

