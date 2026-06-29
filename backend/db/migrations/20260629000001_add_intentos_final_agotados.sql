-- migrate:up

ALTER TYPE public.origen_alerta_enum ADD VALUE IF NOT EXISTS 'intentos_final_agotados';

INSERT INTO intentos_finales (cursada_id, numero_intento, nota, fecha, aprobado)
VALUES (3,1,2,CURRENT_TIMESTAMP, false),
(3,2,3,CURRENT_TIMESTAMP, false);


INSERT INTO asignacion_encuesta (estudiante_id, periodo_lectivo, completado, evento_id, borrador)
VALUES
-- ======== ESTUDIANTE 1 ========
-- Cuatrimestre 1 (20261)
(1, 20271, false, 6, false)

-- migrate:down
