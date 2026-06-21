-- migrate:up

ALTER TABLE public.usuarios ALTER COLUMN moodle_id DROP NOT NULL;


INSERT INTO public.usuarios (carrera_id, nombre, apellido, email, moodle_id, rol, activo) VALUES
(1, 'Florencia', 'Gimenez', 'fgimenez@example.com', NULL, 'admin_departamental', true),
(1, 'Martin', 'Rios', 'mrios@example.com', NULL, 'docente_tutor', true),
(1, 'Lucia', 'Herrera', 'lherrera@example.com', NULL, 'asesor_par', true),
(1, 'Joaquin', 'Vidal', 'jvidal@example.com', NULL, 'docente_carga', true),
(1, 'Valentina', 'Paz', 'vpaz@example.com', NULL, 'estudiante', true);

INSERT INTO public.estudiantes (carrera_id, nombre, apellido, email, legajo, dni, anio_ingreso, etapa, porcentaje_carrera, activo, moodle_id) VALUES
(1, 'Santiago', 'Dominguez', 'sdominguez@example.com', '12345', '41234567', 2022, 'temprana', 15.5, true, NULL),
(1, 'Camila', 'Farias', 'cfarias@example.com', '12346', '42345678', 2021, 'tardia', 45.0, true, NULL),
(1, 'Mateo', 'Blanco', 'mblanco@example.com', '12347', '39876543', 2019, 'tardia', 80.0, true, NULL),
(1, 'Martina', 'Navarro', 'mnavarro@example.com', '12348', '43456789', 2023, 'temprana', 5.0, true, NULL),
(1, 'Bautista', 'Cabrera', 'bcabrera@example.com', '12349', '40123456', 2020, 'tardia', 60.0, true, NULL);



-- migrate:down

