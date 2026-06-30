-- migrate:up

-- Limpiar datos viejos de estudiantes 3, 4, 5
DELETE FROM cursadas WHERE estudiante_id IN (3, 4, 5) AND anio >= 2023;

DO $$
DECLARE
    -- C1
    m_analisis_1 INT;
    m_algebra_1 INT;
    m_quimica INT;
    -- C2
    m_analisis_2 INT;
    m_algebra_2 INT;
    m_fisica_a INT;
    m_programacion INT;
    -- C3
    m_analisis_3 INT;
    m_prob_estad INT;
    m_mecanica_solido INT;
    m_fisica_b_2 INT;
    m_ingles_1 INT;
    m_proyecto_1 INT;
    -- C4
    m_admin_estrategica INT;
    m_economia_industrial INT;
    m_maquinas_equipos INT;
    m_termodinamica INT;
    m_ingles_2 INT;
    -- C5
    m_admin_operaciones INT;
    m_inv_operativa_a INT;
    m_gestion_tecnologia INT;
    m_tecnologia_materiales INT;
    m_etica INT;
    m_mecanica_fluidos INT;
    -- C6
    m_planif_control INT;
    m_inv_operativa_b INT;
    m_sist_representacion INT;
    m_fisica_exp_a INT;
    m_logistica INT;
    m_electiva_1 INT;
    m_proyecto_2 INT;
    -- C7
    m_diseno_instalaciones INT;
    m_sist_gestion INT;
    m_comp_organizacional INT;
    m_procesos_fabricacion INT;
    m_ingles_prof_a INT;

    id_estudiante_3 INT := 3;
    id_estudiante_4 INT := 4;
    id_estudiante_5 INT := 5;

