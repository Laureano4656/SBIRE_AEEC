-- migrate:up
ALTER TABLE entrevista_planificada
ADD COLUMN comentario text;

-- migrate:down
ALTER TABLE entrevista_planificada
DROP COLUMN comentario;
