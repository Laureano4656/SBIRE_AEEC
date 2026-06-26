-- migrate:up

DO $$
DECLARE
    -- Materias
    m_analisis_1 INT;
    m_algebra_1 INT;
    m_quimica INT;
    m_analisis_2 INT;
    m_algebra_2 INT;
    m_fisica_1 INT;
    m_programacion INT;

    -- IDs de estudiantes (mantenidos en variables para seguir el patrón genérico)
    id_estudiante_1 INT := 1;
    id_estudiante_2 INT := 2;

BEGIN
    -- ======== CARGAR IDs DE MATERIAS ========
    -- Se utiliza ILIKE para evitar problemas de mayúsculas/minúsculas o tildes
    SELECT id INTO m_analisis_1   FROM materias WHERE nombre ILIKE '%Análisis Matemático I%' LIMIT 1;
    SELECT id INTO m_algebra_1    FROM materias WHERE nombre ILIKE '%Álgebra I-B%' LIMIT 1;
    SELECT id INTO m_quimica      FROM materias WHERE nombre ILIKE '%Fundamentos de Química%' LIMIT 1;
    SELECT id INTO m_analisis_2   FROM materias WHERE nombre ILIKE '%Análisis Matemático II%' LIMIT 1;
    SELECT id INTO m_algebra_2    FROM materias WHERE nombre ILIKE '%Álgebra II%' LIMIT 1;
    SELECT id INTO m_fisica_1     FROM materias WHERE nombre ILIKE '%Física A%' LIMIT 1;
    SELECT id INTO m_programacion FROM materias WHERE nombre ILIKE '%Fundamentos de la Programación%' LIMIT 1;

    -- ======== INSERCIÓN DE CURSADAS ========

    -- Estudiante 1
    INSERT INTO cursadas (estudiante_id, materia_id, anio, cuatrimestre, estado) VALUES
    -- Cursadas pasadas (Año 2026, Cuatrimestre 1)
    (id_estudiante_1, m_analisis_1,   2026, 1, 'aprobada'),
    (id_estudiante_1, m_algebra_1,    2026, 1, 'aprobada'),
    (id_estudiante_1, m_quimica,      2026, 1, 'aprobada_falta_final'),
    
    -- Cursadas actuales (Año 2026, Cuatrimestre 2)
    (id_estudiante_1, m_algebra_2,    2026, 2, 'cursando'),
    (id_estudiante_1, m_analisis_2,   2026, 2, 'cursando'),
    (id_estudiante_1, m_fisica_1,     2026, 2, 'cursando'),
    (id_estudiante_1, m_programacion, 2026, 2, 'cursando');

    -- Estudiante 2
    INSERT INTO cursadas (estudiante_id, materia_id, anio, cuatrimestre, estado) VALUES
    -- Cursadas actuales (Año 2026, Cuatrimestre 2)
    (id_estudiante_2, m_analisis_1,   2026, 2, 'cursando'),
    (id_estudiante_2, m_algebra_1,    2026, 2, 'cursando'),
    (id_estudiante_2, m_quimica,      2026, 2, 'cursando');

END $$;

-- migrate:down