BEGIN
    -- ======== CARGAR IDs DE MATERIAS ========
    -- C1
    SELECT id INTO m_analisis_1   FROM materias WHERE nombre ILIKE '%Análisis Matemático I%' LIMIT 1;
    SELECT id INTO m_algebra_1    FROM materias WHERE nombre ILIKE '%Álgebra I-B%' LIMIT 1;
    SELECT id INTO m_quimica      FROM materias WHERE nombre ILIKE '%Fundamentos de Química%' LIMIT 1;
    -- C2
    SELECT id INTO m_analisis_2   FROM materias WHERE nombre ILIKE '%Análisis Matemático II%' LIMIT 1;
    SELECT id INTO m_algebra_2    FROM materias WHERE nombre ILIKE '%Álgebra II%' LIMIT 1;
    SELECT id INTO m_fisica_a     FROM materias WHERE nombre ILIKE '%Física A%' LIMIT 1;
    SELECT id INTO m_programacion FROM materias WHERE nombre ILIKE '%Fundamentos de la Programación%' LIMIT 1;
    -- C3
    SELECT id INTO m_analisis_3       FROM materias WHERE nombre ILIKE '%Análisis Matemático III%' LIMIT 1;
    SELECT id INTO m_prob_estad       FROM materias WHERE nombre ILIKE '%Probabilidad y Estadística%' LIMIT 1;
    SELECT id INTO m_mecanica_solido  FROM materias WHERE nombre ILIKE '%Mecánica del Sólido%' LIMIT 1;
    SELECT id INTO m_fisica_b_2       FROM materias WHERE nombre ILIKE '%Física B-II%' LIMIT 1;
    SELECT id INTO m_ingles_1         FROM materias WHERE nombre ILIKE '%Inglés I%' LIMIT 1;
    SELECT id INTO m_proyecto_1       FROM materias WHERE nombre ILIKE '%Proyecto de Ingeniería Industrial I%' LIMIT 1;
    -- C4
    SELECT id INTO m_admin_estrategica   FROM materias WHERE nombre ILIKE '%Administración Estratégica%' LIMIT 1;
    SELECT id INTO m_economia_industrial FROM materias WHERE nombre ILIKE '%Conceptos de Economía Industrial%' LIMIT 1;
    SELECT id INTO m_maquinas_equipos    FROM materias WHERE nombre ILIKE '%Máquinas y Equipos Industriales I%' LIMIT 1;
    SELECT id INTO m_termodinamica       FROM materias WHERE nombre ILIKE '%Termodinámica Industrial%' LIMIT 1;
    SELECT id INTO m_ingles_2            FROM materias WHERE nombre ILIKE '%Inglés II%' LIMIT 1;
    -- C5
    SELECT id INTO m_admin_operaciones     FROM materias WHERE nombre ILIKE '%Administración de Operaciones%' LIMIT 1;
    SELECT id INTO m_inv_operativa_a       FROM materias WHERE nombre ILIKE '%Investigación Operativa A%' LIMIT 1;
    SELECT id INTO m_gestion_tecnologia    FROM materias WHERE nombre ILIKE '%Gestión de la Tecnología y la Innovación%' LIMIT 1;
    SELECT id INTO m_tecnologia_materiales FROM materias WHERE nombre ILIKE '%Tecnología de los Materiales%' LIMIT 1;
    SELECT id INTO m_etica                 FROM materias WHERE nombre ILIKE '%Ética, Legislación%' LIMIT 1;
    SELECT id INTO m_mecanica_fluidos      FROM materias WHERE nombre ILIKE '%Mecánica de Fluidos%' LIMIT 1;
    -- C6
    SELECT id INTO m_planif_control      FROM materias WHERE nombre ILIKE '%Planificación y Control de la Producción%' LIMIT 1;
    SELECT id INTO m_inv_operativa_b     FROM materias WHERE nombre ILIKE '%Investigación Operativa B%' LIMIT 1;
    SELECT id INTO m_sist_representacion FROM materias WHERE nombre ILIKE '%Sistemas de Representación para Ingeniería%' LIMIT 1;
    SELECT id INTO m_fisica_exp_a        FROM materias WHERE nombre ILIKE '%Física Experimental A%' LIMIT 1;
    SELECT id INTO m_logistica           FROM materias WHERE nombre ILIKE '%Gestión de la Logística%' LIMIT 1;
    SELECT id INTO m_electiva_1          FROM materias WHERE nombre ILIKE '%Electiva I%' LIMIT 1;
    SELECT id INTO m_proyecto_2          FROM materias WHERE nombre ILIKE '%Proyecto de Ingeniería Industrial II%' LIMIT 1;
    -- C7
    SELECT id INTO m_diseno_instalaciones FROM materias WHERE nombre ILIKE '%Diseño de Instalaciones y Procesos%' LIMIT 1;
    SELECT id INTO m_sist_gestion         FROM materias WHERE nombre ILIKE '%Sistemas de Gestión y Mejora Continua%' LIMIT 1;
    SELECT id INTO m_comp_organizacional  FROM materias WHERE nombre ILIKE '%Comportamiento Organizacional%' LIMIT 1;
    SELECT id INTO m_procesos_fabricacion FROM materias WHERE nombre ILIKE '%Introducción a los Procesos de Fabricación%' LIMIT 1;
    SELECT id INTO m_ingles_prof_a        FROM materias WHERE nombre ILIKE '%Inglés Profesional A%' LIMIT 1;

    -- ======================================================================
    -- MARTINA (4) - CURSA CUATRIMESTRE 3
    -- ======================================================================

    -- 2024, Cuatrimestre 1 (C1)
    INSERT INTO cursadas (estudiante_id, materia_id, anio, cuatrimestre, estado) VALUES
    (id_estudiante_4, m_analisis_1, 2025, 1, 'aprobada'),
    (id_estudiante_4, m_algebra_1,  2025, 1, 'aprobada'),
    (id_estudiante_4, m_quimica,    2025, 1, 'aprobada');

    -- 2024, Cuatrimestre 2 (C2)
    INSERT INTO cursadas (estudiante_id, materia_id, anio, cuatrimestre, estado) VALUES
    (id_estudiante_4, m_analisis_2,   2025, 2, 'aprobada'),
    (id_estudiante_4, m_algebra_2,    2025, 2, 'aprobada'),
    (id_estudiante_4, m_fisica_a,     2025, 2, 'aprobada'),
    (id_estudiante_4, m_programacion, 2025, 2, 'aprobada');

    -- 2025, Cuatrimestre 1 (C3 - cursando)
    INSERT INTO cursadas (estudiante_id, materia_id, anio, cuatrimestre, estado) VALUES
    (id_estudiante_4, m_analisis_3,      2026, 1, 'cursando'),
    (id_estudiante_4, m_prob_estad,      2026, 1, 'cursando'),
    (id_estudiante_4, m_mecanica_solido, 2026, 1, 'cursando'),
    (id_estudiante_4, m_fisica_b_2,      2026, 1, 'cursando'),
    (id_estudiante_4, m_ingles_1,        2026, 1, 'cursando'),
    (id_estudiante_4, m_proyecto_1,      2026, 1, 'cursando');

    -- ======================================================================
    -- BAUTISTA (5) - CURSA CUATRIMESTRE 5
    -- ======================================================================

    -- 2024, Cuatrimestre 1 (C1)
    INSERT INTO cursadas (estudiante_id, materia_id, anio, cuatrimestre, estado) VALUES
    (id_estudiante_5, m_analisis_1, 2024, 1, 'aprobada'),
    (id_estudiante_5, m_algebra_1,  2024, 1, 'aprobada'),
    (id_estudiante_5, m_quimica,    2024, 1, 'aprobada');

    -- 2024, Cuatrimestre 2 (C2)
    INSERT INTO cursadas (estudiante_id, materia_id, anio, cuatrimestre, estado) VALUES
    (id_estudiante_5, m_analisis_2,   2024, 2, 'aprobada'),
    (id_estudiante_5, m_algebra_2,    2024, 2, 'aprobada'),
    (id_estudiante_5, m_fisica_a,     2024, 2, 'aprobada'),
    (id_estudiante_5, m_programacion, 2024, 2, 'aprobada');

    -- 2025, Cuatrimestre 1 (C3)
    INSERT INTO cursadas (estudiante_id, materia_id, anio, cuatrimestre, estado) VALUES
    (id_estudiante_5, m_analisis_3,      2025, 1, 'aprobada'),
    (id_estudiante_5, m_prob_estad,      2025, 1, 'aprobada'),
    (id_estudiante_5, m_mecanica_solido, 2025, 1, 'aprobada'),
    (id_estudiante_5, m_fisica_b_2,      2025, 1, 'aprobada'),
    (id_estudiante_5, m_ingles_1,        2025, 1, 'aprobada'),
    (id_estudiante_5, m_proyecto_1,      2025, 1, 'aprobada');

    -- 2025, Cuatrimestre 2 (C4)
    INSERT INTO cursadas (estudiante_id, materia_id, anio, cuatrimestre, estado) VALUES
    (id_estudiante_5, m_admin_estrategica,   2025, 2, 'aprobada'),
    (id_estudiante_5, m_economia_industrial, 2025, 2, 'aprobada'),
    (id_estudiante_5, m_maquinas_equipos,    2025, 2, 'aprobada'),
    (id_estudiante_5, m_termodinamica,       2025, 2, 'aprobada'),
    (id_estudiante_5, m_ingles_2,            2025, 2, 'aprobada');

    -- 2026, Cuatrimestre 1 (C5 - cursando)
    INSERT INTO cursadas (estudiante_id, materia_id, anio, cuatrimestre, estado) VALUES
    (id_estudiante_5, m_admin_operaciones,     2026, 1, 'cursando'),
    (id_estudiante_5, m_inv_operativa_a,       2026, 1, 'cursando'),
    (id_estudiante_5, m_gestion_tecnologia,    2026, 1, 'cursando'),
    (id_estudiante_5, m_tecnologia_materiales, 2026, 1, 'cursando'),
    (id_estudiante_5, m_etica,                 2026, 1, 'cursando'),
    (id_estudiante_5, m_mecanica_fluidos,      2026, 1, 'cursando');

    -- ======================================================================
    -- MATEO (3) - CURSA CUATRIMESTRE 7
    -- ======================================================================

    -- 2023, Cuatrimestre 1 (C1)
    INSERT INTO cursadas (estudiante_id, materia_id, anio, cuatrimestre, estado) VALUES
    (id_estudiante_3, m_analisis_1, 2023, 1, 'aprobada'),
    (id_estudiante_3, m_algebra_1,  2023, 1, 'aprobada'),
    (id_estudiante_3, m_quimica,    2023, 1, 'aprobada');

    -- 2023, Cuatrimestre 2 (C2)
    INSERT INTO cursadas (estudiante_id, materia_id, anio, cuatrimestre, estado) VALUES
    (id_estudiante_3, m_analisis_2,   2023, 2, 'aprobada'),
    (id_estudiante_3, m_algebra_2,    2023, 2, 'aprobada'),
    (id_estudiante_3, m_fisica_a,     2023, 2, 'aprobada'),
    (id_estudiante_3, m_programacion, 2023, 2, 'aprobada');

    -- 2024, Cuatrimestre 1 (C3)
    INSERT INTO cursadas (estudiante_id, materia_id, anio, cuatrimestre, estado) VALUES
    (id_estudiante_3, m_analisis_3,      2024, 1, 'aprobada'),
    (id_estudiante_3, m_prob_estad,      2024, 1, 'aprobada'),
    (id_estudiante_3, m_mecanica_solido, 2024, 1, 'aprobada'),
    (id_estudiante_3, m_fisica_b_2,      2024, 1, 'aprobada'),
    (id_estudiante_3, m_ingles_1,        2024, 1, 'aprobada'),
    (id_estudiante_3, m_proyecto_1,      2024, 1, 'aprobada');

    -- 2024, Cuatrimestre 2 (C4)
    INSERT INTO cursadas (estudiante_id, materia_id, anio, cuatrimestre, estado) VALUES
    (id_estudiante_3, m_admin_estrategica,   2024, 2, 'aprobada'),
    (id_estudiante_3, m_economia_industrial, 2024, 2, 'aprobada'),
    (id_estudiante_3, m_maquinas_equipos,    2024, 2, 'aprobada'),
    (id_estudiante_3, m_termodinamica,       2024, 2, 'aprobada'),
    (id_estudiante_3, m_ingles_2,            2024, 2, 'aprobada');

    -- 2025, Cuatrimestre 1 (C5)
    INSERT INTO cursadas (estudiante_id, materia_id, anio, cuatrimestre, estado) VALUES
    (id_estudiante_3, m_admin_operaciones,     2025, 1, 'aprobada'),
    (id_estudiante_3, m_inv_operativa_a,       2025, 1, 'aprobada'),
    (id_estudiante_3, m_gestion_tecnologia,    2025, 1, 'aprobada'),
    (id_estudiante_3, m_tecnologia_materiales, 2025, 1, 'aprobada'),
    (id_estudiante_3, m_etica,                 2025, 1, 'aprobada'),
    (id_estudiante_3, m_mecanica_fluidos,      2025, 1, 'aprobada');

    -- 2025, Cuatrimestre 2 (C6)
    INSERT INTO cursadas (estudiante_id, materia_id, anio, cuatrimestre, estado) VALUES
    (id_estudiante_3, m_planif_control,     2025, 2, 'aprobada'),
    (id_estudiante_3, m_inv_operativa_b,    2025, 2, 'aprobada'),
    (id_estudiante_3, m_sist_representacion, 2025, 2, 'aprobada'),
    (id_estudiante_3, m_fisica_exp_a,       2025, 2, 'aprobada'),
    (id_estudiante_3, m_logistica,          2025, 2, 'aprobada'),
    (id_estudiante_3, m_electiva_1,         2025, 2, 'aprobada'),
    (id_estudiante_3, m_proyecto_2,         2025, 2, 'aprobada');

    -- 2026, Cuatrimestre 1 (C7 - cursando)
    INSERT INTO cursadas (estudiante_id, materia_id, anio, cuatrimestre, estado) VALUES
    (id_estudiante_3, m_diseno_instalaciones, 2026, 1, 'cursando'),
    (id_estudiante_3, m_sist_gestion,         2026, 1, 'cursando'),
    (id_estudiante_3, m_comp_organizacional,  2026, 1, 'cursando'),
    (id_estudiante_3, m_procesos_fabricacion, 2026, 1, 'cursando'),
    (id_estudiante_3, m_ingles_prof_a,        2026, 1, 'cursando');

END $$;

-- migrate:down

DELETE FROM cursadas WHERE estudiante_id IN (3, 4, 5) AND anio >= 2023;
