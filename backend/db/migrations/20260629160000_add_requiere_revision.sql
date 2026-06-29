-- migrate:up

ALTER TABLE public.respuesta_estudiante
ADD COLUMN requiere_revision boolean DEFAULT false;

-- migrate:down