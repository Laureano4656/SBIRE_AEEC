-- migrate:up

DO $$
DECLARE
    carrera_id1 int;
    carrera_id2 int;
    carrera_id3 int;
    carrera_id4 int;
    carrera_id5 int;
    carrera_id6 int;
    carrera_id7 int;
    carrera_id8 int;
    carrera_id9 int;
    
BEGIN
    UPDATE plan_estudios SET activo= false WHERE anio_vigencia = 2008;
    SELECT id INTO carrera_id1 FROM carreras WHERE nombre = 'Ingenieria Informatica';
    SELECT id INTO carrera_id2 FROM carreras WHERE nombre = 'Ingenieria Quimica';
    SELECT id INTO carrera_id3 FROM carreras WHERE nombre = 'Ingenieria Electronica';
    SELECT id INTO carrera_id4 FROM carreras WHERE nombre = 'Ingenieria en Alimentos';
    SELECT id INTO carrera_id5 FROM carreras WHERE nombre = 'Ingenieria en Computacion';
    SELECT id INTO carrera_id6 FROM carreras WHERE nombre = 'Ingenieria en Materiales';
    SELECT id INTO carrera_id7 FROM carreras WHERE nombre = 'Ingenieria Electrica';
    SELECT id INTO carrera_id8 FROM carreras WHERE nombre = 'Ingenieria Mecanica';
    SELECT id INTO carrera_id9 FROM carreras WHERE nombre = 'Ingenieria Electromecanica';
    

    INSERT INTO plan_estudios (carrera_id,nombre,anio_vigencia,activo) 
    VALUES 
    (carrera_id1, 'Plan 2024', 2024, true),
    (carrera_id2, 'Plan 2024', 2024, true),
    (carrera_id3, 'Plan 2024', 2024, true),
    (carrera_id4, 'Plan 2024', 2024, true),
    (carrera_id5, 'Plan 2024', 2024, true),
    (carrera_id6, 'Plan 2024', 2024, true),
    (carrera_id7, 'Plan 2024', 2024, true),
    (carrera_id8, 'Plan 2024', 2024, true),
    (carrera_id9, 'Plan 2024', 2024, true);
END $$;
    
-- migrate:down

