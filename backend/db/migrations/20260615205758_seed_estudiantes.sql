-- migrate:up

ALTER TABLE public.usuarios ALTER COLUMN moodle_id DROP NOT NULL;


INSERT INTO public.usuarios (carrera_id, nombre, apellido, email, moodle_id, rol, activo) VALUES
(4, 'Florencia', 'Gimenez', 'fgimenez@example.com', NULL, 'admin_departamental', true),
(4, 'Martin', 'Rios', 'mrios@example.com', NULL, 'docente_tutor', true),
(4, 'Lucia', 'Herrera', 'lherrera@example.com', NULL, 'asesor_par', true),
(4, 'Joaquin', 'Vidal', 'jvidal@example.com', NULL, 'docente_carga', true),
(4, 'Valentina', 'Paz', 'vpaz@example.com', NULL, 'estudiante', true);

INSERT INTO public.estudiantes (carrera_id, nombre, apellido, email, legajo, dni, anio_ingreso, etapa, porcentaje_carrera, activo, moodle_id) VALUES
(4, 'Santiago', 'Dominguez', 'sdominguez@example.com', '12345', '41234567', 2022, 'temprana', 15.5, true, NULL),
(4, 'Camila', 'Farias', 'cfarias@example.com', '12346', '42345678', 2021, 'tardia', 45.0, true, NULL),
(4, 'Mateo', 'Blanco', 'mblanco@example.com', '12347', '39876543', 2019, 'tardia', 80.0, true, NULL),
(4, 'Martina', 'Navarro', 'mnavarro@example.com', '12348', '43456789', 2023, 'temprana', 5.0, true, NULL),
(4, 'Bautista', 'Cabrera', 'bcabrera@example.com', '12349', '40123456', 2020, 'tardia', 60.0, true, NULL);



-- migrate:down

