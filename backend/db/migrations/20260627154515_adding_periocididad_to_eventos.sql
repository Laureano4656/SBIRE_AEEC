-- migrate:up

ALTER TABLE evento_disparador ADD COLUMN periodicidad public.enum_periodicidad DEFAULT 'unica_vez';

ALTER TYPE public.origen_alerta_enum ADD VALUE IF NOT EXISTS 'carrera_extendida';

-- migrate:down

ALTER TABLE evento_disparador DROP COLUMN IF EXISTS periodicidad;