-- migrate:up

-- Carga de Materias y Correlativas para Plan 2024 - Carrera 4
DO $$
DECLARE
    v_plan_id int;
    v_INGM101 int;
    v_INGM105 int;
    v_ING1103 int;
    v_INGM102 int;
    v_INGM106 int;
    v_INGF101 int;
    v_ING6101 int;
    v_INGF103 int;
    v_INGM103 int;
    v_INGM108 int;
    v_ING2218 int;
    v_ING8408 int;
    v_ING8501 int;
    v_ING8302 int;
    v_ING8414 int;
    v_ING3209 int;
    v_ING2221 int;
    v_ING8409 int;
    v_ING8301 int;
    v_ING8201 int;
    v_ING8308 int;
    v_ING2219 int;
    v_ING8405 int;
    v_ING2217 int;
    v_ING8502 int;
    v_ING8310 int;
    v_ING8202 int;
    v_ING2104 int;
    v_INGF106 int;
    v_ING8307 int;
    v_SYN_ELECTIVA_I int;
    v_ING8303 int;
    v_ING8311 int;
    v_ING8402 int;
    v_ING8306 int;
    v_ING8415 int;
    v_ING8503 int;
    v_ING8305 int;
    v_ING2220 int;
    v_ING2222 int;
    v_SYN_ELECTIVA_II int;
    v_ING8416 int;
    v_ING8312 int;
    v_ING8418 int;
    v_ING8417 int;
    v_SYN_ELECTIVA_III int;
    v_ING8504 int;
    v_ING8309 int;
    v_ING8304 int;
    v_SYN_ELECTIVA_VI int;
    v_SYN_OPTATIVA_I int;
    v_SYN_OPTATIVA_II int;
