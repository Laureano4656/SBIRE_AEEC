-- migrate:up

INSERT INTO usuarios (carrera_id, nombre, apellido, email, moodle_id, rol, max_casos_activos, activo, creado_en, actualizado_en)
VALUES
    (1, 'Enzo', 'Sorrenti', 'enzo.sorrenti@example.com', 190, 'docente_tutor', 5, true, NOW(), NOW());

-- migrate:down

