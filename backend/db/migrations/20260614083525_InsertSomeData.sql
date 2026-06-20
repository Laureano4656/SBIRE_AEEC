-- migrate:up
DO $$
DECLARE
    carrera_id int;
BEGIN
INSERT INTO carreras (nombre,codigo,duracion_cuatrimestre,activo) VALUES ('Ingenieria Industrial', '1', 4, true) returning id into carrera_id;
INSERT INTO carreras (nombre,codigo,duracion_cuatrimestre,activo) VALUES ('Ingenieria Informatica', 'B2', 4, true) returning id into carrera_id;

INSERT INTO plan_estudios (carrera_id,nombre,anio_vigencia,activo) VALUES (carrera_id, 'Plan 2008', 2008, true);
END $$;
-- migrate:down