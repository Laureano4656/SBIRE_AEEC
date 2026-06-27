-- migrate:up

ALTER TABLE estudiantes ALTER COLUMN activo SET DEFAULT true;

-- migrate:down