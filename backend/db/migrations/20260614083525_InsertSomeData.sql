-- migrate:up


INSERT INTO carreras (nombre,codigo,duracion_cuatrimestre,activo) VALUES ('Ingenieria Industrial', '1', 4, true);
INSERT INTO carreras (nombre,codigo,duracion_cuatrimestre,activo) VALUES ('Ingenieria Informatica', 'B2', 4, true);

INSERT INTO plan_estudios (carrera_id,nombre,anio_vigencia,activo) VALUES (4, 'Plan 2008', 2008, true);

INSERT INTO estudiantes (carrera_id,nombre,apellido,email,legajo,dni,anio_ingreso,etapa,porcentaje_carrera,activo,moodle_id) VALUES ( 4, 'Penso', 'Sorren', NULL, '1900', '1234567', 2020, 'temprana', 40, true, NULL);
INSERT INTO estudiantes (carrera_id,nombre,apellido,email,legajo,dni,anio_ingreso,etapa,porcentaje_carrera,activo,moodle_id) VALUES ( 5, 'Agustin', 'Proia', NULL, '1768', '4585818', 2023, 'media', 60, true, NULL);
INSERT INTO estudiantes (carrera_id,nombre,apellido,email,legajo,dni,anio_ingreso,etapa,porcentaje_carrera,activo,moodle_id) VALUES ( 4, 'Lucas', 'Gomez', 'lucas@mail.com', 'LEG-1001', '40123456', 2024, 'temprana', 25, true, null);
INSERT INTO estudiantes (carrera_id,nombre,apellido,email,legajo,dni,anio_ingreso,etapa,porcentaje_carrera,activo,moodle_id) VALUES ( 4, 'Sofia', 'Rodriguez', 'sofia@mail.com', 'LEG-1002', '41234567', 2023, 'media', 55, true, null);

INSERT INTO materias (plan_id,nombre,codigo,cuatrimestre_sugerido,es_basica_critica) VALUES ( 1, 'Informatica Basica', '1912', 1, true);
INSERT INTO materias (plan_id,nombre,codigo,cuatrimestre_sugerido,es_basica_critica) VALUES ( 1, 'Programacion A', '1914', 2, true);
INSERT INTO materias (plan_id,nombre,codigo,cuatrimestre_sugerido,es_basica_critica) VALUES ( 1, 'Tecnologias Informaticas A', '1913', 1, true);
INSERT INTO materias (plan_id,nombre,codigo,cuatrimestre_sugerido,es_basica_critica) VALUES ( 1, 'Tecnologias Informaticas B', '1915', 2, true);
INSERT INTO materias (plan_id,nombre,codigo,cuatrimestre_sugerido,es_basica_critica) VALUES ( 1, 'Programacion B', '1916', 3, true);
-- migrate:down

