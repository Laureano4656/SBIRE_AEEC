-- migrate:up

CREATE TABLE public.evento_disparador (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Asegurate de incluir todos los que tenías en tu ENUM anterior
INSERT INTO public.evento_disparador (nombre) VALUES 
    ('unica_vez'),
    ('cuatrimestral'),
    ('anual'),
    ('inicio_cuatrimestre_acad'),
    ('fin_cuatrimestre_acad'),
    ('llamado_final_acad');


ALTER TABLE public.pregunta ADD COLUMN evento_id INT;
ALTER TABLE public.asignacion_encuesta ADD COLUMN evento_id INT;

-- Vinculamos el texto del viejo ENUM con el ID de la nueva tabla
UPDATE public.pregunta p
SET evento_id = e.id
FROM public.evento_disparador e
WHERE p.evento_disparador::text = e.nombre;

UPDATE public.asignacion_encuesta a
SET evento_id = e.id
FROM public.evento_disparador e
WHERE a.evento_disparador::text = e.nombre;

-- Agregar las Foreign Keys
ALTER TABLE public.pregunta 
    ADD CONSTRAINT fk_pregunta_evento FOREIGN KEY (evento_id) REFERENCES public.evento_disparador(id);

ALTER TABLE public.asignacion_encuesta 
    ADD CONSTRAINT fk_asignacion_evento FOREIGN KEY (evento_id) REFERENCES public.evento_disparador(id);

-- Eliminar las columnas viejas que usaban el ENUM
ALTER TABLE public.pregunta DROP COLUMN evento_disparador;
ALTER TABLE public.asignacion_encuesta DROP COLUMN evento_disparador;

-- Eliminar el tipo ENUM de la base de datos
DROP TYPE IF EXISTS public.enum_evento_disparador;

ALTER TABLE public.asignacion_encuesta 
ADD COLUMN borrador BOOLEAN NOT NULL DEFAULT true;

-- migrate:down

-- 1. Recrear el ENUM
CREATE TYPE public.enum_evento_disparador AS ENUM (
    'inicio_cuatrimestre_acad',
    'fin_cuatrimestre_acad',
    'llamado_final_acad'
);

-- 2. Volver a agregar las columnas viejas
ALTER TABLE public.pregunta ADD COLUMN evento_disparador public.enum_evento_disparador;
ALTER TABLE public.asignacion_encuesta ADD COLUMN evento_disparador public.enum_evento_disparador;

-- 3. Restaurar los datos cruzando a la inversa (del ID al texto)
UPDATE public.pregunta p
SET evento_disparador = e.nombre::public.enum_evento_disparador
FROM public.evento_disparador e
WHERE p.evento_id = e.id;

UPDATE public.asignacion_encuesta a
SET evento_disparador = e.nombre::public.enum_evento_disparador
FROM public.evento_disparador e
WHERE a.evento_id = e.id;

-- 4. Eliminar las Foreign Keys y columnas nuevas
ALTER TABLE public.pregunta DROP COLUMN evento_id;
ALTER TABLE public.asignacion_encuesta DROP COLUMN evento_id;

-- 5. Eliminar la tabla de eventos
DROP TABLE IF EXISTS public.evento_disparador;

ALTER TABLE public.asignacion_encuesta 
DROP COLUMN IF EXISTS borrador;