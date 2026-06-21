-- migrate:up

DROP TABLE IF EXISTS public.respuesta;
DROP TABLE IF EXISTS public.asignacion_encuestas;
DROP TABLE IF EXISTS public.opcion_respuesta;
DROP TABLE IF EXISTS public.preguntas;
DROP TABLE IF EXISTS public.encuestas;

DROP TYPE IF EXISTS public.enum_modalidad_encuesta;

-- migrate:down