BEGIN
    -- 1. Crear o recuperar Plan de Estudios
    SELECT id INTO v_plan_id FROM plan_estudios WHERE carrera_id = 1 AND anio_vigencia = 2024 LIMIT 1;
    IF v_plan_id IS NULL THEN
        INSERT INTO plan_estudios (carrera_id, nombre, anio_vigencia, activo)
        VALUES (1, 'Plan 2024 Industrial', 2024, true) RETURNING id INTO v_plan_id;
    END IF;

    -- 2. Insertar Materias
    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Análisis Matemático I', 'INGM101', 1, false)
    RETURNING id INTO v_INGM101;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Álgebra I-B', 'INGM105', 1, false)
    RETURNING id INTO v_INGM105;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Fundamentos de Química', 'ING1103', 1, false)
    RETURNING id INTO v_ING1103;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Análisis Matemático II', 'INGM102', 2, false)
    RETURNING id INTO v_INGM102;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Álgebra II', 'INGM106', 2, false)
    RETURNING id INTO v_INGM106;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Física A', 'INGF101', 2, false)
    RETURNING id INTO v_INGF101;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Fundamentos de la Programación', 'ING6101', 2, false)
    RETURNING id INTO v_ING6101;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Física B-II', 'INGF103', 3, false)
    RETURNING id INTO v_INGF103;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Análisis Matemático III', 'INGM103', 3, false)
    RETURNING id INTO v_INGM103;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Probabilidad y Estadística', 'INGM108', 3, false)
    RETURNING id INTO v_INGM108;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Mecánica del Sólido', 'ING2218', 3, false)
    RETURNING id INTO v_ING2218;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Inglés I', 'ING8408', 3, false)
    RETURNING id INTO v_ING8408;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Proyecto de Ingeniería Industrial I', 'ING8501', 3, false)
    RETURNING id INTO v_ING8501;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Administración Estratégica', 'ING8302', 4, false)
    RETURNING id INTO v_ING8302;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Conceptos de Economía Industrial', 'ING8414', 4, false)
    RETURNING id INTO v_ING8414;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Máquinas y Equipos Industriales I', 'ING3209', 4, false)
    RETURNING id INTO v_ING3209;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Termodinámica Industrial', 'ING2221', 4, false)
    RETURNING id INTO v_ING2221;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Inglés II', 'ING8409', 4, false)
    RETURNING id INTO v_ING8409;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Administración de Operaciones', 'ING8301', 5, false)
    RETURNING id INTO v_ING8301;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Investigación Operativa A', 'ING8201', 5, false)
    RETURNING id INTO v_ING8201;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Gestión de la Tecnología y la Innovación', 'ING8308', 5, false)
    RETURNING id INTO v_ING8308;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Tecnología de los Materiales', 'ING2219', 5, false)
    RETURNING id INTO v_ING2219;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Ética, Legislación y Propiedad Intelectual en el Ejercicio Profesional', 'ING8405', 5, false)
    RETURNING id INTO v_ING8405;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Mecánica de Fluidos', 'ING2217', 5, false)
    RETURNING id INTO v_ING2217;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Proyecto de Ingeniería Industrial II', 'ING8502', 5, false)
    RETURNING id INTO v_ING8502;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Planificación y Control de la Producción', 'ING8310', 6, false)
    RETURNING id INTO v_ING8310;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Investigación Operativa B', 'ING8202', 6, false)
    RETURNING id INTO v_ING8202;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Sistemas de Representación para Ingeniería', 'ING2104', 6, false)
    RETURNING id INTO v_ING2104;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Física Experimental A', 'INGF106', 6, false)
    RETURNING id INTO v_INGF106;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Gestión de la Logística Integral y Cadena de Suministros', 'ING8307', 6, false)
    RETURNING id INTO v_ING8307;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Electiva I', 'SYN_ELECTIVA_I', 6, false)
    RETURNING id INTO v_SYN_ELECTIVA_I;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Diseño de Instalaciones y Procesos', 'ING8303', 7, false)
    RETURNING id INTO v_ING8303;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Sistemas de Gestión y Mejora Continua', 'ING8311', 7, false)
    RETURNING id INTO v_ING8311;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Comportamiento Organizacional y Relaciones del Trabajo en el Ejercicio Profesional', 'ING8402', 7, false)
    RETURNING id INTO v_ING8402;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Gestión Comercial de las Organizaciones', 'ING8306', 7, false)
    RETURNING id INTO v_ING8306;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Inglés Profesional A', 'ING8415', 7, false)
    RETURNING id INTO v_ING8415;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Proyecto de Ingeniería Industrial III', 'ING8503', 7, false)
    RETURNING id INTO v_ING8503;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Formulación y Evaluación de Proyectos', 'ING8305', 8, false)
    RETURNING id INTO v_ING8305;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Introducción a los Procesos de Fabricación', 'ING2220', 8, false)
    RETURNING id INTO v_ING2220;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Tecnología de Control', 'ING2222', 8, false)
    RETURNING id INTO v_ING2222;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Electiva II', 'SYN_ELECTIVA_II', 8, false)
    RETURNING id INTO v_SYN_ELECTIVA_II;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Inglés Profesional B', 'ING8416', 8, false)
    RETURNING id INTO v_ING8416;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Sustentabilidad, Higiene y Seguridad', 'ING8312', 9, false)
    RETURNING id INTO v_ING8312;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Desarrollo Económico y Comercio Internacional', 'ING8418', 9, false)
    RETURNING id INTO v_ING8418;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Sistemas Informáticos de Gestión', 'ING8417', 9, false)
    RETURNING id INTO v_ING8417;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Electiva III', 'SYN_ELECTIVA_III', 9, false)
    RETURNING id INTO v_SYN_ELECTIVA_III;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Proyecto de Ingeniería Industrial IV (Trabajo Final)', 'ING8504', 9, false)
    RETURNING id INTO v_ING8504;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Gestión Integral del Mantenimiento', 'ING8309', 10, false)
    RETURNING id INTO v_ING8309;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Empresas y Servicios Basadas en el Conocimiento', 'ING8304', 10, false)
    RETURNING id INTO v_ING8304;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Electiva VI', 'SYN_ELECTIVA_VI', 10, false)
    RETURNING id INTO v_SYN_ELECTIVA_VI;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Optativa I', 'SYN_OPTATIVA_I', 10, false)
    RETURNING id INTO v_SYN_OPTATIVA_I;

    INSERT INTO materias (plan_id, nombre, codigo, cuatrimestre_sugerido, es_basica_critica)
    VALUES (v_plan_id, 'Optativa II', 'SYN_OPTATIVA_II', 10, false)
    RETURNING id INTO v_SYN_OPTATIVA_II;

    -- 3. Insertar Correlativas
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM102, v_INGM101);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM106, v_INGM105);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF101, v_INGM101);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF101, v_INGM105);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6101, v_INGM101);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6101, v_INGM105);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF103, v_INGF101);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM103, v_INGM102);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM103, v_INGM106);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM108, v_INGM102);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2218, v_INGF101);
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8501, v_INGM102);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8302, v_INGM108);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8414, v_INGM102);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3209, v_INGM103);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3209, v_INGF103);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2221, v_INGF101);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2221, v_ING1103);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2221, v_INGM102);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8409, v_ING8408);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8301, v_ING8302);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8201, v_INGM108);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8308, v_ING8302);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2219, v_ING2218);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2219, v_ING1103);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8405, v_ING8302);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8405, v_INGM103);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2217, v_ING2218);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2217, v_INGM102);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8502, v_ING8302);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8502, v_ING8501);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8310, v_ING8301);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8310, v_ING8201);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8202, v_ING8201);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2104, v_INGM106);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF106, v_INGF103);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8307, v_ING8301);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8307, v_ING8201);
    -- No se encontró correlativa en la lista (se ignora): Depende de la electiva elegida
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8303, v_ING2221);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8303, v_ING3209);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8303, v_ING2217);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8311, v_ING8310);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8402, v_ING8405);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8402, v_ING8310);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8306, v_ING8414);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8306, v_ING8310);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8415, v_ING8409);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8503, v_ING8310);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8503, v_ING8202);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8503, v_ING8502);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8305, v_ING8202);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8305, v_ING8301);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2220, v_ING2218);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2220, v_INGF106);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2220, v_ING2219);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2222, v_ING8303);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2222, v_ING2104);
    -- No se encontró correlativa en la lista (se ignora): Depende de la electiva elegida
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8416, v_ING8415);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8312, v_ING8311);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8312, v_ING8303);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8312, v_ING2222);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8418, v_ING8414);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8418, v_ING8307);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8417, v_ING6101);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8417, v_ING8502);
    -- No se encontró correlativa en la lista (se ignora): Depende de la electiva elegida
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8504, v_ING8311);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8504, v_ING8305);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8504, v_ING8503);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8309, v_ING8310);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8309, v_ING2220);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8304, v_ING8308);
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8304, v_ING8402);
    -- No se encontró correlativa en la lista (se ignora): Depende de la electiva elegida
    -- No se encontró correlativa en la lista (se ignora): Depende de la optativa elegida
    -- No se encontró correlativa en la lista (se ignora): Depende de la optativa elegida
END $$;

-- migrate:down

