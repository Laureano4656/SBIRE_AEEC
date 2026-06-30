-- migrate:up

DELETE FROM asignacion_encuesta WHERE estudiante_id IN (3, 4, 5) AND periodo_lectivo = '20261';

INSERT INTO asignacion_encuesta (estudiante_id, periodo_lectivo, completado, evento_id, borrador)
VALUES
-- Mateo (3) - eventos 1-6
(3, '20261', true, 1, false),
(3, '20261', true, 2, false),
(3, '20261', true, 3, false),
(3, '20261', true, 4, false),
(3, '20261', true, 5, false),
(3, '20261', true, 6, false),

-- Martina (4) - eventos 1-5 (sin 6, no tiene finales)
(4, '20261', true, 1, false),
(4, '20261', true, 2, false),
(4, '20261', true, 3, false),
(4, '20261', true, 4, false),
(4, '20261', true, 5, false),

-- Bautista (5) - eventos 1-6
(5, '20261', true, 1, false),
(5, '20261', true, 2, false),
(5, '20261', true, 3, false),
(5, '20261', true, 4, false),
(5, '20261', true, 5, false),
(5, '20261', true, 6, false);

-- migrate:down

DELETE FROM asignacion_encuesta WHERE estudiante_id IN (3, 4, 5) AND periodo_lectivo = '20261';
