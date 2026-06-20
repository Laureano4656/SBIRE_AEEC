-- migrate:up

ALTER TABLE public.alertas DROP CONSTRAINT IF EXISTS fk_alerta_asignacion;

CREATE TYPE public.enum_periodicidad AS ENUM (
    'unica_vez', 
    'cuatrimestral', 
    'anual', 
    'inicio_cuatrimestre_acad', 
    'fin_cuatrimestre_acad', 
    'llamado_final_acad'
);

CREATE TABLE public.pregunta (
    id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    indicador_id int REFERENCES public.indicador(id),
    carrera_id int REFERENCES public.carreras(id), 
    texto_pregunta text NOT NULL,
    evento_disparador public.enum_periodicidad NOT NULL,
    tipo_pregunta public.enum_tipo_pregunta NOT NULL, 
    configuracion_riesgo jsonb, 
    activa boolean DEFAULT true
);

CREATE TABLE public.opcion_pregunta (
    id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    pregunta_id int REFERENCES public.pregunta(id),
    texto_opcion varchar(255) NOT NULL,
    valor_riesgo_manual decimal(3,2) CHECK (valor_riesgo_manual >= 0 AND valor_riesgo_manual <= 1),
    orden_visual int DEFAULT 0
);

CREATE TABLE public.asignacion_encuesta (
    id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    estudiante_id int REFERENCES public.estudiantes(id) NOT NULL, 
    evento_disparador public.enum_periodicidad NOT NULL,
    periodo_lectivo varchar(50) NOT NULL,
    completado boolean DEFAULT false,
    fecha_asignacion timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.respuesta_estudiante (
    id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    asignacion_id int REFERENCES public.asignacion_encuesta(id),
    pregunta_id int REFERENCES public.pregunta(id),
    -- Reemplazar con referencia real si existe la tabla materias, ej: REFERENCES public.materias(id)
    materia_id int REFERENCES public.materias(id), 
    opcion_seleccionada_id int REFERENCES public.opcion_pregunta(id),
    valor_numerico decimal(10,2),
    valor_texto text,
    riesgo_calculado decimal(3,2) CHECK (riesgo_calculado >= 0 AND riesgo_calculado <= 1)
);

ALTER TABLE public.alertas 
    ADD CONSTRAINT fk_alerta_asignacion 
    FOREIGN KEY (asignacion_id) REFERENCES public.asignacion_encuesta(id);

-- migrate:down

ALTER TABLE public.alertas DROP CONSTRAINT IF EXISTS fk_alerta_asignacion;

DROP TABLE IF EXISTS public.respuesta;
DROP TABLE IF EXISTS public.asignacion_encuestas;
DROP TABLE IF EXISTS public.opcion_respuesta;
DROP TABLE IF EXISTS public.preguntas;
DROP TABLE IF EXISTS public.encuestas;

DROP TYPE IF EXISTS public.enum_modalidad_encuesta;