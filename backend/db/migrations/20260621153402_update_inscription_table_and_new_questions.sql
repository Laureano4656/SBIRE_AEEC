-- migrate:up

-- ==============================================================================
-- 1. MODIFICAR EL ENUM (Eliminar 'libre', 'abandono' / Agregar 'aprobada falta final')
-- ==============================================================================

-- A. Renombramos el ENUM viejo para que no haya conflictos de nombre
ALTER TYPE public.enum_estado_cursada RENAME TO enum_estado_cursada_old;

-- B. Creamos el ENUM nuevo con los valores exactos que necesitas
CREATE TYPE public.enum_estado_cursada AS ENUM (
    'cursando',
    'aprobada',
    'aprobada_falta_final',
    'desaprobada'
);

-- C. Quitamos el valor por defecto temporalmente (si lo tuviera) para evitar bloqueos
ALTER TABLE public.cursadas ALTER COLUMN estado DROP DEFAULT;

-- D. Actualizamos la columna casteando los datos al nuevo ENUM. 
-- Lo que era 'libre' o 'abandono' lo pasamos a 'desaprobada' por seguridad para no perder el dato.
ALTER TABLE public.cursadas ALTER COLUMN estado TYPE public.enum_estado_cursada USING
    CASE 
        WHEN estado::text IN ('libre', 'abandono') THEN 'desaprobada'::public.enum_estado_cursada
        ELSE estado::text::public.enum_estado_cursada
    END;

-- E. Borramos el ENUM viejo de la base de datos
DROP TYPE public.enum_estado_cursada_old;


-- ==============================================================================
-- 2. ELIMINAR TABLA inscripciones_cuatrimestres Y SU RELACIÓN EN cursadas
-- ==============================================================================

-- Eliminamos la columna FK de la tabla cursadas
ALTER TABLE public.cursadas DROP COLUMN IF EXISTS inscripcion_id;

-- Eliminamos la tabla huérfana en cascada
DROP TABLE IF EXISTS public.inscripciones_cuatrimestres CASCADE;


-- ==============================================================================
-- 3. INSERTAR LAS 2 PREGUNTAS ACADÉMICAS CON SUS OPCIONES SÍ/NO
-- ==============================================================================

-- Pregunta 1: Inicio de cuatrimestre
WITH nueva_q1 AS (
    INSERT INTO public.pregunta (indicador_id, carrera_id, texto_pregunta, evento_disparador, tipo_pregunta, configuracion_riesgo, activa)
    VALUES (
        114, NULL, '¿Te inscribiste a {MATERIA} en este cuatrimestre?', 'inicio_cuatrimestre_acad', 'si_no', '{"valor_riesgo_maximo": "no"}', true
    ) RETURNING id
)
INSERT INTO public.opcion_pregunta (pregunta_id, texto_opcion, valor_riesgo_manual, orden_visual)
SELECT id, 'Sí', 0.0, 1 FROM nueva_q1
UNION ALL
SELECT id, 'No', 1.0, 2 FROM nueva_q1;


-- Pregunta 2: Llamado a final
WITH nueva_q2 AS (
    INSERT INTO public.pregunta (indicador_id, carrera_id, texto_pregunta, evento_disparador, tipo_pregunta, configuracion_riesgo, activa)
    VALUES (
        114, NULL, '¿Aprobaste el final de {MATERIA}?', 'llamado_final_acad', 'si_no', '{"valor_riesgo_maximo": "no"}', true
    ) RETURNING id
)
INSERT INTO public.opcion_pregunta (pregunta_id, texto_opcion, valor_riesgo_manual, orden_visual)
SELECT id, 'Sí', 0.0, 1 FROM nueva_q2
UNION ALL
SELECT id, 'No', 1.0, 2 FROM nueva_q2;



-- migrate:down

-- 1. Revertir las preguntas (Las buscamos por su texto para borrarlas junto a sus opciones por el CASCADE)
DELETE FROM public.pregunta WHERE texto_pregunta IN (
    '¿Te inscribiste a {MATERIA} en este cuatrimestre?',
    '¿Aprobaste el final de {MATERIA}?'
);

-- 2. Recrear tabla inscripciones_cuatrimestres y la columna en cursadas
CREATE TABLE public.inscripciones_cuatrimestres (
    id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    estudiante_id int,
    anio int,
    cuatrimestre int,
    materias_anotadas int,
    activo boolean DEFAULT true
);

ALTER TABLE public.cursadas ADD COLUMN inscripcion_id int;

-- 3. Revertir el ENUM a su estado anterior
ALTER TYPE public.enum_estado_cursada RENAME TO enum_estado_cursada_new;

CREATE TYPE public.enum_estado_cursada AS ENUM (
    'cursando',
    'aprobada',
    'desaprobada',
    'libre',
    'abandono'
);

-- Los que hayan quedado en 'aprobada falta final' los volvemos a pasar a 'cursando' preventivamente.
ALTER TABLE public.cursadas ALTER COLUMN estado TYPE public.enum_estado_cursada USING
    CASE 
        WHEN estado::text = 'aprobada falta final' THEN 'cursando'::public.enum_estado_cursada
        ELSE estado::text::public.enum_estado_cursada
    END;

DROP TYPE public.enum_estado_cursada_new;

