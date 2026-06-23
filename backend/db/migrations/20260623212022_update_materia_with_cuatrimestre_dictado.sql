-- migrate:up

-- 1. Agregamos la columna con valor por defecto 0 (Ambos)
ALTER TABLE public.materias 
ADD COLUMN cuatrimestre_dictado INT NOT NULL DEFAULT 0;

-- 2. Agregamos la restricción de seguridad (solo permite 0, 1 o 2)
ALTER TABLE public.materias 
ADD CONSTRAINT check_cuatrimestre_dictado 
CHECK (cuatrimestre_dictado IN (0, 1, 2));


-- migrate:down

-- 1. Eliminamos la columna (esto también elimina el constraint automáticamente)
ALTER TABLE public.materias 
DROP COLUMN IF EXISTS cuatrimestre_dictado;