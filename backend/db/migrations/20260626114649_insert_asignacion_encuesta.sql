-- migrate:up

DO $$
DECLARE
    -- IDs de estudiantes (Genérico)
    id_estudiante_1 INT := 1;
    id_estudiante_2 INT := 2;

    -- Estados de la encuesta (Genérico)
    estado_completado BOOLEAN := true;
    estado_borrador BOOLEAN := false;

BEGIN
    INSERT INTO asignacion_encuesta (estudiante_id, periodo_lectivo, completado, evento_id, borrador)
    VALUES
    -- ======== ESTUDIANTE 1 ========
    -- Cuatrimestre 1 (20261)
    (id_estudiante_1, 20261, estado_completado, 1, estado_borrador),
    (id_estudiante_1, 20261, estado_completado, 2, estado_borrador),
    (id_estudiante_1, 20261, estado_completado, 3, estado_borrador),
    (id_estudiante_1, 20261, estado_completado, 4, estado_borrador),
    (id_estudiante_1, 20261, estado_completado, 5, estado_borrador),
    (id_estudiante_1, 20261, estado_completado, 6, estado_borrador),


    -- ======== ESTUDIANTE 2 ========
    -- Cuatrimestre 2 (20262) - Solo responde hasta el evento 4 inclusive
    (id_estudiante_2, 20261, estado_completado, 1, estado_borrador),
    (id_estudiante_2, 20261, estado_completado, 2, estado_borrador),
    (id_estudiante_2, 20261, estado_completado, 3, estado_borrador),
    (id_estudiante_2, 20261, estado_completado, 4, estado_borrador);

END $$;

-- migrate:down

