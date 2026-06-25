-- migrate:up

-- INGENIERIA INFORMATICA
-- Carga de Materias y Correlativas para Plan 2024 - Carrera 2
-- Generado por generate_plan_sql.py

DO $$
DECLARE
    v_plan_id int;
    v_INGM101 int;
    v_INGM105 int;
    v_ING6102 int;
    v_ING6301 int;
    v_INGM102 int;
    v_INGM106 int;
    v_ING6201 int;
    v_INGM107 int;
    v_INGF101 int;
    v_ING6202 int;
    v_ING6302 int;
    v_ING8408 int;
    v_INGM108 int;
    v_INGF103 int;
    v_ING6203 int;
    v_ING6204 int;
    v_ING6205 int;
    v_ING8409 int;
    v_ING8410 int;
    v_ING6207 int;
    v_ING6303 int;
    v_ING6208 int;
    v_ING4801 int;
    v_ING6304 int;
    v_ING6305 int;
    v_ING6306 int;
    v_ING6307 int;
    v_ING6316 int;
    v_ING6309 int;
    v_ING6310 int;
    v_ING8402 int;
    v_ING6411 int;
    v_ING6401 int;
    v_ING6312 int;
    v_ING6313 int;
    v_ING6314 int;
    v_ING6209 int;
    v_ING8405 int;
    v_ING6315 int;
    v_ING8412 int;
    v_ING6501 int;
    v_ING6502 int;
    v_ING6503 int;
    v_carrera_id int;
BEGIN
    SELECT id INTO v_carrera_id FROM carreras WHERE nombre = 'Ingenieria Informatica' LIMIT 1;
    -- 1. Buscar o crear Plan de Estudios para carrera 2
    SELECT id INTO v_plan_id FROM plan_estudios
    WHERE carrera_id = v_carrera_id AND anio_vigencia = 2024 LIMIT 1;
    IF v_plan_id IS NULL THEN
        INSERT INTO plan_estudios (carrera_id, nombre, anio_vigencia, activo)
        VALUES (v_carrera_id, 'Plan 2024', 2024, true)
        RETURNING id INTO v_plan_id;
    END IF;

    -- 2. Insertar o reutilizar Materias (identificadas por codigo)
    SELECT id INTO v_INGM101 FROM materias WHERE codigo = 'INGM101';
    IF v_INGM101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático I', 'INGM101', false)
        RETURNING id INTO v_INGM101;
    END IF;

    SELECT id INTO v_INGM105 FROM materias WHERE codigo = 'INGM105';
    IF v_INGM105 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Álgebra I-B', 'INGM105', false)
        RETURNING id INTO v_INGM105;
    END IF;

    SELECT id INTO v_ING6102 FROM materias WHERE codigo = 'ING6102';
    IF v_ING6102 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Informática Básica', 'ING6102', false)
        RETURNING id INTO v_ING6102;
    END IF;

    SELECT id INTO v_ING6301 FROM materias WHERE codigo = 'ING6301';
    IF v_ING6301 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Tecnologías Informáticas A', 'ING6301', false)
        RETURNING id INTO v_ING6301;
    END IF;

    SELECT id INTO v_INGM102 FROM materias WHERE codigo = 'INGM102';
    IF v_INGM102 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático II', 'INGM102', false)
        RETURNING id INTO v_INGM102;
    END IF;

    SELECT id INTO v_INGM106 FROM materias WHERE codigo = 'INGM106';
    IF v_INGM106 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Álgebra II', 'INGM106', false)
        RETURNING id INTO v_INGM106;
    END IF;

    SELECT id INTO v_ING6201 FROM materias WHERE codigo = 'ING6201';
    IF v_ING6201 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Programación A', 'ING6201', false)
        RETURNING id INTO v_ING6201;
    END IF;

    SELECT id INTO v_INGM107 FROM materias WHERE codigo = 'INGM107';
    IF v_INGM107 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Introducción a la Matemática Discreta', 'INGM107', false)
        RETURNING id INTO v_INGM107;
    END IF;

    SELECT id INTO v_INGF101 FROM materias WHERE codigo = 'INGF101';
    IF v_INGF101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física A', 'INGF101', false)
        RETURNING id INTO v_INGF101;
    END IF;

    SELECT id INTO v_ING6202 FROM materias WHERE codigo = 'ING6202';
    IF v_ING6202 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Programación B', 'ING6202', false)
        RETURNING id INTO v_ING6202;
    END IF;

    SELECT id INTO v_ING6302 FROM materias WHERE codigo = 'ING6302';
    IF v_ING6302 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Tecnologías Informáticas B', 'ING6302', false)
        RETURNING id INTO v_ING6302;
    END IF;

    SELECT id INTO v_ING8408 FROM materias WHERE codigo = 'ING8408';
    IF v_ING8408 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Inglés I', 'ING8408', false)
        RETURNING id INTO v_ING8408;
    END IF;

    SELECT id INTO v_INGM108 FROM materias WHERE codigo = 'INGM108';
    IF v_INGM108 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Probabilidad y Estadística', 'INGM108', false)
        RETURNING id INTO v_INGM108;
    END IF;

    SELECT id INTO v_INGF103 FROM materias WHERE codigo = 'INGF103';
    IF v_INGF103 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física B-II', 'INGF103', false)
        RETURNING id INTO v_INGF103;
    END IF;

    SELECT id INTO v_ING6203 FROM materias WHERE codigo = 'ING6203';
    IF v_ING6203 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Teorías de la Información y la Comunicación', 'ING6203', false)
        RETURNING id INTO v_ING6203;
    END IF;

    SELECT id INTO v_ING6204 FROM materias WHERE codigo = 'ING6204';
    IF v_ING6204 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fundamentos de la Arquitectura de Computadoras', 'ING6204', false)
        RETURNING id INTO v_ING6204;
    END IF;

    SELECT id INTO v_ING6205 FROM materias WHERE codigo = 'ING6205';
    IF v_ING6205 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Programación C', 'ING6205', false)
        RETURNING id INTO v_ING6205;
    END IF;

    SELECT id INTO v_ING8409 FROM materias WHERE codigo = 'ING8409';
    IF v_ING8409 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Inglés II', 'ING8409', false)
        RETURNING id INTO v_ING8409;
    END IF;

    SELECT id INTO v_ING8410 FROM materias WHERE codigo = 'ING8410';
    IF v_ING8410 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Investigación de Operaciones', 'ING8410', false)
        RETURNING id INTO v_ING8410;
    END IF;

    SELECT id INTO v_ING6207 FROM materias WHERE codigo = 'ING6207';
    IF v_ING6207 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Estructura y Organización de Datos', 'ING6207', false)
        RETURNING id INTO v_ING6207;
    END IF;

    SELECT id INTO v_ING6303 FROM materias WHERE codigo = 'ING6303';
    IF v_ING6303 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fundamentos de Sistemas Operativos', 'ING6303', false)
        RETURNING id INTO v_ING6303;
    END IF;

    SELECT id INTO v_ING6208 FROM materias WHERE codigo = 'ING6208';
    IF v_ING6208 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fundamentos de Lenguajes Formales', 'ING6208', false)
        RETURNING id INTO v_ING6208;
    END IF;

    SELECT id INTO v_ING4801 FROM materias WHERE codigo = 'ING4801';
    IF v_ING4801 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Administración Empresarial en la Economía del Conocimiento', 'ING4801', false)
        RETURNING id INTO v_ING4801;
    END IF;

    SELECT id INTO v_ING6304 FROM materias WHERE codigo = 'ING6304';
    IF v_ING6304 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Calidad de Software A', 'ING6304', false)
        RETURNING id INTO v_ING6304;
    END IF;

    SELECT id INTO v_ING6305 FROM materias WHERE codigo = 'ING6305';
    IF v_ING6305 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Redes y Comunicación de Datos A', 'ING6305', false)
        RETURNING id INTO v_ING6305;
    END IF;

    SELECT id INTO v_ING6306 FROM materias WHERE codigo = 'ING6306';
    IF v_ING6306 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis y Diseño de Sistemas A', 'ING6306', false)
        RETURNING id INTO v_ING6306;
    END IF;

    SELECT id INTO v_ING6307 FROM materias WHERE codigo = 'ING6307';
    IF v_ING6307 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Sistemas de Bases de Datos', 'ING6307', false)
        RETURNING id INTO v_ING6307;
    END IF;

    SELECT id INTO v_ING6316 FROM materias WHERE codigo = 'ING6316';
    IF v_ING6316 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Introducción a la Inteligencia Artificial', 'ING6316', false)
        RETURNING id INTO v_ING6316;
    END IF;

    SELECT id INTO v_ING6309 FROM materias WHERE codigo = 'ING6309';
    IF v_ING6309 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Redes y Comunicación de Datos B', 'ING6309', false)
        RETURNING id INTO v_ING6309;
    END IF;

    SELECT id INTO v_ING6310 FROM materias WHERE codigo = 'ING6310';
    IF v_ING6310 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis y Diseño de Sistemas B', 'ING6310', false)
        RETURNING id INTO v_ING6310;
    END IF;

    SELECT id INTO v_ING8402 FROM materias WHERE codigo = 'ING8402';
    IF v_ING8402 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Comportamiento Organizacional y Relaciones del Trabajo', 'ING8402', false)
        RETURNING id INTO v_ING8402;
    END IF;

    SELECT id INTO v_ING6411 FROM materias WHERE codigo = 'ING6411';
    IF v_ING6411 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Calidad de Software B', 'ING6411', false)
        RETURNING id INTO v_ING6411;
    END IF;

    SELECT id INTO v_ING6401 FROM materias WHERE codigo = 'ING6401';
    IF v_ING6401 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Gestión de Proyectos Informáticos', 'ING6401', false)
        RETURNING id INTO v_ING6401;
    END IF;

    SELECT id INTO v_ING6312 FROM materias WHERE codigo = 'ING6312';
    IF v_ING6312 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Gestión de la Seguridad Informática', 'ING6312', false)
        RETURNING id INTO v_ING6312;
    END IF;

    SELECT id INTO v_ING6313 FROM materias WHERE codigo = 'ING6313';
    IF v_ING6313 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Diseño e Implementación de Sistemas Distribuidos', 'ING6313', false)
        RETURNING id INTO v_ING6313;
    END IF;

    SELECT id INTO v_ING6314 FROM materias WHERE codigo = 'ING6314';
    IF v_ING6314 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Trabajo Final Integrador', 'ING6314', false)
        RETURNING id INTO v_ING6314;
    END IF;

    SELECT id INTO v_ING6209 FROM materias WHERE codigo = 'ING6209';
    IF v_ING6209 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Teoría de Modelos y Simulación', 'ING6209', false)
        RETURNING id INTO v_ING6209;
    END IF;

    SELECT id INTO v_ING8405 FROM materias WHERE codigo = 'ING8405';
    IF v_ING8405 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Ética, Legislación y Propiedad Intelectual en el Ejercicio Profesional', 'ING8405', false)
        RETURNING id INTO v_ING8405;
    END IF;

    SELECT id INTO v_ING6315 FROM materias WHERE codigo = 'ING6315';
    IF v_ING6315 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Auditoría y Homologación', 'ING6315', false)
        RETURNING id INTO v_ING6315;
    END IF;

    SELECT id INTO v_ING8412 FROM materias WHERE codigo = 'ING8412';
    IF v_ING8412 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Seguridad y Salud Ocupacional', 'ING8412', false)
        RETURNING id INTO v_ING8412;
    END IF;

    SELECT id INTO v_ING6501 FROM materias WHERE codigo = 'ING6501';
    IF v_ING6501 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Optativa I', 'ING6501', false)
        RETURNING id INTO v_ING6501;
    END IF;

    SELECT id INTO v_ING6502 FROM materias WHERE codigo = 'ING6502';
    IF v_ING6502 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Optativa II', 'ING6502', false)
        RETURNING id INTO v_ING6502;
    END IF;

    SELECT id INTO v_ING6503 FROM materias WHERE codigo = 'ING6503';
    IF v_ING6503 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Optativa III', 'ING6503', false)
        RETURNING id INTO v_ING6503;
    END IF;

    -- 3. Vincular materias al plan (plan_materia)
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM101, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM105, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6102, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6301, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM102, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM106, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6201, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM107, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF101, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6202, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6302, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8408, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM108, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF103, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6203, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6204, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6205, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8409, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8410, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6207, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6303, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6208, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4801, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6304, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6305, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6306, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6307, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6316, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6309, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6310, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8402, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6411, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6401, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6312, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6313, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6314, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6209, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8405, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6315, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8412, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6501, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6502, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6503, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;

    -- 4. Insertar Correlativas
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM102, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM106, v_INGM105)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6201, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6201, v_INGM105)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6201, v_ING6102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM107, v_INGM105)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM107, v_ING6102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF101, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF101, v_INGM105)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6202, v_ING6201)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6202, v_INGM107)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6302, v_ING6301)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6302, v_ING6201)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM108, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF103, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF103, v_INGM106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF103, v_INGF101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6203, v_INGM108)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6203, v_ING6202)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6204, v_INGF101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6204, v_ING6202)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6205, v_ING6202)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6205, v_ING6302)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8409, v_ING8408)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8410, v_INGM108)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6207, v_ING6202)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): Teoría de la Información y la Comunicación
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6303, v_ING6204)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6303, v_ING6205)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6208, v_ING6202)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6208, v_ING6204)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4801, v_ING8410)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6304, v_ING6205)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6305, v_INGF103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6305, v_ING6303)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6306, v_ING6205)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6307, v_ING6207)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6316, v_ING6205)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6309, v_ING6305)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6310, v_ING6306)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6310, v_ING4801)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8402, v_ING6306)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6411, v_ING6304)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6411, v_ING6307)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6411, v_ING6309)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6401, v_ING6310)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6312, v_ING6305)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6313, v_ING6309)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6313, v_ING6310)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6314, v_ING6401)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6209, v_INGM108)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6209, v_ING6313)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8405, v_INGM108)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6315, v_ING6304)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6315, v_ING6312)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6315, v_ING6401)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8412, v_ING8402)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): (**)
    -- No se encontró correlativa en la lista (se ignora): (**)
    -- No se encontró correlativa en la lista (se ignora): (**)
END $$;

-- INGENIERIA QUIMICA

-- Carga de Materias y Correlativas para Plan 2024 - Carrera 9
-- Generado por generate_plan_sql.py

DO $$
DECLARE
    v_plan_id int;
    v_INGM101 int;
    v_INGM105 int;
    v_ING1101 int;
    v_ING1502 int;
    v_INGM102 int;
    v_INGM106 int;
    v_INGF101 int;
    v_ING1201 int;
    v_INGM103 int;
    v_ING1307 int;
    v_ING6101 int;
    v_INGF103 int;
    v_ING1102 int;
    v_ING1503 int;
    v_ING1206 int;
    v_ING1211 int;
    v_ING1202 int;
    v_INGF105 int;
    v_ING8408 int;
    v_ING1501 int;
    v_INGM109 int;
    v_ING1301 int;
    v_ING8411 int;
    v_ING1212 int;
    v_ING1504 int;
    v_ING1302 int;
    v_INGM108 int;
    v_ING8409 int;
    v_ING1315 int;
    v_ING1313 int;
    v_ING1303 int;
    v_ING8406 int;
    v_ING8405 int;
    v_ING1505 int;
    v_ING1314 int;
    v_ING1210 int;
    v_ING1204 int;
    v_ING8413 int;
    v_ING1209 int;
    v_ING1306 int;
    v_ING1506 int;
    v_ING8412 int;
    v_ING1312 int;

BEGIN
    -- 1. Buscar o crear Plan de Estudios para carrera 9
    SELECT id INTO v_plan_id FROM plan_estudios
    WHERE carrera_id = 9 AND anio_vigencia = 2024 LIMIT 1;
    IF v_plan_id IS NULL THEN
        INSERT INTO plan_estudios (carrera_id, nombre, anio_vigencia, activo)
        VALUES (9, 'Plan 2024', 2024, true)
        RETURNING id INTO v_plan_id;
    END IF;

    -- 2. Insertar o reutilizar Materias (identificadas por codigo)
    SELECT id INTO v_INGM101 FROM materias WHERE codigo = 'INGM101';
    IF v_INGM101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático I', 'INGM101', false)
        RETURNING id INTO v_INGM101;
    END IF;

    SELECT id INTO v_INGM105 FROM materias WHERE codigo = 'INGM105';
    IF v_INGM105 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Álgebra I-B', 'INGM105', false)
        RETURNING id INTO v_INGM105;
    END IF;

    SELECT id INTO v_ING1101 FROM materias WHERE codigo = 'ING1101';
    IF v_ING1101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Química General e Inorgánica', 'ING1101', false)
        RETURNING id INTO v_ING1101;
    END IF;

    SELECT id INTO v_ING1502 FROM materias WHERE codigo = 'ING1502';
    IF v_ING1502 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Taller de Ingeniería I (anual)', 'ING1502', false)
        RETURNING id INTO v_ING1502;
    END IF;

    SELECT id INTO v_INGM102 FROM materias WHERE codigo = 'INGM102';
    IF v_INGM102 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático II', 'INGM102', false)
        RETURNING id INTO v_INGM102;
    END IF;

    SELECT id INTO v_INGM106 FROM materias WHERE codigo = 'INGM106';
    IF v_INGM106 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Álgebra II', 'INGM106', false)
        RETURNING id INTO v_INGM106;
    END IF;

    SELECT id INTO v_INGF101 FROM materias WHERE codigo = 'INGF101';
    IF v_INGF101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física A', 'INGF101', false)
        RETURNING id INTO v_INGF101;
    END IF;

    SELECT id INTO v_ING1201 FROM materias WHERE codigo = 'ING1201';
    IF v_ING1201 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fisicoquímica I', 'ING1201', false)
        RETURNING id INTO v_ING1201;
    END IF;

    SELECT id INTO v_INGM103 FROM materias WHERE codigo = 'INGM103';
    IF v_INGM103 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático III', 'INGM103', false)
        RETURNING id INTO v_INGM103;
    END IF;

    SELECT id INTO v_ING1307 FROM materias WHERE codigo = 'ING1307';
    IF v_ING1307 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Balances de Masa y Energía', 'ING1307', false)
        RETURNING id INTO v_ING1307;
    END IF;

    SELECT id INTO v_ING6101 FROM materias WHERE codigo = 'ING6101';
    IF v_ING6101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fundamentos de la Programación', 'ING6101', false)
        RETURNING id INTO v_ING6101;
    END IF;

    SELECT id INTO v_INGF103 FROM materias WHERE codigo = 'INGF103';
    IF v_INGF103 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física B-II', 'INGF103', false)
        RETURNING id INTO v_INGF103;
    END IF;

    SELECT id INTO v_ING1102 FROM materias WHERE codigo = 'ING1102';
    IF v_ING1102 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Sistemas de Representación en Plantas de Procesos', 'ING1102', false)
        RETURNING id INTO v_ING1102;
    END IF;

    SELECT id INTO v_ING1503 FROM materias WHERE codigo = 'ING1503';
    IF v_ING1503 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Taller de Ingeniería II (anual)', 'ING1503', false)
        RETURNING id INTO v_ING1503;
    END IF;

    SELECT id INTO v_ING1206 FROM materias WHERE codigo = 'ING1206';
    IF v_ING1206 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Química del Carbono', 'ING1206', false)
        RETURNING id INTO v_ING1206;
    END IF;

    SELECT id INTO v_ING1211 FROM materias WHERE codigo = 'ING1211';
    IF v_ING1211 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Termodinámica I', 'ING1211', false)
        RETURNING id INTO v_ING1211;
    END IF;

    SELECT id INTO v_ING1202 FROM materias WHERE codigo = 'ING1202';
    IF v_ING1202 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fisicoquímica II', 'ING1202', false)
        RETURNING id INTO v_ING1202;
    END IF;

    SELECT id INTO v_INGF105 FROM materias WHERE codigo = 'INGF105';
    IF v_INGF105 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física C-II', 'INGF105', false)
        RETURNING id INTO v_INGF105;
    END IF;

    SELECT id INTO v_ING8408 FROM materias WHERE codigo = 'ING8408';
    IF v_ING8408 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Inglés I', 'ING8408', false)
        RETURNING id INTO v_ING8408;
    END IF;

    SELECT id INTO v_ING1501 FROM materias WHERE codigo = 'ING1501';
    IF v_ING1501 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Operación de Plantas de Procesos', 'ING1501', false)
        RETURNING id INTO v_ING1501;
    END IF;

    SELECT id INTO v_INGM109 FROM materias WHERE codigo = 'INGM109';
    IF v_INGM109 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Métodos Numéricos para Ingeniería', 'INGM109', false)
        RETURNING id INTO v_INGM109;
    END IF;

    SELECT id INTO v_ING1301 FROM materias WHERE codigo = 'ING1301';
    IF v_ING1301 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Operaciones Unitarias I', 'ING1301', false)
        RETURNING id INTO v_ING1301;
    END IF;

    SELECT id INTO v_ING8411 FROM materias WHERE codigo = 'ING8411';
    IF v_ING8411 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Organización Empresarial e Industrial', 'ING8411', false)
        RETURNING id INTO v_ING8411;
    END IF;

    SELECT id INTO v_ING1212 FROM materias WHERE codigo = 'ING1212';
    IF v_ING1212 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Termodinámica II', 'ING1212', false)
        RETURNING id INTO v_ING1212;
    END IF;

    SELECT id INTO v_ING1504 FROM materias WHERE codigo = 'ING1504';
    IF v_ING1504 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Taller de Ingeniería III (anual)', 'ING1504', false)
        RETURNING id INTO v_ING1504;
    END IF;

    SELECT id INTO v_ING1302 FROM materias WHERE codigo = 'ING1302';
    IF v_ING1302 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Operaciones Unitarias II', 'ING1302', false)
        RETURNING id INTO v_ING1302;
    END IF;

    SELECT id INTO v_INGM108 FROM materias WHERE codigo = 'INGM108';
    IF v_INGM108 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Probabilidad y Estadística', 'INGM108', false)
        RETURNING id INTO v_INGM108;
    END IF;

    SELECT id INTO v_ING8409 FROM materias WHERE codigo = 'ING8409';
    IF v_ING8409 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Inglés II', 'ING8409', false)
        RETURNING id INTO v_ING8409;
    END IF;

    SELECT id INTO v_ING1315 FROM materias WHERE codigo = 'ING1315';
    IF v_ING1315 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Ingeniería de Sistemas de Procesos', 'ING1315', false)
        RETURNING id INTO v_ING1315;
    END IF;

    SELECT id INTO v_ING1313 FROM materias WHERE codigo = 'ING1313';
    IF v_ING1313 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Ingeniería de Reacciones Químicas I', 'ING1313', false)
        RETURNING id INTO v_ING1313;
    END IF;

    SELECT id INTO v_ING1303 FROM materias WHERE codigo = 'ING1303';
    IF v_ING1303 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Operaciones Unitarias III', 'ING1303', false)
        RETURNING id INTO v_ING1303;
    END IF;

    SELECT id INTO v_ING8406 FROM materias WHERE codigo = 'ING8406';
    IF v_ING8406 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Formulación y Evaluación de Proyectos de Inversión', 'ING8406', false)
        RETURNING id INTO v_ING8406;
    END IF;

    SELECT id INTO v_ING8405 FROM materias WHERE codigo = 'ING8405';
    IF v_ING8405 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Ética, Legislación y Propiedad Intelectual en el Ejercicio Profesional', 'ING8405', false)
        RETURNING id INTO v_ING8405;
    END IF;

    SELECT id INTO v_ING1505 FROM materias WHERE codigo = 'ING1505';
    IF v_ING1505 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Taller de Proyectos de Ingeniería Química (anual)', 'ING1505', false)
        RETURNING id INTO v_ING1505;
    END IF;

    SELECT id INTO v_ING1314 FROM materias WHERE codigo = 'ING1314';
    IF v_ING1314 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Ingeniería de Reacciones Químicas II', 'ING1314', false)
        RETURNING id INTO v_ING1314;
    END IF;

    SELECT id INTO v_ING1210 FROM materias WHERE codigo = 'ING1210';
    IF v_ING1210 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Química Biológica y Microbiología', 'ING1210', false)
        RETURNING id INTO v_ING1210;
    END IF;

    SELECT id INTO v_ING1204 FROM materias WHERE codigo = 'ING1204';
    IF v_ING1204 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Técnicas de Análisis Fisicoquímicos', 'ING1204', false)
        RETURNING id INTO v_ING1204;
    END IF;

    SELECT id INTO v_ING8413 FROM materias WHERE codigo = 'ING8413';
    IF v_ING8413 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Sistemas de Gestión Integrados', 'ING8413', false)
        RETURNING id INTO v_ING8413;
    END IF;

    SELECT id INTO v_ING1209 FROM materias WHERE codigo = 'ING1209';
    IF v_ING1209 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Tecnología de los Materiales', 'ING1209', false)
        RETURNING id INTO v_ING1209;
    END IF;

    SELECT id INTO v_ING1306 FROM materias WHERE codigo = 'ING1306';
    IF v_ING1306 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Ingeniería de Procesos Biotecnológicos', 'ING1306', false)
        RETURNING id INTO v_ING1306;
    END IF;

    SELECT id INTO v_ING1506 FROM materias WHERE codigo = 'ING1506';
    IF v_ING1506 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Proyecto Integrador de Ingeniería Química (anual)', 'ING1506', false)
        RETURNING id INTO v_ING1506;
    END IF;

    SELECT id INTO v_ING8412 FROM materias WHERE codigo = 'ING8412';
    IF v_ING8412 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Seguridad y Salud Ocupacional', 'ING8412', false)
        RETURNING id INTO v_ING8412;
    END IF;

    SELECT id INTO v_ING1312 FROM materias WHERE codigo = 'ING1312';
    IF v_ING1312 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Dinámica, Instrumentación y Control de Procesos', 'ING1312', false)
        RETURNING id INTO v_ING1312;
    END IF;

    -- 3. Vincular materias al plan (plan_materia)
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM101, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM105, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1101, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1502, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM102, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM106, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF101, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1201, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM103, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1307, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6101, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF103, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1102, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1503, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1206, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1211, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1202, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF105, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8408, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1501, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM109, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1301, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8411, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1212, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1504, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1302, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM108, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8409, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1315, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1313, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1303, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8406, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8405, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1505, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1314, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1210, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1204, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8413, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1209, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1306, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1506, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8412, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1312, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;

    -- 4. Insertar Correlativas
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM102, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM106, v_INGM105)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF101, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF101, v_INGM105)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1201, v_ING1101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM103, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM103, v_INGM106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1307, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1307, v_INGF101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1307, v_ING1101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6101, v_INGM105)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF103, v_INGM106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF103, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF103, v_INGF101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1102, v_ING1101)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): Taller de Ingeniería I
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1206, v_ING1201)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1211, v_ING1307)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1211, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1202, v_ING1201)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1202, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF105, v_INGF103)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1501, v_INGF103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1501, v_ING1307)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1501, v_ING1102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM109, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM109, v_ING6101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1301, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1301, v_ING1501)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8411, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1212, v_ING1211)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): Taller de Ingeniería II
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1302, v_ING1211)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1302, v_ING1301)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM108, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8409, v_ING8408)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1315, v_INGM109)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1315, v_ING1211)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1315, v_ING1202)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1313, v_ING1202)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1303, v_ING1501)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1303, v_ING1212)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8406, v_ING8411)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): Taller de Ingeniería III
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8405, v_INGM103)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): Taller de Ingeniería III
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1505, v_ING1211)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1505, v_ING1202)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): Ingeniería de las Reacciones Químicas I
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1314, v_ING1303)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1210, v_ING1206)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1204, v_ING1206)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8413, v_ING8411)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1209, v_INGF103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1209, v_ING1201)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1306, v_ING1202)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1306, v_ING1210)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): Taller de Proyectos de Ingeniería Química
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1506, v_ING1315)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): Ingeniería de las Reacciones Químicas I
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1506, v_ING1303)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8412, v_ING8411)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1312, v_ING1302)
    ON CONFLICT DO NOTHING;
END $$;

-- Ingenieria electronica

-- Carga de Materias y Correlativas para Plan 2024 - Carrera 10
-- Generado por generate_plan_sql.py

DO $$
DECLARE
    v_plan_id int;
    v_INGM101 int;
    v_INGM104 int;
    v_ING1103 int;
    v_ING4201 int;
    v_ING8408 int;
    v_INGM102 int;
    v_INGM106 int;
    v_INGF101 int;
    v_ING6102 int;
    v_ING4202 int;
    v_ING8409 int;
    v_INGM103 int;
    v_INGF102 int;
    v_INGM109 int;
    v_ING4203 int;
    v_ING4218 int;
    v_ING4204 int;
    v_ING4205 int;
    v_INGF104 int;
    v_ING4206 int;
    v_ING4207 int;
    v_ING4208 int;
    v_ING4209 int;
    v_ING4210 int;
    v_ING4101 int;
    v_ING4401 int;
    v_ING4211 int;
    v_ING4212 int;
    v_ING4213 int;
    v_ING4214 int;
    v_ING4301 int;
    v_ING4302 int;
    v_ING4303 int;
    v_ING8411 int;
    v_ING4215 int;
    v_ING4304 int;
    v_ING4305 int;
    v_ING4307 int;
    v_ING4306 int;
    v_ING8412 int;
    v_ING8403 int;
    v_ING4326 int;
    v_ING4328 int;
    v_ING4329 int;
    v_ING4308 int;
    v_ING8405 int;
    v_ING4327 int;
    v_ING4330 int;
    v_carrera_id int;
BEGIN
    SELECT id INTO v_carrera_id FROM carreras WHERE nombre = 'Ingenieria Electronica' LIMIT 1;
    -- 1. Buscar o crear Plan de Estudios para carrera 10
    SELECT id INTO v_plan_id FROM plan_estudios
    WHERE carrera_id = v_carrera_id AND anio_vigencia = 2024 LIMIT 1;
    IF v_plan_id IS NULL THEN
        INSERT INTO plan_estudios (carrera_id, nombre, anio_vigencia, activo)
        VALUES (v_carrera_id, 'Plan 2024', 2024, true)
        RETURNING id INTO v_plan_id;
    END IF;

    -- 2. Insertar o reutilizar Materias (identificadas por codigo)
    SELECT id INTO v_INGM101 FROM materias WHERE codigo = 'INGM101';
    IF v_INGM101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático I', 'INGM101', false)
        RETURNING id INTO v_INGM101;
    END IF;

    SELECT id INTO v_INGM104 FROM materias WHERE codigo = 'INGM104';
    IF v_INGM104 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Álgebra I-A', 'INGM104', false)
        RETURNING id INTO v_INGM104;
    END IF;

    SELECT id INTO v_ING1103 FROM materias WHERE codigo = 'ING1103';
    IF v_ING1103 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fundamentos de Química', 'ING1103', false)
        RETURNING id INTO v_ING1103;
    END IF;

    SELECT id INTO v_ING4201 FROM materias WHERE codigo = 'ING4201';
    IF v_ING4201 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Proyecto Transversal I', 'ING4201', false)
        RETURNING id INTO v_ING4201;
    END IF;

    SELECT id INTO v_ING8408 FROM materias WHERE codigo = 'ING8408';
    IF v_ING8408 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Inglés I', 'ING8408', false)
        RETURNING id INTO v_ING8408;
    END IF;

    SELECT id INTO v_INGM102 FROM materias WHERE codigo = 'INGM102';
    IF v_INGM102 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático II', 'INGM102', false)
        RETURNING id INTO v_INGM102;
    END IF;

    SELECT id INTO v_INGM106 FROM materias WHERE codigo = 'INGM106';
    IF v_INGM106 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Álgebra II', 'INGM106', false)
        RETURNING id INTO v_INGM106;
    END IF;

    SELECT id INTO v_INGF101 FROM materias WHERE codigo = 'INGF101';
    IF v_INGF101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física A', 'INGF101', false)
        RETURNING id INTO v_INGF101;
    END IF;

    SELECT id INTO v_ING6102 FROM materias WHERE codigo = 'ING6102';
    IF v_ING6102 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Informática Básica', 'ING6102', false)
        RETURNING id INTO v_ING6102;
    END IF;

    SELECT id INTO v_ING4202 FROM materias WHERE codigo = 'ING4202';
    IF v_ING4202 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Proyecto Transversal II', 'ING4202', false)
        RETURNING id INTO v_ING4202;
    END IF;

    SELECT id INTO v_ING8409 FROM materias WHERE codigo = 'ING8409';
    IF v_ING8409 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Inglés II', 'ING8409', false)
        RETURNING id INTO v_ING8409;
    END IF;

    SELECT id INTO v_INGM103 FROM materias WHERE codigo = 'INGM103';
    IF v_INGM103 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático III', 'INGM103', false)
        RETURNING id INTO v_INGM103;
    END IF;

    SELECT id INTO v_INGF102 FROM materias WHERE codigo = 'INGF102';
    IF v_INGF102 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física B-I', 'INGF102', false)
        RETURNING id INTO v_INGF102;
    END IF;

    SELECT id INTO v_INGM109 FROM materias WHERE codigo = 'INGM109';
    IF v_INGM109 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Métodos Numéricos para Ingeniería', 'INGM109', false)
        RETURNING id INTO v_INGM109;
    END IF;

    SELECT id INTO v_ING4203 FROM materias WHERE codigo = 'ING4203';
    IF v_ING4203 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Proyecto Transversal III', 'ING4203', false)
        RETURNING id INTO v_ING4203;
    END IF;

    SELECT id INTO v_ING4218 FROM materias WHERE codigo = 'ING4218';
    IF v_ING4218 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Programación I', 'ING4218', false)
        RETURNING id INTO v_ING4218;
    END IF;

    SELECT id INTO v_ING4204 FROM materias WHERE codigo = 'ING4204';
    IF v_ING4204 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Proyecto Transversal IV', 'ING4204', false)
        RETURNING id INTO v_ING4204;
    END IF;

    SELECT id INTO v_ING4205 FROM materias WHERE codigo = 'ING4205';
    IF v_ING4205 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Teoría de Señales y Sistemas', 'ING4205', false)
        RETURNING id INTO v_ING4205;
    END IF;

    SELECT id INTO v_INGF104 FROM materias WHERE codigo = 'INGF104';
    IF v_INGF104 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física C-I', 'INGF104', false)
        RETURNING id INTO v_INGF104;
    END IF;

    SELECT id INTO v_ING4206 FROM materias WHERE codigo = 'ING4206';
    IF v_ING4206 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis de Circuitos', 'ING4206', false)
        RETURNING id INTO v_ING4206;
    END IF;

    SELECT id INTO v_ING4207 FROM materias WHERE codigo = 'ING4207';
    IF v_ING4207 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Filtros Analógicos', 'ING4207', false)
        RETURNING id INTO v_ING4207;
    END IF;

    SELECT id INTO v_ING4208 FROM materias WHERE codigo = 'ING4208';
    IF v_ING4208 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Probabilidad, Estadística y Procesos Estocásticos', 'ING4208', false)
        RETURNING id INTO v_ING4208;
    END IF;

    SELECT id INTO v_ING4209 FROM materias WHERE codigo = 'ING4209';
    IF v_ING4209 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Dispositivos Semiconductores', 'ING4209', false)
        RETURNING id INTO v_ING4209;
    END IF;

    SELECT id INTO v_ING4210 FROM materias WHERE codigo = 'ING4210';
    IF v_ING4210 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Tecnología Electrónica', 'ING4210', false)
        RETURNING id INTO v_ING4210;
    END IF;

    SELECT id INTO v_ING4101 FROM materias WHERE codigo = 'ING4101';
    IF v_ING4101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Proyecto Transversal V', 'ING4101', false)
        RETURNING id INTO v_ING4101;
    END IF;

    SELECT id INTO v_ING4401 FROM materias WHERE codigo = 'ING4401';
    IF v_ING4401 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Proyecto Transversal VI', 'ING4401', false)
        RETURNING id INTO v_ING4401;
    END IF;

    SELECT id INTO v_ING4211 FROM materias WHERE codigo = 'ING4211';
    IF v_ING4211 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Introducción al Tratamiento Digital de Señales', 'ING4211', false)
        RETURNING id INTO v_ING4211;
    END IF;

    SELECT id INTO v_ING4212 FROM materias WHERE codigo = 'ING4212';
    IF v_ING4212 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Líneas de Transmisión y Antenas', 'ING4212', false)
        RETURNING id INTO v_ING4212;
    END IF;

    SELECT id INTO v_ING4213 FROM materias WHERE codigo = 'ING4213';
    IF v_ING4213 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Electrónica Digital', 'ING4213', false)
        RETURNING id INTO v_ING4213;
    END IF;

    SELECT id INTO v_ING4214 FROM materias WHERE codigo = 'ING4214';
    IF v_ING4214 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Electrónica Aplicada', 'ING4214', false)
        RETURNING id INTO v_ING4214;
    END IF;

    SELECT id INTO v_ING4301 FROM materias WHERE codigo = 'ING4301';
    IF v_ING4301 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Técnicas y Dispositivos Digitales', 'ING4301', false)
        RETURNING id INTO v_ING4301;
    END IF;

    SELECT id INTO v_ING4302 FROM materias WHERE codigo = 'ING4302';
    IF v_ING4302 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Sistemas y Circuitos Electrónicos', 'ING4302', false)
        RETURNING id INTO v_ING4302;
    END IF;

    SELECT id INTO v_ING4303 FROM materias WHERE codigo = 'ING4303';
    IF v_ING4303 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Sistemas de Comunicaciones', 'ING4303', false)
        RETURNING id INTO v_ING4303;
    END IF;

    SELECT id INTO v_ING8411 FROM materias WHERE codigo = 'ING8411';
    IF v_ING8411 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Organización Empresarial e Industrial', 'ING8411', false)
        RETURNING id INTO v_ING8411;
    END IF;

    SELECT id INTO v_ING4215 FROM materias WHERE codigo = 'ING4215';
    IF v_ING4215 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Instrumentación y Mediciones Electrónicas I', 'ING4215', false)
        RETURNING id INTO v_ING4215;
    END IF;

    SELECT id INTO v_ING4304 FROM materias WHERE codigo = 'ING4304';
    IF v_ING4304 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Instrumentación y Mediciones Electrónicas II', 'ING4304', false)
        RETURNING id INTO v_ING4304;
    END IF;

    SELECT id INTO v_ING4305 FROM materias WHERE codigo = 'ING4305';
    IF v_ING4305 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Redes de Datos', 'ING4305', false)
        RETURNING id INTO v_ING4305;
    END IF;

    SELECT id INTO v_ING4307 FROM materias WHERE codigo = 'ING4307';
    IF v_ING4307 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Introducción a la Arquitectura de Computadoras', 'ING4307', false)
        RETURNING id INTO v_ING4307;
    END IF;

    SELECT id INTO v_ING4306 FROM materias WHERE codigo = 'ING4306';
    IF v_ING4306 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Control Automático', 'ING4306', false)
        RETURNING id INTO v_ING4306;
    END IF;

    SELECT id INTO v_ING8412 FROM materias WHERE codigo = 'ING8412';
    IF v_ING8412 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Seguridad y Salud Ocupacional', 'ING8412', false)
        RETURNING id INTO v_ING8412;
    END IF;

    SELECT id INTO v_ING8403 FROM materias WHERE codigo = 'ING8403';
    IF v_ING8403 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Economía para Ingeniería', 'ING8403', false)
        RETURNING id INTO v_ING8403;
    END IF;

    SELECT id INTO v_ING4326 FROM materias WHERE codigo = 'ING4326';
    IF v_ING4326 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Optativa I', 'ING4326', false)
        RETURNING id INTO v_ING4326;
    END IF;

    SELECT id INTO v_ING4328 FROM materias WHERE codigo = 'ING4328';
    IF v_ING4328 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Electiva I', 'ING4328', false)
        RETURNING id INTO v_ING4328;
    END IF;

    SELECT id INTO v_ING4329 FROM materias WHERE codigo = 'ING4329';
    IF v_ING4329 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Electiva II', 'ING4329', false)
        RETURNING id INTO v_ING4329;
    END IF;

    SELECT id INTO v_ING4308 FROM materias WHERE codigo = 'ING4308';
    IF v_ING4308 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Proyecto Final (ANUAL)', 'ING4308', false)
        RETURNING id INTO v_ING4308;
    END IF;

    SELECT id INTO v_ING8405 FROM materias WHERE codigo = 'ING8405';
    IF v_ING8405 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Ética, Legislación y Propiedad Intelectual en el Ejercicio Profesional', 'ING8405', false)
        RETURNING id INTO v_ING8405;
    END IF;

    SELECT id INTO v_ING4327 FROM materias WHERE codigo = 'ING4327';
    IF v_ING4327 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Optativa II', 'ING4327', false)
        RETURNING id INTO v_ING4327;
    END IF;

    SELECT id INTO v_ING4330 FROM materias WHERE codigo = 'ING4330';
    IF v_ING4330 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Electiva III', 'ING4330', false)
        RETURNING id INTO v_ING4330;
    END IF;

    -- 3. Vincular materias al plan (plan_materia)
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM101, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM104, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1103, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4201, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8408, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM102, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM106, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF101, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6102, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4202, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8409, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM103, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF102, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM109, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4203, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4218, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4204, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4205, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF104, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4206, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4207, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4208, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4209, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4210, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4101, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4401, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4211, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4212, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4213, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4214, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4301, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4302, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4303, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8411, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4215, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4304, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4305, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4307, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4306, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8412, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8403, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4326, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4328, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4329, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4308, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8405, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4327, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4330, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;

    -- 4. Insertar Correlativas
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM102, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM106, v_INGM104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF101, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF101, v_INGM104)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4202, v_ING4201)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8409, v_ING8408)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM103, v_INGM106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM103, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF102, v_INGM106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF102, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF102, v_INGF101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM109, v_ING6102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM109, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4203, v_ING4202)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4218, v_ING6102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4218, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4204, v_ING4203)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4205, v_INGF102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4205, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF104, v_INGF102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4206, v_INGF102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4207, v_ING4206)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4207, v_ING4205)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4208, v_ING4205)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4208, v_INGM109)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4209, v_ING4206)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4209, v_ING4205)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4209, v_INGF104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4210, v_ING4206)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4101, v_ING4204)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4401, v_ING4101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4211, v_ING4205)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4211, v_ING4207)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4212, v_INGF104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4213, v_ING4207)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4213, v_ING4209)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4214, v_ING4209)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4301, v_ING4213)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4302, v_ING4214)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4302, v_ING4207)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4303, v_ING4208)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4303, v_ING4212)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8411, v_ING4401)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4215, v_ING4213)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4215, v_ING4214)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4304, v_ING4215)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4304, v_ING4302)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4305, v_ING4303)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4307, v_ING4301)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4307, v_ING4302)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4306, v_ING4214)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4306, v_ING4211)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8412, v_ING8411)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8403, v_INGM103)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): (++)
    -- No se encontró correlativa en la lista (se ignora): (++)
    -- No se encontró correlativa en la lista (se ignora): (++)
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4308, v_ING4302)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4308, v_ING4306)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4308, v_ING4303)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4308, v_ING4210)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8405, v_INGM103)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): (++)
    -- No se encontró correlativa en la lista (se ignora): (++)
END $$;

-- INGENIERIA ALIMENTOS

-- Carga de Materias y Correlativas para Plan 2024 - Carrera 11
-- Generado por generate_plan_sql.py

DO $$
DECLARE
    v_plan_id int;
    v_INGM101 int;
    v_INGM105 int;
    v_ING1101 int;
    v_ING1502 int;
    v_INGM102 int;
    v_INGM106 int;
    v_INGF101 int;
    v_ING1201 int;
    v_INGM103 int;
    v_ING1307 int;
    v_ING6101 int;
    v_INGF103 int;
    v_ING1102 int;
    v_ING1503 int;
    v_ING1207 int;
    v_ING1206 int;
    v_ING1202 int;
    v_INGF105 int;
    v_ING8408 int;
    v_ING1501 int;
    v_INGM109 int;
    v_ING1301 int;
    v_ING1208 int;
    v_ING1205 int;
    v_ING1504 int;
    v_ING1302 int;
    v_INGM108 int;
    v_ING1204 int;
    v_ING1305 int;
    v_ING1304 int;
    v_ING1303 int;
    v_ING1203 int;
    v_ING8411 int;
    v_ING8405 int;
    v_ING1308 int;
    v_ING1309 int;
    v_ING8413 int;
    v_ING8409 int;
    v_ING1306 int;
    v_ING1310 int;
    v_ING1401 int;
    v_ING8406 int;
    v_ING1507 int;
    v_ING1311 int;
    v_ING8412 int;
    v_carrera_id int;
BEGIN
    SELECT id INTO v_carrera_id FROM carreras WHERE nombre = 'Ingenieria en Alimentos' LIMIT 1;
    -- 1. Buscar o crear Plan de Estudios para carrera 11
    SELECT id INTO v_plan_id FROM plan_estudios
    WHERE carrera_id = v_carrera_id AND anio_vigencia = 2024 LIMIT 1;
    IF v_plan_id IS NULL THEN
        INSERT INTO plan_estudios (carrera_id, nombre, anio_vigencia, activo)
        VALUES (v_carrera_id, 'Plan 2024', 2024, true)
        RETURNING id INTO v_plan_id;
    END IF;

    -- 2. Insertar o reutilizar Materias (identificadas por codigo)
    SELECT id INTO v_INGM101 FROM materias WHERE codigo = 'INGM101';
    IF v_INGM101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático I', 'INGM101', false)
        RETURNING id INTO v_INGM101;
    END IF;

    SELECT id INTO v_INGM105 FROM materias WHERE codigo = 'INGM105';
    IF v_INGM105 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Álgebra I-B', 'INGM105', false)
        RETURNING id INTO v_INGM105;
    END IF;

    SELECT id INTO v_ING1101 FROM materias WHERE codigo = 'ING1101';
    IF v_ING1101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Química General e Inorgánica', 'ING1101', false)
        RETURNING id INTO v_ING1101;
    END IF;

    SELECT id INTO v_ING1502 FROM materias WHERE codigo = 'ING1502';
    IF v_ING1502 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Taller de Ingeniería I (Anual)', 'ING1502', false)
        RETURNING id INTO v_ING1502;
    END IF;

    SELECT id INTO v_INGM102 FROM materias WHERE codigo = 'INGM102';
    IF v_INGM102 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático II', 'INGM102', false)
        RETURNING id INTO v_INGM102;
    END IF;

    SELECT id INTO v_INGM106 FROM materias WHERE codigo = 'INGM106';
    IF v_INGM106 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Álgebra II', 'INGM106', false)
        RETURNING id INTO v_INGM106;
    END IF;

    SELECT id INTO v_INGF101 FROM materias WHERE codigo = 'INGF101';
    IF v_INGF101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física A', 'INGF101', false)
        RETURNING id INTO v_INGF101;
    END IF;

    SELECT id INTO v_ING1201 FROM materias WHERE codigo = 'ING1201';
    IF v_ING1201 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fisicoquímica I', 'ING1201', false)
        RETURNING id INTO v_ING1201;
    END IF;

    SELECT id INTO v_INGM103 FROM materias WHERE codigo = 'INGM103';
    IF v_INGM103 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático III', 'INGM103', false)
        RETURNING id INTO v_INGM103;
    END IF;

    SELECT id INTO v_ING1307 FROM materias WHERE codigo = 'ING1307';
    IF v_ING1307 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Balances de Masa y Energía', 'ING1307', false)
        RETURNING id INTO v_ING1307;
    END IF;

    SELECT id INTO v_ING6101 FROM materias WHERE codigo = 'ING6101';
    IF v_ING6101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fundamentos de Programación', 'ING6101', false)
        RETURNING id INTO v_ING6101;
    END IF;

    SELECT id INTO v_INGF103 FROM materias WHERE codigo = 'INGF103';
    IF v_INGF103 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física B-II', 'INGF103', false)
        RETURNING id INTO v_INGF103;
    END IF;

    SELECT id INTO v_ING1102 FROM materias WHERE codigo = 'ING1102';
    IF v_ING1102 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Sistemas de Representación en Plantas de Procesos', 'ING1102', false)
        RETURNING id INTO v_ING1102;
    END IF;

    SELECT id INTO v_ING1503 FROM materias WHERE codigo = 'ING1503';
    IF v_ING1503 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Taller de Ingeniería II (Anual)', 'ING1503', false)
        RETURNING id INTO v_ING1503;
    END IF;

    SELECT id INTO v_ING1207 FROM materias WHERE codigo = 'ING1207';
    IF v_ING1207 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Termodinámica de Alimentos I', 'ING1207', false)
        RETURNING id INTO v_ING1207;
    END IF;

    SELECT id INTO v_ING1206 FROM materias WHERE codigo = 'ING1206';
    IF v_ING1206 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Química del Carbono', 'ING1206', false)
        RETURNING id INTO v_ING1206;
    END IF;

    SELECT id INTO v_ING1202 FROM materias WHERE codigo = 'ING1202';
    IF v_ING1202 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fisicoquímica II', 'ING1202', false)
        RETURNING id INTO v_ING1202;
    END IF;

    SELECT id INTO v_INGF105 FROM materias WHERE codigo = 'INGF105';
    IF v_INGF105 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física C-II', 'INGF105', false)
        RETURNING id INTO v_INGF105;
    END IF;

    SELECT id INTO v_ING8408 FROM materias WHERE codigo = 'ING8408';
    IF v_ING8408 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Inglés I', 'ING8408', false)
        RETURNING id INTO v_ING8408;
    END IF;

    SELECT id INTO v_ING1501 FROM materias WHERE codigo = 'ING1501';
    IF v_ING1501 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Operación de Plantas de Procesos', 'ING1501', false)
        RETURNING id INTO v_ING1501;
    END IF;

    SELECT id INTO v_INGM109 FROM materias WHERE codigo = 'INGM109';
    IF v_INGM109 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Métodos Numéricos para Ingeniería', 'INGM109', false)
        RETURNING id INTO v_INGM109;
    END IF;

    SELECT id INTO v_ING1301 FROM materias WHERE codigo = 'ING1301';
    IF v_ING1301 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Operaciones Unitarias I', 'ING1301', false)
        RETURNING id INTO v_ING1301;
    END IF;

    SELECT id INTO v_ING1208 FROM materias WHERE codigo = 'ING1208';
    IF v_ING1208 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Termodinámica de Alimentos II', 'ING1208', false)
        RETURNING id INTO v_ING1208;
    END IF;

    SELECT id INTO v_ING1205 FROM materias WHERE codigo = 'ING1205';
    IF v_ING1205 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Química Biological', 'ING1205', false)
        RETURNING id INTO v_ING1205;
    END IF;

    SELECT id INTO v_ING1504 FROM materias WHERE codigo = 'ING1504';
    IF v_ING1504 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Taller de Ingeniería III (Anual)', 'ING1504', false)
        RETURNING id INTO v_ING1504;
    END IF;

    SELECT id INTO v_ING1302 FROM materias WHERE codigo = 'ING1302';
    IF v_ING1302 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Operaciones Unitarias II', 'ING1302', false)
        RETURNING id INTO v_ING1302;
    END IF;

    SELECT id INTO v_INGM108 FROM materias WHERE codigo = 'INGM108';
    IF v_INGM108 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Probabilidad y Estadística', 'INGM108', false)
        RETURNING id INTO v_INGM108;
    END IF;

    SELECT id INTO v_ING1204 FROM materias WHERE codigo = 'ING1204';
    IF v_ING1204 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Técnicas de Análisis Fisicoquímicos', 'ING1204', false)
        RETURNING id INTO v_ING1204;
    END IF;

    SELECT id INTO v_ING1305 FROM materias WHERE codigo = 'ING1305';
    IF v_ING1305 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Bioquímica de Alimentos', 'ING1305', false)
        RETURNING id INTO v_ING1305;
    END IF;

    SELECT id INTO v_ING1304 FROM materias WHERE codigo = 'ING1304';
    IF v_ING1304 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Bromatología y Calidad de Alimentos', 'ING1304', false)
        RETURNING id INTO v_ING1304;
    END IF;

    SELECT id INTO v_ING1303 FROM materias WHERE codigo = 'ING1303';
    IF v_ING1303 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Operaciones Unitarias III', 'ING1303', false)
        RETURNING id INTO v_ING1303;
    END IF;

    SELECT id INTO v_ING1203 FROM materias WHERE codigo = 'ING1203';
    IF v_ING1203 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Microbiología', 'ING1203', false)
        RETURNING id INTO v_ING1203;
    END IF;

    SELECT id INTO v_ING8411 FROM materias WHERE codigo = 'ING8411';
    IF v_ING8411 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Organización Empresarial e Industrial', 'ING8411', false)
        RETURNING id INTO v_ING8411;
    END IF;

    SELECT id INTO v_ING8405 FROM materias WHERE codigo = 'ING8405';
    IF v_ING8405 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Ética, Legislación y Propiedad Intelectual en el Ejercicio Profesional', 'ING8405', false)
        RETURNING id INTO v_ING8405;
    END IF;

    SELECT id INTO v_ING1308 FROM materias WHERE codigo = 'ING1308';
    IF v_ING1308 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Transformación y Preservación de Alimentos', 'ING1308', false)
        RETURNING id INTO v_ING1308;
    END IF;

    SELECT id INTO v_ING1309 FROM materias WHERE codigo = 'ING1309';
    IF v_ING1309 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Industrialización de Alimentos I', 'ING1309', false)
        RETURNING id INTO v_ING1309;
    END IF;

    SELECT id INTO v_ING8413 FROM materias WHERE codigo = 'ING8413';
    IF v_ING8413 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Sistemas de Gestión Integrados', 'ING8413', false)
        RETURNING id INTO v_ING8413;
    END IF;

    SELECT id INTO v_ING8409 FROM materias WHERE codigo = 'ING8409';
    IF v_ING8409 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Inglés II', 'ING8409', false)
        RETURNING id INTO v_ING8409;
    END IF;

    SELECT id INTO v_ING1306 FROM materias WHERE codigo = 'ING1306';
    IF v_ING1306 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Ingeniería de Procesos Biotecnológicos', 'ING1306', false)
        RETURNING id INTO v_ING1306;
    END IF;

    SELECT id INTO v_ING1310 FROM materias WHERE codigo = 'ING1310';
    IF v_ING1310 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Industrialización de Alimentos II', 'ING1310', false)
        RETURNING id INTO v_ING1310;
    END IF;

    SELECT id INTO v_ING1401 FROM materias WHERE codigo = 'ING1401';
    IF v_ING1401 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Gestión en la Industria Alimentaria', 'ING1401', false)
        RETURNING id INTO v_ING1401;
    END IF;

    SELECT id INTO v_ING8406 FROM materias WHERE codigo = 'ING8406';
    IF v_ING8406 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Formulación y Evaluación de Proyectos de Inversión', 'ING8406', false)
        RETURNING id INTO v_ING8406;
    END IF;

    SELECT id INTO v_ING1507 FROM materias WHERE codigo = 'ING1507';
    IF v_ING1507 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Proyecto Integrador de Ingeniería en Alimentos (Anual)', 'ING1507', false)
        RETURNING id INTO v_ING1507;
    END IF;

    SELECT id INTO v_ING1311 FROM materias WHERE codigo = 'ING1311';
    IF v_ING1311 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Control de Procesos en Alimentos', 'ING1311', false)
        RETURNING id INTO v_ING1311;
    END IF;

    SELECT id INTO v_ING8412 FROM materias WHERE codigo = 'ING8412';
    IF v_ING8412 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Seguridad y Salud Ocupacional', 'ING8412', false)
        RETURNING id INTO v_ING8412;
    END IF;

    -- 3. Vincular materias al plan (plan_materia)
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM101, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM105, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1101, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1502, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM102, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM106, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF101, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1201, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM103, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1307, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6101, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF103, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1102, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1503, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1207, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1206, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1202, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF105, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8408, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1501, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM109, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1301, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1208, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1205, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1504, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1302, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM108, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1204, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1305, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1304, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1303, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1203, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8411, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8405, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1308, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1309, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8413, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8409, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1306, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1310, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1401, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8406, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1507, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1311, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8412, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;

    -- 4. Insertar Correlativas
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM102, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM106, v_INGM105)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF101, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF101, v_INGM105)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1201, v_ING1101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM103, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM103, v_INGM106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1307, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1307, v_INGF101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1307, v_ING1101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6101, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6101, v_INGM105)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF103, v_INGM106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF103, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF103, v_INGF101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1102, v_ING1101)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): Taller de Ingeniería I
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1207, v_ING1307)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1207, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1206, v_ING1201)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1202, v_ING1201)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1202, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF105, v_INGF103)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1501, v_INGF103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1501, v_ING1307)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1501, v_ING1102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM109, v_INGM103)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): Fundamentos de la Programación
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1301, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1301, v_ING1501)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1208, v_ING1201)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1208, v_ING1207)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1205, v_ING1206)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1205, v_ING1202)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): Taller de Ingeniería II
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1302, v_ING1207)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1302, v_ING1301)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM108, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1204, v_ING1206)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): Química Biológica
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1304, v_ING1204)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1304, v_ING1305)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1303, v_ING1208)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): Química Biológica
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8411, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8405, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1308, v_ING1203)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1308, v_ING1305)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1308, v_ING1302)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1308, v_ING1303)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1309, v_ING1203)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): Bromatología
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1309, v_ING1303)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8413, v_ING8411)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8409, v_ING8408)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1306, v_ING1202)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): Química Biológica
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1306, v_ING1203)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1310, v_ING1304)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1310, v_ING1308)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1401, v_ING1304)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1401, v_ING1308)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8406, v_ING8411)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1507, v_ING1304)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1507, v_ING1308)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1507, v_ING1303)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING1311, v_ING1302)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8412, v_ING8411)
    ON CONFLICT DO NOTHING;
END $$;

-- Ingenieria en computacion

-- Carga de Materias y Correlativas para Plan 2024 - Carrera 12
-- Generado por generate_plan_sql.py

DO $$
DECLARE
    v_plan_id int;
    v_INGM101 int;
    v_INGM104 int;
    v_ING8408 int;
    v_ING6102 int;
    v_INGM102 int;
    v_INGM106 int;
    v_INGF101 int;
    v_INGM107 int;
    v_ING8409 int;
    v_INGM103 int;
    v_INGF102 int;
    v_INGM108 int;
    v_ING4218 int;
    v_ING4221 int;
    v_ING4222 int;
    v_INGF105 int;
    v_ING4219 int;
    v_ING4223 int;
    v_ING4227 int;
    v_ING4225 int;
    v_ING4224 int;
    v_ING4220 int;
    v_ING4226 int;
    v_ING4318 int;
    v_ING4321 int;
    v_ING4319 int;
    v_ING4320 int;
    v_ING4228 int;
    v_ING4322 int;
    v_ING4323 int;
    v_ING4324 int;
    v_ING8411 int;
    v_ING6307 int;
    v_ING8412 int;
    v_ING4309 int;
    v_ING8404 int;
    v_ING4311 int;
    v_ING4310 int;
    v_ING4314 int;
    v_ING8403 int;
    v_ING4313 int;
    v_ING4326 int;
    v_ING4315 int;
    v_ING4312 int;
    v_ING4327 int;
    v_carrera_id int;
BEGIN
    SELECT id INTO v_carrera_id FROM carreras WHERE nombre = 'Ingenieria en Computacion' LIMIT 1;
    -- 1. Buscar o crear Plan de Estudios para carrera 12
    SELECT id INTO v_plan_id FROM plan_estudios
    WHERE carrera_id = v_carrera_id AND anio_vigencia = 2024 LIMIT 1;
    IF v_plan_id IS NULL THEN
        INSERT INTO plan_estudios (carrera_id, nombre, anio_vigencia, activo)
        VALUES (v_carrera_id, 'Plan 2024', 2024, true)
        RETURNING id INTO v_plan_id;
    END IF;

    -- 2. Insertar o reutilizar Materias (identificadas por codigo)
    SELECT id INTO v_INGM101 FROM materias WHERE codigo = 'INGM101';
    IF v_INGM101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático I', 'INGM101', false)
        RETURNING id INTO v_INGM101;
    END IF;

    SELECT id INTO v_INGM104 FROM materias WHERE codigo = 'INGM104';
    IF v_INGM104 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Álgebra I-A', 'INGM104', false)
        RETURNING id INTO v_INGM104;
    END IF;

    SELECT id INTO v_ING8408 FROM materias WHERE codigo = 'ING8408';
    IF v_ING8408 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Inglés I', 'ING8408', false)
        RETURNING id INTO v_ING8408;
    END IF;

    SELECT id INTO v_ING6102 FROM materias WHERE codigo = 'ING6102';
    IF v_ING6102 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Informática Básica', 'ING6102', false)
        RETURNING id INTO v_ING6102;
    END IF;

    SELECT id INTO v_INGM102 FROM materias WHERE codigo = 'INGM102';
    IF v_INGM102 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático II', 'INGM102', false)
        RETURNING id INTO v_INGM102;
    END IF;

    SELECT id INTO v_INGM106 FROM materias WHERE codigo = 'INGM106';
    IF v_INGM106 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Álgebra II', 'INGM106', false)
        RETURNING id INTO v_INGM106;
    END IF;

    SELECT id INTO v_INGF101 FROM materias WHERE codigo = 'INGF101';
    IF v_INGF101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física A', 'INGF101', false)
        RETURNING id INTO v_INGF101;
    END IF;

    SELECT id INTO v_INGM107 FROM materias WHERE codigo = 'INGM107';
    IF v_INGM107 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Introducción a la Matemática Discreta', 'INGM107', false)
        RETURNING id INTO v_INGM107;
    END IF;

    SELECT id INTO v_ING8409 FROM materias WHERE codigo = 'ING8409';
    IF v_ING8409 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Inglés II', 'ING8409', false)
        RETURNING id INTO v_ING8409;
    END IF;

    SELECT id INTO v_INGM103 FROM materias WHERE codigo = 'INGM103';
    IF v_INGM103 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático III', 'INGM103', false)
        RETURNING id INTO v_INGM103;
    END IF;

    SELECT id INTO v_INGF102 FROM materias WHERE codigo = 'INGF102';
    IF v_INGF102 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física B-I', 'INGF102', false)
        RETURNING id INTO v_INGF102;
    END IF;

    SELECT id INTO v_INGM108 FROM materias WHERE codigo = 'INGM108';
    IF v_INGM108 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Probabilidad y Estadística', 'INGM108', false)
        RETURNING id INTO v_INGM108;
    END IF;

    SELECT id INTO v_ING4218 FROM materias WHERE codigo = 'ING4218';
    IF v_ING4218 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Programación I', 'ING4218', false)
        RETURNING id INTO v_ING4218;
    END IF;

    SELECT id INTO v_ING4221 FROM materias WHERE codigo = 'ING4221';
    IF v_ING4221 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Proyecto Transversal C I', 'ING4221', false)
        RETURNING id INTO v_ING4221;
    END IF;

    SELECT id INTO v_ING4222 FROM materias WHERE codigo = 'ING4222';
    IF v_ING4222 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Teoría de Circuitos', 'ING4222', false)
        RETURNING id INTO v_ING4222;
    END IF;

    SELECT id INTO v_INGF105 FROM materias WHERE codigo = 'INGF105';
    IF v_INGF105 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física C-II', 'INGF105', false)
        RETURNING id INTO v_INGF105;
    END IF;

    SELECT id INTO v_ING4219 FROM materias WHERE codigo = 'ING4219';
    IF v_ING4219 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Programación II', 'ING4219', false)
        RETURNING id INTO v_ING4219;
    END IF;

    SELECT id INTO v_ING4223 FROM materias WHERE codigo = 'ING4223';
    IF v_ING4223 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Señales y Sistemas de Tiempo Continuo', 'ING4223', false)
        RETURNING id INTO v_ING4223;
    END IF;

    SELECT id INTO v_ING4227 FROM materias WHERE codigo = 'ING4227';
    IF v_ING4227 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Proyecto Transversal C II', 'ING4227', false)
        RETURNING id INTO v_ING4227;
    END IF;

    SELECT id INTO v_ING4225 FROM materias WHERE codigo = 'ING4225';
    IF v_ING4225 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Dispositivos y Circuitos Electrónicos', 'ING4225', false)
        RETURNING id INTO v_ING4225;
    END IF;

    SELECT id INTO v_ING4224 FROM materias WHERE codigo = 'ING4224';
    IF v_ING4224 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Señales y Sistemas de Tiempo Discreto', 'ING4224', false)
        RETURNING id INTO v_ING4224;
    END IF;

    SELECT id INTO v_ING4220 FROM materias WHERE codigo = 'ING4220';
    IF v_ING4220 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Programación III', 'ING4220', false)
        RETURNING id INTO v_ING4220;
    END IF;

    SELECT id INTO v_ING4226 FROM materias WHERE codigo = 'ING4226';
    IF v_ING4226 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Circuitos Digitales', 'ING4226', false)
        RETURNING id INTO v_ING4226;
    END IF;

    SELECT id INTO v_ING4318 FROM materias WHERE codigo = 'ING4318';
    IF v_ING4318 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Proyecto Transversal C III', 'ING4318', false)
        RETURNING id INTO v_ING4318;
    END IF;

    SELECT id INTO v_ING4321 FROM materias WHERE codigo = 'ING4321';
    IF v_ING4321 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Arquitectura de Computadoras', 'ING4321', false)
        RETURNING id INTO v_ING4321;
    END IF;

    SELECT id INTO v_ING4319 FROM materias WHERE codigo = 'ING4319';
    IF v_ING4319 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Control Discreto', 'ING4319', false)
        RETURNING id INTO v_ING4319;
    END IF;

    SELECT id INTO v_ING4320 FROM materias WHERE codigo = 'ING4320';
    IF v_ING4320 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Principios de Seguridad Informática', 'ING4320', false)
        RETURNING id INTO v_ING4320;
    END IF;

    SELECT id INTO v_ING4228 FROM materias WHERE codigo = 'ING4228';
    IF v_ING4228 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fundamentos de Comunicaciones Digitales', 'ING4228', false)
        RETURNING id INTO v_ING4228;
    END IF;

    SELECT id INTO v_ING4322 FROM materias WHERE codigo = 'ING4322';
    IF v_ING4322 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Sistemas Operativos', 'ING4322', false)
        RETURNING id INTO v_ING4322;
    END IF;

    SELECT id INTO v_ING4323 FROM materias WHERE codigo = 'ING4323';
    IF v_ING4323 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Sistemas Embebidos', 'ING4323', false)
        RETURNING id INTO v_ING4323;
    END IF;

    SELECT id INTO v_ING4324 FROM materias WHERE codigo = 'ING4324';
    IF v_ING4324 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Ingeniería de Soluciones', 'ING4324', false)
        RETURNING id INTO v_ING4324;
    END IF;

    SELECT id INTO v_ING8411 FROM materias WHERE codigo = 'ING8411';
    IF v_ING8411 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Organización Empresarial e Industrial', 'ING8411', false)
        RETURNING id INTO v_ING8411;
    END IF;

    SELECT id INTO v_ING6307 FROM materias WHERE codigo = 'ING6307';
    IF v_ING6307 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Sistemas de Bases de Datos', 'ING6307', false)
        RETURNING id INTO v_ING6307;
    END IF;

    SELECT id INTO v_ING8412 FROM materias WHERE codigo = 'ING8412';
    IF v_ING8412 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Seguridad y Salud Ocupacional', 'ING8412', false)
        RETURNING id INTO v_ING8412;
    END IF;

    SELECT id INTO v_ING4309 FROM materias WHERE codigo = 'ING4309';
    IF v_ING4309 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Redes de Transmisión de Datos', 'ING4309', false)
        RETURNING id INTO v_ING4309;
    END IF;

    SELECT id INTO v_ING8404 FROM materias WHERE codigo = 'ING8404';
    IF v_ING8404 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Ética, Legislación y Ejercicio Profesional', 'ING8404', false)
        RETURNING id INTO v_ING8404;
    END IF;

    SELECT id INTO v_ING4311 FROM materias WHERE codigo = 'ING4311';
    IF v_ING4311 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Inteligencia Computacional', 'ING4311', false)
        RETURNING id INTO v_ING4311;
    END IF;

    SELECT id INTO v_ING4310 FROM materias WHERE codigo = 'ING4310';
    IF v_ING4310 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Sistemas de Computación Distribuidos I', 'ING4310', false)
        RETURNING id INTO v_ING4310;
    END IF;

    SELECT id INTO v_ING4314 FROM materias WHERE codigo = 'ING4314';
    IF v_ING4314 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Mecanismos de Seguridad en Redes', 'ING4314', false)
        RETURNING id INTO v_ING4314;
    END IF;

    SELECT id INTO v_ING8403 FROM materias WHERE codigo = 'ING8403';
    IF v_ING8403 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Economía para Ingeniería', 'ING8403', false)
        RETURNING id INTO v_ING8403;
    END IF;

    SELECT id INTO v_ING4313 FROM materias WHERE codigo = 'ING4313';
    IF v_ING4313 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Diseño Digital Avanzado', 'ING4313', false)
        RETURNING id INTO v_ING4313;
    END IF;

    SELECT id INTO v_ING4326 FROM materias WHERE codigo = 'ING4326';
    IF v_ING4326 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Optativa I (Tecnológica)', 'ING4326', false)
        RETURNING id INTO v_ING4326;
    END IF;

    SELECT id INTO v_ING4315 FROM materias WHERE codigo = 'ING4315';
    IF v_ING4315 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Proyecto Final de Computación', 'ING4315', false)
        RETURNING id INTO v_ING4315;
    END IF;

    SELECT id INTO v_ING4312 FROM materias WHERE codigo = 'ING4312';
    IF v_ING4312 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Sistemas de Computación Distribuidos II', 'ING4312', false)
        RETURNING id INTO v_ING4312;
    END IF;

    SELECT id INTO v_ING4327 FROM materias WHERE codigo = 'ING4327';
    IF v_ING4327 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Optativa II (Complementaria)', 'ING4327', false)
        RETURNING id INTO v_ING4327;
    END IF;

    -- 3. Vincular materias al plan (plan_materia)
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM101, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM104, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8408, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6102, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM102, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM106, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF101, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM107, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8409, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM103, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF102, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM108, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4218, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4221, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4222, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF105, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4219, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4223, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4227, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4225, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4224, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4220, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4226, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4318, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4321, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4319, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4320, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4228, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4322, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4323, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4324, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8411, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6307, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8412, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4309, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8404, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4311, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4310, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4314, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8403, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4313, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4326, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4315, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4312, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4327, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;

    -- 4. Insertar Correlativas
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM102, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM106, v_INGM104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF101, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF101, v_INGM104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM107, v_INGM104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM107, v_ING6102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8409, v_ING8408)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM103, v_INGM106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM103, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF102, v_INGM106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF102, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF102, v_INGF101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM108, v_ING6102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4218, v_ING6102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4218, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4221, v_INGF102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4222, v_INGF102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF105, v_INGF102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4219, v_ING4218)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4223, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4223, v_INGM108)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4223, v_INGF102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4227, v_ING4221)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4227, v_ING4218)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4227, v_ING4222)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4225, v_ING4222)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4224, v_ING4223)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4220, v_ING4219)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4226, v_ING4222)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4226, v_ING4219)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4318, v_ING4227)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4318, v_ING4226)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4321, v_ING4225)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4319, v_ING4225)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4319, v_ING4224)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4320, v_ING4220)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4228, v_ING4224)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4322, v_ING4219)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4322, v_ING4321)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4323, v_ING4321)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4324, v_ING4220)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8411, v_ING4318)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6307, v_ING4324)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6307, v_ING4322)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8412, v_ING8411)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4309, v_ING4228)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4309, v_ING4226)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8404, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4311, v_ING4224)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4311, v_ING4220)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4310, v_ING4220)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4314, v_ING4309)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4314, v_ING4320)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8403, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4313, v_ING4226)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): (**)
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4315, v_ING4314)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4315, v_ING4313)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4315, v_ING6307)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4315, v_ING4319)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4312, v_ING4309)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4312, v_ING4320)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4312, v_ING4322)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): (**)
END $$;


-- INGENIERÍA EN MATERIALES

-- Carga de Materias y Correlativas para Plan 2024 - Carrera 13
-- Generado por generate_plan_sql.py

DO $$
DECLARE
    v_plan_id int;
    v_INGM104 int;
    v_INGM101 int;
    v_ING1103 int;
    v_ING8408 int;
    v_INGM106 int;
    v_INGM102 int;
    v_INGF101 int;
    v_ING6101 int;
    v_ING8409 int;
    v_INGM103 int;
    v_INGF102 int;
    v_ING5201 int;
    v_ING2207 int;
    v_INGF104 int;
    v_INGM109 int;
    v_ING5101 int;
    v_ING5205 int;
    v_ING2208 int;
    v_INGF201 int;
    v_INGF106 int;
    v_ING5203 int;
    v_ING5204 int;
    v_ING8403 int;
    v_ING5305 int;
    v_ING5202 int;
    v_ING5313 int;
    v_ING5206 int;
    v_ING5302 int;
    v_ING5315 int;
    v_ING8405 int;
    v_ING5307 int;
    v_ING5312 int;
    v_ING5303 int;
    v_ING5308 int;
    v_ING5311 int;
    v_ING5304 int;
    v_ING5309 int;
    v_ING5310 int;
    v_ING8406 int;
    v_ING8411 int;
    v_ING5301 int;
    v_ING5316 int;
    v_ING5306 int;
    v_ING5314 int;
    v_ING8412 int;
    v_ING8413 int;
    v_carrera_id int;
BEGIN
    SELECT id INTO v_carrera_id FROM carreras WHERE nombre = 'Ingenieria en Materiales' LIMIT 1;
    -- 1. Buscar o crear Plan de Estudios para carrera 13
    SELECT id INTO v_plan_id FROM plan_estudios
    WHERE carrera_id = v_carrera_id AND anio_vigencia = 2024 LIMIT 1;
    IF v_plan_id IS NULL THEN
        INSERT INTO plan_estudios (carrera_id, nombre, anio_vigencia, activo)
        VALUES (v_carrera_id, 'Plan 2024', 2024, true)
        RETURNING id INTO v_plan_id;
    END IF;

    -- 2. Insertar o reutilizar Materias (identificadas por codigo)
    SELECT id INTO v_INGM104 FROM materias WHERE codigo = 'INGM104';
    IF v_INGM104 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Álgebra I-A', 'INGM104', false)
        RETURNING id INTO v_INGM104;
    END IF;

    SELECT id INTO v_INGM101 FROM materias WHERE codigo = 'INGM101';
    IF v_INGM101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático I', 'INGM101', false)
        RETURNING id INTO v_INGM101;
    END IF;

    SELECT id INTO v_ING1103 FROM materias WHERE codigo = 'ING1103';
    IF v_ING1103 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fundamentos de Química', 'ING1103', false)
        RETURNING id INTO v_ING1103;
    END IF;

    SELECT id INTO v_ING8408 FROM materias WHERE codigo = 'ING8408';
    IF v_ING8408 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Inglés I', 'ING8408', false)
        RETURNING id INTO v_ING8408;
    END IF;

    SELECT id INTO v_INGM106 FROM materias WHERE codigo = 'INGM106';
    IF v_INGM106 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Álgebra II', 'INGM106', false)
        RETURNING id INTO v_INGM106;
    END IF;

    SELECT id INTO v_INGM102 FROM materias WHERE codigo = 'INGM102';
    IF v_INGM102 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático II', 'INGM102', false)
        RETURNING id INTO v_INGM102;
    END IF;

    SELECT id INTO v_INGF101 FROM materias WHERE codigo = 'INGF101';
    IF v_INGF101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física A', 'INGF101', false)
        RETURNING id INTO v_INGF101;
    END IF;

    SELECT id INTO v_ING6101 FROM materias WHERE codigo = 'ING6101';
    IF v_ING6101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fundamentos de la Programación', 'ING6101', false)
        RETURNING id INTO v_ING6101;
    END IF;

    SELECT id INTO v_ING8409 FROM materias WHERE codigo = 'ING8409';
    IF v_ING8409 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Inglés II', 'ING8409', false)
        RETURNING id INTO v_ING8409;
    END IF;

    SELECT id INTO v_INGM103 FROM materias WHERE codigo = 'INGM103';
    IF v_INGM103 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático III', 'INGM103', false)
        RETURNING id INTO v_INGM103;
    END IF;

    SELECT id INTO v_INGF102 FROM materias WHERE codigo = 'INGF102';
    IF v_INGF102 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física B-I', 'INGF102', false)
        RETURNING id INTO v_INGF102;
    END IF;

    SELECT id INTO v_ING5201 FROM materias WHERE codigo = 'ING5201';
    IF v_ING5201 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Introducción a la Ciencia de los Materiales', 'ING5201', false)
        RETURNING id INTO v_ING5201;
    END IF;

    SELECT id INTO v_ING2207 FROM materias WHERE codigo = 'ING2207';
    IF v_ING2207 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Estática I', 'ING2207', false)
        RETURNING id INTO v_ING2207;
    END IF;

    SELECT id INTO v_INGF104 FROM materias WHERE codigo = 'INGF104';
    IF v_INGF104 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física C-I', 'INGF104', false)
        RETURNING id INTO v_INGF104;
    END IF;

    SELECT id INTO v_INGM109 FROM materias WHERE codigo = 'INGM109';
    IF v_INGM109 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Métodos Numéricos para Ingeniería', 'INGM109', false)
        RETURNING id INTO v_INGM109;
    END IF;

    SELECT id INTO v_ING5101 FROM materias WHERE codigo = 'ING5101';
    IF v_ING5101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Introducción al Diseño 3D', 'ING5101', false)
        RETURNING id INTO v_ING5101;
    END IF;

    SELECT id INTO v_ING5205 FROM materias WHERE codigo = 'ING5205';
    IF v_ING5205 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Termodinámica de Materiales', 'ING5205', false)
        RETURNING id INTO v_ING5205;
    END IF;

    SELECT id INTO v_ING2208 FROM materias WHERE codigo = 'ING2208';
    IF v_ING2208 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Estática II', 'ING2208', false)
        RETURNING id INTO v_ING2208;
    END IF;

    SELECT id INTO v_INGF201 FROM materias WHERE codigo = 'INGF201';
    IF v_INGF201 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Introducción a la Física del Estado Sólido', 'INGF201', false)
        RETURNING id INTO v_INGF201;
    END IF;

    SELECT id INTO v_INGF106 FROM materias WHERE codigo = 'INGF106';
    IF v_INGF106 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física Experimental A', 'INGF106', false)
        RETURNING id INTO v_INGF106;
    END IF;

    SELECT id INTO v_ING5203 FROM materias WHERE codigo = 'ING5203';
    IF v_ING5203 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Mecánica de Materiales y Componentes', 'ING5203', false)
        RETURNING id INTO v_ING5203;
    END IF;

    SELECT id INTO v_ING5204 FROM materias WHERE codigo = 'ING5204';
    IF v_ING5204 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Química del Estado Sólido', 'ING5204', false)
        RETURNING id INTO v_ING5204;
    END IF;

    SELECT id INTO v_ING8403 FROM materias WHERE codigo = 'ING8403';
    IF v_ING8403 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Economía para Ingeniería', 'ING8403', false)
        RETURNING id INTO v_ING8403;
    END IF;

    SELECT id INTO v_ING5305 FROM materias WHERE codigo = 'ING5305';
    IF v_ING5305 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fluidodinámica', 'ING5305', false)
        RETURNING id INTO v_ING5305;
    END IF;

    SELECT id INTO v_ING5202 FROM materias WHERE codigo = 'ING5202';
    IF v_ING5202 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Introducción a Polímeros', 'ING5202', false)
        RETURNING id INTO v_ING5202;
    END IF;

    SELECT id INTO v_ING5313 FROM materias WHERE codigo = 'ING5313';
    IF v_ING5313 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Propiedades Funcionales de Materiales', 'ING5313', false)
        RETURNING id INTO v_ING5313;
    END IF;

    SELECT id INTO v_ING5206 FROM materias WHERE codigo = 'ING5206';
    IF v_ING5206 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fundamentos de Metalurgia Física', 'ING5206', false)
        RETURNING id INTO v_ING5206;
    END IF;

    SELECT id INTO v_ING5302 FROM materias WHERE codigo = 'ING5302';
    IF v_ING5302 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Cerámica de Aplicación Industrial', 'ING5302', false)
        RETURNING id INTO v_ING5302;
    END IF;

    SELECT id INTO v_ING5315 FROM materias WHERE codigo = 'ING5315';
    IF v_ING5315 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Transporte de Calor y Materia', 'ING5315', false)
        RETURNING id INTO v_ING5315;
    END IF;

    SELECT id INTO v_ING8405 FROM materias WHERE codigo = 'ING8405';
    IF v_ING8405 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Ética, Legislación y Propiedad Intelectual en el Ejercicio Profesional', 'ING8405', false)
        RETURNING id INTO v_ING8405;
    END IF;

    SELECT id INTO v_ING5307 FROM materias WHERE codigo = 'ING5307';
    IF v_ING5307 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Modelado y Simulación de Materiales I', 'ING5307', false)
        RETURNING id INTO v_ING5307;
    END IF;

    SELECT id INTO v_ING5312 FROM materias WHERE codigo = 'ING5312';
    IF v_ING5312 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Propiedades Estructurales de Metales', 'ING5312', false)
        RETURNING id INTO v_ING5312;
    END IF;

    SELECT id INTO v_ING5303 FROM materias WHERE codigo = 'ING5303';
    IF v_ING5303 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Comportamiento Mecánico de Polímeros y Cerámicos', 'ING5303', false)
        RETURNING id INTO v_ING5303;
    END IF;

    SELECT id INTO v_ING5308 FROM materias WHERE codigo = 'ING5308';
    IF v_ING5308 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Modelado y Simulación de Materiales II', 'ING5308', false)
        RETURNING id INTO v_ING5308;
    END IF;

    SELECT id INTO v_ING5311 FROM materias WHERE codigo = 'ING5311';
    IF v_ING5311 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Procesamiento de Plásticos', 'ING5311', false)
        RETURNING id INTO v_ING5311;
    END IF;

    SELECT id INTO v_ING5304 FROM materias WHERE codigo = 'ING5304';
    IF v_ING5304 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Corrosión de Metales y Aleaciones', 'ING5304', false)
        RETURNING id INTO v_ING5304;
    END IF;

    SELECT id INTO v_ING5309 FROM materias WHERE codigo = 'ING5309';
    IF v_ING5309 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Procesamiento de Compuestos', 'ING5309', false)
        RETURNING id INTO v_ING5309;
    END IF;

    SELECT id INTO v_ING5310 FROM materias WHERE codigo = 'ING5310';
    IF v_ING5310 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Procesamiento de Metales', 'ING5310', false)
        RETURNING id INTO v_ING5310;
    END IF;

    SELECT id INTO v_ING8406 FROM materias WHERE codigo = 'ING8406';
    IF v_ING8406 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Formulación y Evaluación de Proyectos de Inversión', 'ING8406', false)
        RETURNING id INTO v_ING8406;
    END IF;

    SELECT id INTO v_ING8411 FROM materias WHERE codigo = 'ING8411';
    IF v_ING8411 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Organización Empresarial e Industrial', 'ING8411', false)
        RETURNING id INTO v_ING8411;
    END IF;

    SELECT id INTO v_ING5301 FROM materias WHERE codigo = 'ING5301';
    IF v_ING5301 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Adquisición y Análisis de la Información Experimental', 'ING5301', false)
        RETURNING id INTO v_ING5301;
    END IF;

    SELECT id INTO v_ING5316 FROM materias WHERE codigo = 'ING5316';
    IF v_ING5316 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Trabajo Final (ANUAL)', 'ING5316', false)
        RETURNING id INTO v_ING5316;
    END IF;

    SELECT id INTO v_ING5306 FROM materias WHERE codigo = 'ING5306';
    IF v_ING5306 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Laboratorio de Transformación de Materiales', 'ING5306', false)
        RETURNING id INTO v_ING5306;
    END IF;

    SELECT id INTO v_ING5314 FROM materias WHERE codigo = 'ING5314';
    IF v_ING5314 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Selección de Materiales', 'ING5314', false)
        RETURNING id INTO v_ING5314;
    END IF;

    SELECT id INTO v_ING8412 FROM materias WHERE codigo = 'ING8412';
    IF v_ING8412 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Seguridad y Salud Ocupacional', 'ING8412', false)
        RETURNING id INTO v_ING8412;
    END IF;

    SELECT id INTO v_ING8413 FROM materias WHERE codigo = 'ING8413';
    IF v_ING8413 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Sistemas de Gestión Integrados', 'ING8413', false)
        RETURNING id INTO v_ING8413;
    END IF;

    -- 3. Vincular materias al plan (plan_materia)
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM104, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM101, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1103, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8408, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM106, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM102, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF101, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6101, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8409, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM103, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF102, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5201, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2207, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF104, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM109, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5101, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5205, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2208, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF201, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF106, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5203, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5204, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8403, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5305, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5202, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5313, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5206, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5302, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5315, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8405, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5307, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5312, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5303, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5308, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5311, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5304, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5309, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5310, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8406, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8411, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5301, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5316, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5306, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5314, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8412, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8413, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;

    -- 4. Insertar Correlativas
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM106, v_INGM104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM102, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF101, v_INGM104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF101, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6101, v_INGM104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6101, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8409, v_ING8408)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM103, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM103, v_INGM106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF102, v_INGM106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF102, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF102, v_INGF101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5201, v_ING1103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5201, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2207, v_INGM106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF104, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF104, v_INGF102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM109, v_ING6101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM109, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5101, v_INGM106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5205, v_ING1103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5205, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5205, v_INGF101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2208, v_ING2207)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF201, v_INGF104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF106, v_INGF102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5203, v_ING2208)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5204, v_ING5201)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5204, v_ING5205)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8403, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5305, v_ING5201)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5305, v_INGM109)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5305, v_ING5101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5202, v_ING5201)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5202, v_ING5205)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5313, v_INGF201)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5206, v_ING5204)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5206, v_ING2208)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5302, v_ING5204)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5315, v_ING5305)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8405, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5307, v_ING5203)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5307, v_ING5315)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5312, v_ING5206)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5303, v_ING5202)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5303, v_ING5312)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5308, v_ING5307)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5311, v_ING5315)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5311, v_ING5202)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5304, v_ING5312)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5309, v_ING5315)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5309, v_ING5311)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5310, v_ING5312)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8406, v_ING8403)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8411, v_ING8403)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5301, v_ING5312)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5316, v_ING5303)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5316, v_ING5307)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5316, v_ING5311)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5306, v_ING5309)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5306, v_ING5310)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5306, v_ING5302)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5314, v_ING5310)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8412, v_ING8411)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8413, v_ING8411)
    ON CONFLICT DO NOTHING;
END $$;

-- Ingenieria en materiales

-- Carga de Materias y Correlativas para Plan 2024 - Carrera 13
-- Generado por generate_plan_sql.py

DO $$
DECLARE
    v_plan_id int;
    v_INGM104 int;
    v_INGM101 int;
    v_ING1103 int;
    v_ING8408 int;
    v_INGM106 int;
    v_INGM102 int;
    v_INGF101 int;
    v_ING6101 int;
    v_ING8409 int;
    v_INGM103 int;
    v_INGF102 int;
    v_ING5201 int;
    v_ING2207 int;
    v_INGF104 int;
    v_INGM109 int;
    v_ING5101 int;
    v_ING5205 int;
    v_ING2208 int;
    v_INGF201 int;
    v_INGF106 int;
    v_ING5203 int;
    v_ING5204 int;
    v_ING8403 int;
    v_ING5305 int;
    v_ING5202 int;
    v_ING5313 int;
    v_ING5206 int;
    v_ING5302 int;
    v_ING5315 int;
    v_ING8405 int;
    v_ING5307 int;
    v_ING5312 int;
    v_ING5303 int;
    v_ING5308 int;
    v_ING5311 int;
    v_ING5304 int;
    v_ING5309 int;
    v_ING5310 int;
    v_ING8406 int;
    v_ING8411 int;
    v_ING5301 int;
    v_ING5316 int;
    v_ING5306 int;
    v_ING5314 int;
    v_ING8412 int;
    v_ING8413 int;
    v_carrera_id int;
BEGIN
    SELECT id INTO v_carrera_id FROM carreras WHERE nombre = 'Ingenieria en Materiales' LIMIT 1;
    -- 1. Buscar o crear Plan de Estudios para carrera 13
    SELECT id INTO v_plan_id FROM plan_estudios
    WHERE carrera_id = v_carrera_id AND anio_vigencia = 2024 LIMIT 1;
    IF v_plan_id IS NULL THEN
        INSERT INTO plan_estudios (carrera_id, nombre, anio_vigencia, activo)
        VALUES (v_carrera_id, 'Plan 2024', 2024, true)
        RETURNING id INTO v_plan_id;
    END IF;

    -- 2. Insertar o reutilizar Materias (identificadas por codigo)
    SELECT id INTO v_INGM104 FROM materias WHERE codigo = 'INGM104';
    IF v_INGM104 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Álgebra I-A', 'INGM104', false)
        RETURNING id INTO v_INGM104;
    END IF;

    SELECT id INTO v_INGM101 FROM materias WHERE codigo = 'INGM101';
    IF v_INGM101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático I', 'INGM101', false)
        RETURNING id INTO v_INGM101;
    END IF;

    SELECT id INTO v_ING1103 FROM materias WHERE codigo = 'ING1103';
    IF v_ING1103 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fundamentos de Química', 'ING1103', false)
        RETURNING id INTO v_ING1103;
    END IF;

    SELECT id INTO v_ING8408 FROM materias WHERE codigo = 'ING8408';
    IF v_ING8408 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Inglés I', 'ING8408', false)
        RETURNING id INTO v_ING8408;
    END IF;

    SELECT id INTO v_INGM106 FROM materias WHERE codigo = 'INGM106';
    IF v_INGM106 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Álgebra II', 'INGM106', false)
        RETURNING id INTO v_INGM106;
    END IF;

    SELECT id INTO v_INGM102 FROM materias WHERE codigo = 'INGM102';
    IF v_INGM102 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático II', 'INGM102', false)
        RETURNING id INTO v_INGM102;
    END IF;

    SELECT id INTO v_INGF101 FROM materias WHERE codigo = 'INGF101';
    IF v_INGF101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física A', 'INGF101', false)
        RETURNING id INTO v_INGF101;
    END IF;

    SELECT id INTO v_ING6101 FROM materias WHERE codigo = 'ING6101';
    IF v_ING6101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fundamentos de la Programación', 'ING6101', false)
        RETURNING id INTO v_ING6101;
    END IF;

    SELECT id INTO v_ING8409 FROM materias WHERE codigo = 'ING8409';
    IF v_ING8409 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Inglés II', 'ING8409', false)
        RETURNING id INTO v_ING8409;
    END IF;

    SELECT id INTO v_INGM103 FROM materias WHERE codigo = 'INGM103';
    IF v_INGM103 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático III', 'INGM103', false)
        RETURNING id INTO v_INGM103;
    END IF;

    SELECT id INTO v_INGF102 FROM materias WHERE codigo = 'INGF102';
    IF v_INGF102 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física B-I', 'INGF102', false)
        RETURNING id INTO v_INGF102;
    END IF;

    SELECT id INTO v_ING5201 FROM materias WHERE codigo = 'ING5201';
    IF v_ING5201 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Introducción a la Ciencia de los Materiales', 'ING5201', false)
        RETURNING id INTO v_ING5201;
    END IF;

    SELECT id INTO v_ING2207 FROM materias WHERE codigo = 'ING2207';
    IF v_ING2207 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Estática I', 'ING2207', false)
        RETURNING id INTO v_ING2207;
    END IF;

    SELECT id INTO v_INGF104 FROM materias WHERE codigo = 'INGF104';
    IF v_INGF104 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física C-I', 'INGF104', false)
        RETURNING id INTO v_INGF104;
    END IF;

    SELECT id INTO v_INGM109 FROM materias WHERE codigo = 'INGM109';
    IF v_INGM109 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Métodos Numéricos para Ingeniería', 'INGM109', false)
        RETURNING id INTO v_INGM109;
    END IF;

    SELECT id INTO v_ING5101 FROM materias WHERE codigo = 'ING5101';
    IF v_ING5101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Introducción al Diseño 3D', 'ING5101', false)
        RETURNING id INTO v_ING5101;
    END IF;

    SELECT id INTO v_ING5205 FROM materias WHERE codigo = 'ING5205';
    IF v_ING5205 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Termodinámica de Materiales', 'ING5205', false)
        RETURNING id INTO v_ING5205;
    END IF;

    SELECT id INTO v_ING2208 FROM materias WHERE codigo = 'ING2208';
    IF v_ING2208 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Estática II', 'ING2208', false)
        RETURNING id INTO v_ING2208;
    END IF;

    SELECT id INTO v_INGF201 FROM materias WHERE codigo = 'INGF201';
    IF v_INGF201 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Introducción a la Física del Estado Sólido', 'INGF201', false)
        RETURNING id INTO v_INGF201;
    END IF;

    SELECT id INTO v_INGF106 FROM materias WHERE codigo = 'INGF106';
    IF v_INGF106 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física Experimental A', 'INGF106', false)
        RETURNING id INTO v_INGF106;
    END IF;

    SELECT id INTO v_ING5203 FROM materias WHERE codigo = 'ING5203';
    IF v_ING5203 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Mecánica de Materiales y Componentes', 'ING5203', false)
        RETURNING id INTO v_ING5203;
    END IF;

    SELECT id INTO v_ING5204 FROM materias WHERE codigo = 'ING5204';
    IF v_ING5204 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Química del Estado Sólido', 'ING5204', false)
        RETURNING id INTO v_ING5204;
    END IF;

    SELECT id INTO v_ING8403 FROM materias WHERE codigo = 'ING8403';
    IF v_ING8403 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Economía para Ingeniería', 'ING8403', false)
        RETURNING id INTO v_ING8403;
    END IF;

    SELECT id INTO v_ING5305 FROM materias WHERE codigo = 'ING5305';
    IF v_ING5305 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fluidodinámica', 'ING5305', false)
        RETURNING id INTO v_ING5305;
    END IF;

    SELECT id INTO v_ING5202 FROM materias WHERE codigo = 'ING5202';
    IF v_ING5202 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Introducción a Polímeros', 'ING5202', false)
        RETURNING id INTO v_ING5202;
    END IF;

    SELECT id INTO v_ING5313 FROM materias WHERE codigo = 'ING5313';
    IF v_ING5313 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Propiedades Funcionales de Materiales', 'ING5313', false)
        RETURNING id INTO v_ING5313;
    END IF;

    SELECT id INTO v_ING5206 FROM materias WHERE codigo = 'ING5206';
    IF v_ING5206 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fundamentos de Metalurgia Física', 'ING5206', false)
        RETURNING id INTO v_ING5206;
    END IF;

    SELECT id INTO v_ING5302 FROM materias WHERE codigo = 'ING5302';
    IF v_ING5302 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Cerámica de Aplicación Industrial', 'ING5302', false)
        RETURNING id INTO v_ING5302;
    END IF;

    SELECT id INTO v_ING5315 FROM materias WHERE codigo = 'ING5315';
    IF v_ING5315 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Transporte de Calor y Materia', 'ING5315', false)
        RETURNING id INTO v_ING5315;
    END IF;

    SELECT id INTO v_ING8405 FROM materias WHERE codigo = 'ING8405';
    IF v_ING8405 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Ética, Legislación y Propiedad Intelectual en el Ejercicio Profesional', 'ING8405', false)
        RETURNING id INTO v_ING8405;
    END IF;

    SELECT id INTO v_ING5307 FROM materias WHERE codigo = 'ING5307';
    IF v_ING5307 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Modelado y Simulación de Materiales I', 'ING5307', false)
        RETURNING id INTO v_ING5307;
    END IF;

    SELECT id INTO v_ING5312 FROM materias WHERE codigo = 'ING5312';
    IF v_ING5312 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Propiedades Estructurales de Metales', 'ING5312', false)
        RETURNING id INTO v_ING5312;
    END IF;

    SELECT id INTO v_ING5303 FROM materias WHERE codigo = 'ING5303';
    IF v_ING5303 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Comportamiento Mecánico de Polímeros y Cerámicos', 'ING5303', false)
        RETURNING id INTO v_ING5303;
    END IF;

    SELECT id INTO v_ING5308 FROM materias WHERE codigo = 'ING5308';
    IF v_ING5308 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Modelado y Simulación de Materiales II', 'ING5308', false)
        RETURNING id INTO v_ING5308;
    END IF;

    SELECT id INTO v_ING5311 FROM materias WHERE codigo = 'ING5311';
    IF v_ING5311 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Procesamiento de Plásticos', 'ING5311', false)
        RETURNING id INTO v_ING5311;
    END IF;

    SELECT id INTO v_ING5304 FROM materias WHERE codigo = 'ING5304';
    IF v_ING5304 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Corrosión de Metales y Aleaciones', 'ING5304', false)
        RETURNING id INTO v_ING5304;
    END IF;

    SELECT id INTO v_ING5309 FROM materias WHERE codigo = 'ING5309';
    IF v_ING5309 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Procesamiento de Compuestos', 'ING5309', false)
        RETURNING id INTO v_ING5309;
    END IF;

    SELECT id INTO v_ING5310 FROM materias WHERE codigo = 'ING5310';
    IF v_ING5310 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Procesamiento de Metales', 'ING5310', false)
        RETURNING id INTO v_ING5310;
    END IF;

    SELECT id INTO v_ING8406 FROM materias WHERE codigo = 'ING8406';
    IF v_ING8406 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Formulación y Evaluación de Proyectos de Inversión', 'ING8406', false)
        RETURNING id INTO v_ING8406;
    END IF;

    SELECT id INTO v_ING8411 FROM materias WHERE codigo = 'ING8411';
    IF v_ING8411 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Organización Empresarial e Industrial', 'ING8411', false)
        RETURNING id INTO v_ING8411;
    END IF;

    SELECT id INTO v_ING5301 FROM materias WHERE codigo = 'ING5301';
    IF v_ING5301 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Adquisición y Análisis de la Información Experimental', 'ING5301', false)
        RETURNING id INTO v_ING5301;
    END IF;

    SELECT id INTO v_ING5316 FROM materias WHERE codigo = 'ING5316';
    IF v_ING5316 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Trabajo Final (ANUAL)', 'ING5316', false)
        RETURNING id INTO v_ING5316;
    END IF;

    SELECT id INTO v_ING5306 FROM materias WHERE codigo = 'ING5306';
    IF v_ING5306 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Laboratorio de Transformación de Materiales', 'ING5306', false)
        RETURNING id INTO v_ING5306;
    END IF;

    SELECT id INTO v_ING5314 FROM materias WHERE codigo = 'ING5314';
    IF v_ING5314 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Selección de Materiales', 'ING5314', false)
        RETURNING id INTO v_ING5314;
    END IF;

    SELECT id INTO v_ING8412 FROM materias WHERE codigo = 'ING8412';
    IF v_ING8412 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Seguridad y Salud Ocupacional', 'ING8412', false)
        RETURNING id INTO v_ING8412;
    END IF;

    SELECT id INTO v_ING8413 FROM materias WHERE codigo = 'ING8413';
    IF v_ING8413 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Sistemas de Gestión Integrados', 'ING8413', false)
        RETURNING id INTO v_ING8413;
    END IF;

    -- 3. Vincular materias al plan (plan_materia)
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM104, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM101, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1103, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8408, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM106, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM102, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF101, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6101, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8409, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM103, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF102, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5201, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2207, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF104, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM109, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5101, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5205, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2208, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF201, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF106, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5203, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5204, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8403, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5305, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5202, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5313, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5206, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5302, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5315, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8405, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5307, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5312, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5303, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5308, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5311, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5304, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5309, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5310, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8406, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8411, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5301, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5316, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5306, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING5314, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8412, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8413, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;

    -- 4. Insertar Correlativas
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM106, v_INGM104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM102, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF101, v_INGM104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF101, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6101, v_INGM104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6101, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8409, v_ING8408)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM103, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM103, v_INGM106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF102, v_INGM106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF102, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF102, v_INGF101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5201, v_ING1103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5201, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2207, v_INGM106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF104, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF104, v_INGF102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM109, v_ING6101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM109, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5101, v_INGM106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5205, v_ING1103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5205, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5205, v_INGF101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2208, v_ING2207)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF201, v_INGF104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF106, v_INGF102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5203, v_ING2208)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5204, v_ING5201)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5204, v_ING5205)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8403, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5305, v_ING5201)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5305, v_INGM109)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5305, v_ING5101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5202, v_ING5201)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5202, v_ING5205)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5313, v_INGF201)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5206, v_ING5204)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5206, v_ING2208)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5302, v_ING5204)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5315, v_ING5305)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8405, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5307, v_ING5203)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5307, v_ING5315)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5312, v_ING5206)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5303, v_ING5202)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5303, v_ING5312)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5308, v_ING5307)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5311, v_ING5315)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5311, v_ING5202)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5304, v_ING5312)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5309, v_ING5315)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5309, v_ING5311)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5310, v_ING5312)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8406, v_ING8403)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8411, v_ING8403)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5301, v_ING5312)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5316, v_ING5303)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5316, v_ING5307)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5316, v_ING5311)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5306, v_ING5309)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5306, v_ING5310)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5306, v_ING5302)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING5314, v_ING5310)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8412, v_ING8411)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8413, v_ING8411)
    ON CONFLICT DO NOTHING;
END $$;

-- INGENIERIA ELECTRICA

-- Carga de Materias y Correlativas para Plan 2024 - Carrera 14
-- Generado por generate_plan_sql.py

DO $$
DECLARE
    v_plan_id int;
    v_INGM101 int;
    v_INGM104 int;
    v_ING1103 int;
    v_ING2104 int;
    v_INGM102 int;
    v_INGM106 int;
    v_INGF101 int;
    v_ING6101 int;
    v_INGF102 int;
    v_INGM103 int;
    v_ING2223 int;
    v_ING8408 int;
    v_INGF104 int;
    v_ING3201 int;
    v_ING2216 int;
    v_INGM108 int;
    v_ING8409 int;
    v_ING3202 int;
    v_ING3205 int;
    v_ING3301 int;
    v_ING2224 int;
    v_ING8403 int;
    v_ING3207 int;
    v_ING3206 int;
    v_ING3101 int;
    v_ING4216 int;
    v_ING3203 int;
    v_ING3208 int;
    v_ING3102 int;
    v_ING3304 int;
    v_ING8411 int;
    v_ING8406 int;
    v_ING3306 int;
    v_ING3305 int;
    v_ING3302 int;
    v_ING4316 int;
    v_ING8412 int;
    v_ING3309 int;
    v_ING3307 int;
    v_ING3303 int;
    v_ING4317 int;
    v_ING8405 int;
    v_ING3314 int;
    v_ING3310 int;
    v_ING3308 int;
    v_ING3312 int;
    v_ING8413 int;
    v_ING3315 int;
    v_ING3313 int;
    v_carrera_id int;
BEGIN
    SELECT id INTO v_carrera_id FROM carreras WHERE nombre = 'Ingenieria en Electrica' LIMIT 1;
    -- 1. Buscar o crear Plan de Estudios para carrera 14
    SELECT id INTO v_plan_id FROM plan_estudios
    WHERE carrera_id = v_carrera_id AND anio_vigencia = 2024 LIMIT 1;
    IF v_plan_id IS NULL THEN
        INSERT INTO plan_estudios (carrera_id, nombre, anio_vigencia, activo)
        VALUES (v_carrera_id, 'Plan 2024', 2024, true)
        RETURNING id INTO v_plan_id;
    END IF;

    -- 2. Insertar o reutilizar Materias (identificadas por codigo)
    SELECT id INTO v_INGM101 FROM materias WHERE codigo = 'INGM101';
    IF v_INGM101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático I', 'INGM101', false)
        RETURNING id INTO v_INGM101;
    END IF;

    SELECT id INTO v_INGM104 FROM materias WHERE codigo = 'INGM104';
    IF v_INGM104 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Álgebra I-A', 'INGM104', false)
        RETURNING id INTO v_INGM104;
    END IF;

    SELECT id INTO v_ING1103 FROM materias WHERE codigo = 'ING1103';
    IF v_ING1103 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fundamentos de Química', 'ING1103', false)
        RETURNING id INTO v_ING1103;
    END IF;

    SELECT id INTO v_ING2104 FROM materias WHERE codigo = 'ING2104';
    IF v_ING2104 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Sistemas de Representación para Ingeniería', 'ING2104', false)
        RETURNING id INTO v_ING2104;
    END IF;

    SELECT id INTO v_INGM102 FROM materias WHERE codigo = 'INGM102';
    IF v_INGM102 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático II', 'INGM102', false)
        RETURNING id INTO v_INGM102;
    END IF;

    SELECT id INTO v_INGM106 FROM materias WHERE codigo = 'INGM106';
    IF v_INGM106 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Álgebra II', 'INGM106', false)
        RETURNING id INTO v_INGM106;
    END IF;

    SELECT id INTO v_INGF101 FROM materias WHERE codigo = 'INGF101';
    IF v_INGF101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física A', 'INGF101', false)
        RETURNING id INTO v_INGF101;
    END IF;

    SELECT id INTO v_ING6101 FROM materias WHERE codigo = 'ING6101';
    IF v_ING6101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fundamentos de la Programación', 'ING6101', false)
        RETURNING id INTO v_ING6101;
    END IF;

    SELECT id INTO v_INGF102 FROM materias WHERE codigo = 'INGF102';
    IF v_INGF102 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física B-I', 'INGF102', false)
        RETURNING id INTO v_INGF102;
    END IF;

    SELECT id INTO v_INGM103 FROM materias WHERE codigo = 'INGM103';
    IF v_INGM103 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático III', 'INGM103', false)
        RETURNING id INTO v_INGM103;
    END IF;

    SELECT id INTO v_ING2223 FROM materias WHERE codigo = 'ING2223';
    IF v_ING2223 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fundamentos de Estática y Resistencia de Materiales', 'ING2223', false)
        RETURNING id INTO v_ING2223;
    END IF;

    SELECT id INTO v_ING8408 FROM materias WHERE codigo = 'ING8408';
    IF v_ING8408 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Inglés I', 'ING8408', false)
        RETURNING id INTO v_ING8408;
    END IF;

    SELECT id INTO v_INGF104 FROM materias WHERE codigo = 'INGF104';
    IF v_INGF104 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física C-I', 'INGF104', false)
        RETURNING id INTO v_INGF104;
    END IF;

    SELECT id INTO v_ING3201 FROM materias WHERE codigo = 'ING3201';
    IF v_ING3201 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Electrotecnia A', 'ING3201', false)
        RETURNING id INTO v_ING3201;
    END IF;

    SELECT id INTO v_ING2216 FROM materias WHERE codigo = 'ING2216';
    IF v_ING2216 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Introducción a la Termodinámica y Máquinas Térmicas', 'ING2216', false)
        RETURNING id INTO v_ING2216;
    END IF;

    SELECT id INTO v_INGM108 FROM materias WHERE codigo = 'INGM108';
    IF v_INGM108 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Probabilidad y Estadística', 'INGM108', false)
        RETURNING id INTO v_INGM108;
    END IF;

    SELECT id INTO v_ING8409 FROM materias WHERE codigo = 'ING8409';
    IF v_ING8409 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Inglés II', 'ING8409', false)
        RETURNING id INTO v_ING8409;
    END IF;

    SELECT id INTO v_ING3202 FROM materias WHERE codigo = 'ING3202';
    IF v_ING3202 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Electrotecnia B', 'ING3202', false)
        RETURNING id INTO v_ING3202;
    END IF;

    SELECT id INTO v_ING3205 FROM materias WHERE codigo = 'ING3205';
    IF v_ING3205 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Mediciones Eléctricas A', 'ING3205', false)
        RETURNING id INTO v_ING3205;
    END IF;

    SELECT id INTO v_ING3301 FROM materias WHERE codigo = 'ING3301';
    IF v_ING3301 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Automatización A', 'ING3301', false)
        RETURNING id INTO v_ING3301;
    END IF;

    SELECT id INTO v_ING2224 FROM materias WHERE codigo = 'ING2224';
    IF v_ING2224 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Introducción a la Mecánica de los Fluidos', 'ING2224', false)
        RETURNING id INTO v_ING2224;
    END IF;

    SELECT id INTO v_ING8403 FROM materias WHERE codigo = 'ING8403';
    IF v_ING8403 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Economía para Ingeniería', 'ING8403', false)
        RETURNING id INTO v_ING8403;
    END IF;

    SELECT id INTO v_ING3207 FROM materias WHERE codigo = 'ING3207';
    IF v_ING3207 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Máquinas Eléctricas A', 'ING3207', false)
        RETURNING id INTO v_ING3207;
    END IF;

    SELECT id INTO v_ING3206 FROM materias WHERE codigo = 'ING3206';
    IF v_ING3206 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Mediciones Eléctricas B', 'ING3206', false)
        RETURNING id INTO v_ING3206;
    END IF;

    SELECT id INTO v_ING3101 FROM materias WHERE codigo = 'ING3101';
    IF v_ING3101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Tecnología CAD aplicada', 'ING3101', false)
        RETURNING id INTO v_ING3101;
    END IF;

    SELECT id INTO v_ING4216 FROM materias WHERE codigo = 'ING4216';
    IF v_ING4216 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Principios de Electrónica', 'ING4216', false)
        RETURNING id INTO v_ING4216;
    END IF;

    SELECT id INTO v_ING3203 FROM materias WHERE codigo = 'ING3203';
    IF v_ING3203 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Electrotecnia C', 'ING3203', false)
        RETURNING id INTO v_ING3203;
    END IF;

    SELECT id INTO v_ING3208 FROM materias WHERE codigo = 'ING3208';
    IF v_ING3208 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Máquinas Eléctricas B', 'ING3208', false)
        RETURNING id INTO v_ING3208;
    END IF;

    SELECT id INTO v_ING3102 FROM materias WHERE codigo = 'ING3102';
    IF v_ING3102 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Materiales Electrotécnicos', 'ING3102', false)
        RETURNING id INTO v_ING3102;
    END IF;

    SELECT id INTO v_ING3304 FROM materias WHERE codigo = 'ING3304';
    IF v_ING3304 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Instalaciones Eléctricas A', 'ING3304', false)
        RETURNING id INTO v_ING3304;
    END IF;

    SELECT id INTO v_ING8411 FROM materias WHERE codigo = 'ING8411';
    IF v_ING8411 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Organización Empresarial e Industrial', 'ING8411', false)
        RETURNING id INTO v_ING8411;
    END IF;

    SELECT id INTO v_ING8406 FROM materias WHERE codigo = 'ING8406';
    IF v_ING8406 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Formulación y Evaluación de Proyectos de Inversión', 'ING8406', false)
        RETURNING id INTO v_ING8406;
    END IF;

    SELECT id INTO v_ING3306 FROM materias WHERE codigo = 'ING3306';
    IF v_ING3306 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Sistemas de Transmisión de Energía Eléctrica', 'ING3306', false)
        RETURNING id INTO v_ING3306;
    END IF;

    SELECT id INTO v_ING3305 FROM materias WHERE codigo = 'ING3305';
    IF v_ING3305 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Instalaciones Eléctricas B', 'ING3305', false)
        RETURNING id INTO v_ING3305;
    END IF;

    SELECT id INTO v_ING3302 FROM materias WHERE codigo = 'ING3302';
    IF v_ING3302 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Automatización B', 'ING3302', false)
        RETURNING id INTO v_ING3302;
    END IF;

    SELECT id INTO v_ING4316 FROM materias WHERE codigo = 'ING4316';
    IF v_ING4316 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Electrónica de Potencia I', 'ING4316', false)
        RETURNING id INTO v_ING4316;
    END IF;

    SELECT id INTO v_ING8412 FROM materias WHERE codigo = 'ING8412';
    IF v_ING8412 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Seguridad y Salud Ocupacional', 'ING8412', false)
        RETURNING id INTO v_ING8412;
    END IF;

    SELECT id INTO v_ING3309 FROM materias WHERE codigo = 'ING3309';
    IF v_ING3309 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Generación de Energía Eléctrica A', 'ING3309', false)
        RETURNING id INTO v_ING3309;
    END IF;

    SELECT id INTO v_ING3307 FROM materias WHERE codigo = 'ING3307';
    IF v_ING3307 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Sistemas de Distribución de Energía Eléctrica', 'ING3307', false)
        RETURNING id INTO v_ING3307;
    END IF;

    SELECT id INTO v_ING3303 FROM materias WHERE codigo = 'ING3303';
    IF v_ING3303 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Accionamientos con Motor Eléctrico', 'ING3303', false)
        RETURNING id INTO v_ING3303;
    END IF;

    SELECT id INTO v_ING4317 FROM materias WHERE codigo = 'ING4317';
    IF v_ING4317 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Control I', 'ING4317', false)
        RETURNING id INTO v_ING4317;
    END IF;

    SELECT id INTO v_ING8405 FROM materias WHERE codigo = 'ING8405';
    IF v_ING8405 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Ética, Legislación y Propiedad Intelectual en el Ejercicio Profesional', 'ING8405', false)
        RETURNING id INTO v_ING8405;
    END IF;

    SELECT id INTO v_ING3314 FROM materias WHERE codigo = 'ING3314';
    IF v_ING3314 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Optativa I', 'ING3314', false)
        RETURNING id INTO v_ING3314;
    END IF;

    SELECT id INTO v_ING3310 FROM materias WHERE codigo = 'ING3310';
    IF v_ING3310 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Generación de Energía Eléctrica B', 'ING3310', false)
        RETURNING id INTO v_ING3310;
    END IF;

    SELECT id INTO v_ING3308 FROM materias WHERE codigo = 'ING3308';
    IF v_ING3308 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Protección y Análisis de Sistemas de Potencia', 'ING3308', false)
        RETURNING id INTO v_ING3308;
    END IF;

    SELECT id INTO v_ING3312 FROM materias WHERE codigo = 'ING3312';
    IF v_ING3312 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Redes Eléctricas Inteligentes', 'ING3312', false)
        RETURNING id INTO v_ING3312;
    END IF;

    SELECT id INTO v_ING8413 FROM materias WHERE codigo = 'ING8413';
    IF v_ING8413 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Sistemas de Gestión Integrados', 'ING8413', false)
        RETURNING id INTO v_ING8413;
    END IF;

    SELECT id INTO v_ING3315 FROM materias WHERE codigo = 'ING3315';
    IF v_ING3315 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Optativa II', 'ING3315', false)
        RETURNING id INTO v_ING3315;
    END IF;

    SELECT id INTO v_ING3313 FROM materias WHERE codigo = 'ING3313';
    IF v_ING3313 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Trabajo Final', 'ING3313', false)
        RETURNING id INTO v_ING3313;
    END IF;

    -- 3. Vincular materias al plan (plan_materia)
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM101, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM104, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1103, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2104, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM102, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM106, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF101, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6101, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF102, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM103, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2223, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8408, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF104, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3201, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2216, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM108, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8409, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3202, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3205, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3301, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2224, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8403, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3207, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3206, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3101, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4216, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3203, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3208, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3102, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3304, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8411, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8406, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3306, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3305, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3302, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4316, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8412, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3309, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3307, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3303, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4317, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8405, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3314, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3310, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3308, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3312, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8413, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3315, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3313, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;

    -- 4. Insertar Correlativas
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM102, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM106, v_INGM104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF101, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF101, v_INGM104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6101, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6101, v_INGM104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF102, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF102, v_INGM106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF102, v_INGF101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM103, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM103, v_INGM106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2223, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2223, v_INGM106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2223, v_INGF101)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF104, v_INGF102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3201, v_INGF102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3201, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2216, v_ING1103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2216, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2216, v_INGF101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM108, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8409, v_ING8408)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3202, v_ING3201)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3202, v_INGF104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3205, v_INGM108)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3205, v_ING3201)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3301, v_ING3201)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2224, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2224, v_INGF101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8403, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3207, v_ING3205)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3207, v_ING3202)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3206, v_ING3205)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3206, v_ING3202)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3206, v_ING3301)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3101, v_ING2104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4216, v_ING3301)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3203, v_ING3202)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3208, v_ING3207)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3102, v_ING1103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3102, v_ING3206)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3304, v_ING3202)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3304, v_ING2223)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8411, v_ING8403)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8406, v_ING8403)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3306, v_ING3304)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3306, v_ING3208)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3306, v_ING3102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3306, v_ING3203)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3305, v_ING3304)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3305, v_ING3207)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3305, v_ING3101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3302, v_ING3301)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4316, v_ING4216)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8412, v_ING8411)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3309, v_ING2216)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3309, v_ING3306)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3307, v_ING3306)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3303, v_ING3304)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3303, v_ING3207)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4317, v_ING4216)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8405, v_INGM103)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): (++)
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3310, v_ING3309)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3308, v_ING3309)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3312, v_ING3307)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8413, v_ING8411)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): (++)
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3313, v_ING3305)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3313, v_ING3306)
    ON CONFLICT DO NOTHING;
END $$;


-- INGENIERIA MECANICA

-- Carga de Materias y Correlativas para Plan 2024 - Carrera 15
-- Generado por generate_plan_sql.py

DO $$
DECLARE
    v_plan_id int;
    v_ING2101 int;
    v_INGM101 int;
    v_INGM104 int;
    v_ING1103 int;
    v_ING2401 int;
    v_ING2102 int;
    v_INGM102 int;
    v_INGM106 int;
    v_INGF101 int;
    v_ING2201 int;
    v_ING2207 int;
    v_INGM103 int;
    v_INGF103 int;
    v_ING8408 int;
    v_ING2214 int;
    v_ING2208 int;
    v_ING6101 int;
    v_INGF105 int;
    v_ING3204 int;
    v_ING8409 int;
    v_ING2203 int;
    v_INGF106 int;
    v_ING8411 int;
    v_ING2209 int;
    v_ING2202 int;
    v_ING2103 int;
    v_ING2306 int;
    v_ING2213 int;
    v_ING2205 int;
    v_ING2212 int;
    v_ING2204 int;
    v_ING2304 int;
    v_ING2210 int;
    v_ING2206 int;
    v_ING2301 int;
    v_ING8405 int;
    v_ING2310 int;
    v_ING2303 int;
    v_ING2305 int;
    v_ING2307 int;
    v_ING8403 int;
    v_ING2302 int;
    v_ING2314 int;
    v_ING2315 int;
    v_ING2316 int;
    v_ING2308 int;
    v_ING8412 int;
    v_ING2215 int;
    v_ING2317 int;
    v_ING2318 int;
    v_ING2325 int;
    v_ING2309 int;
    v_carrera_id int;
BEGIN
    SELECT id INTO v_carrera_id FROM carreras WHERE nombre = 'Ingenieria Mecanica' LIMIT 1;
    -- 1. Buscar o crear Plan de Estudios para carrera 15
    SELECT id INTO v_plan_id FROM plan_estudios
    WHERE carrera_id = v_carrera_id AND anio_vigencia = 2024 LIMIT 1;
    IF v_plan_id IS NULL THEN
        INSERT INTO plan_estudios (carrera_id, nombre, anio_vigencia, activo)
        VALUES (v_carrera_id, 'Plan 2024', 2024, true)
        RETURNING id INTO v_plan_id;
    END IF;

    -- 2. Insertar o reutilizar Materias (identificadas por codigo)
    SELECT id INTO v_ING2101 FROM materias WHERE codigo = 'ING2101';
    IF v_ING2101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Dibujo A', 'ING2101', false)
        RETURNING id INTO v_ING2101;
    END IF;

    SELECT id INTO v_INGM101 FROM materias WHERE codigo = 'INGM101';
    IF v_INGM101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático I', 'INGM101', false)
        RETURNING id INTO v_INGM101;
    END IF;

    SELECT id INTO v_INGM104 FROM materias WHERE codigo = 'INGM104';
    IF v_INGM104 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Álgebra I-A', 'INGM104', false)
        RETURNING id INTO v_INGM104;
    END IF;

    SELECT id INTO v_ING1103 FROM materias WHERE codigo = 'ING1103';
    IF v_ING1103 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fundamentos de Química', 'ING1103', false)
        RETURNING id INTO v_ING1103;
    END IF;

    SELECT id INTO v_ING2401 FROM materias WHERE codigo = 'ING2401';
    IF v_ING2401 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Introducción a la Ingeniería Mecánica (anual)', 'ING2401', false)
        RETURNING id INTO v_ING2401;
    END IF;

    SELECT id INTO v_ING2102 FROM materias WHERE codigo = 'ING2102';
    IF v_ING2102 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Dibujo B', 'ING2102', false)
        RETURNING id INTO v_ING2102;
    END IF;

    SELECT id INTO v_INGM102 FROM materias WHERE codigo = 'INGM102';
    IF v_INGM102 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático II', 'INGM102', false)
        RETURNING id INTO v_INGM102;
    END IF;

    SELECT id INTO v_INGM106 FROM materias WHERE codigo = 'INGM106';
    IF v_INGM106 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Álgebra II', 'INGM106', false)
        RETURNING id INTO v_INGM106;
    END IF;

    SELECT id INTO v_INGF101 FROM materias WHERE codigo = 'INGF101';
    IF v_INGF101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física A', 'INGF101', false)
        RETURNING id INTO v_INGF101;
    END IF;

    SELECT id INTO v_ING2201 FROM materias WHERE codigo = 'ING2201';
    IF v_ING2201 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Mecanismos y Elementos de la Mecánica', 'ING2201', false)
        RETURNING id INTO v_ING2201;
    END IF;

    SELECT id INTO v_ING2207 FROM materias WHERE codigo = 'ING2207';
    IF v_ING2207 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Estática I', 'ING2207', false)
        RETURNING id INTO v_ING2207;
    END IF;

    SELECT id INTO v_INGM103 FROM materias WHERE codigo = 'INGM103';
    IF v_INGM103 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático III', 'INGM103', false)
        RETURNING id INTO v_INGM103;
    END IF;

    SELECT id INTO v_INGF103 FROM materias WHERE codigo = 'INGF103';
    IF v_INGF103 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física B-II', 'INGF103', false)
        RETURNING id INTO v_INGF103;
    END IF;

    SELECT id INTO v_ING8408 FROM materias WHERE codigo = 'ING8408';
    IF v_ING8408 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Inglés I', 'ING8408', false)
        RETURNING id INTO v_ING8408;
    END IF;

    SELECT id INTO v_ING2214 FROM materias WHERE codigo = 'ING2214';
    IF v_ING2214 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Aplicaciones de la Hidráulica y Neumática', 'ING2214', false)
        RETURNING id INTO v_ING2214;
    END IF;

    SELECT id INTO v_ING2208 FROM materias WHERE codigo = 'ING2208';
    IF v_ING2208 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Estática II', 'ING2208', false)
        RETURNING id INTO v_ING2208;
    END IF;

    SELECT id INTO v_ING6101 FROM materias WHERE codigo = 'ING6101';
    IF v_ING6101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fundamentos de la Programación', 'ING6101', false)
        RETURNING id INTO v_ING6101;
    END IF;

    SELECT id INTO v_INGF105 FROM materias WHERE codigo = 'INGF105';
    IF v_INGF105 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física C-II', 'INGF105', false)
        RETURNING id INTO v_INGF105;
    END IF;

    SELECT id INTO v_ING3204 FROM materias WHERE codigo = 'ING3204';
    IF v_ING3204 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Electrotecnia D', 'ING3204', false)
        RETURNING id INTO v_ING3204;
    END IF;

    SELECT id INTO v_ING8409 FROM materias WHERE codigo = 'ING8409';
    IF v_ING8409 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Inglés II', 'ING8409', false)
        RETURNING id INTO v_ING8409;
    END IF;

    SELECT id INTO v_ING2203 FROM materias WHERE codigo = 'ING2203';
    IF v_ING2203 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Termodinámica para Ingeniería Mecánica', 'ING2203', false)
        RETURNING id INTO v_ING2203;
    END IF;

    SELECT id INTO v_INGF106 FROM materias WHERE codigo = 'INGF106';
    IF v_INGF106 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física Experimental A', 'INGF106', false)
        RETURNING id INTO v_INGF106;
    END IF;

    SELECT id INTO v_ING8411 FROM materias WHERE codigo = 'ING8411';
    IF v_ING8411 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Organización Empresarial e Industrial', 'ING8411', false)
        RETURNING id INTO v_ING8411;
    END IF;

    SELECT id INTO v_ING2209 FROM materias WHERE codigo = 'ING2209';
    IF v_ING2209 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Introducción a la Mecánica del Continuo', 'ING2209', false)
        RETURNING id INTO v_ING2209;
    END IF;

    SELECT id INTO v_ING2202 FROM materias WHERE codigo = 'ING2202';
    IF v_ING2202 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Mecánica de la Partícula y del Cuerpo Rígido', 'ING2202', false)
        RETURNING id INTO v_ING2202;
    END IF;

    SELECT id INTO v_ING2103 FROM materias WHERE codigo = 'ING2103';
    IF v_ING2103 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Introducción al Modelado Computacional', 'ING2103', false)
        RETURNING id INTO v_ING2103;
    END IF;

    SELECT id INTO v_ING2306 FROM materias WHERE codigo = 'ING2306';
    IF v_ING2306 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Seminario de Energías Renovables', 'ING2306', false)
        RETURNING id INTO v_ING2306;
    END IF;

    SELECT id INTO v_ING2213 FROM materias WHERE codigo = 'ING2213';
    IF v_ING2213 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fluidos y Máquinas Fluidodinámicas', 'ING2213', false)
        RETURNING id INTO v_ING2213;
    END IF;

    SELECT id INTO v_ING2205 FROM materias WHERE codigo = 'ING2205';
    IF v_ING2205 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Materiales I', 'ING2205', false)
        RETURNING id INTO v_ING2205;
    END IF;

    SELECT id INTO v_ING2212 FROM materias WHERE codigo = 'ING2212';
    IF v_ING2212 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Conversión Electromecánica de la Energía', 'ING2212', false)
        RETURNING id INTO v_ING2212;
    END IF;

    SELECT id INTO v_ING2204 FROM materias WHERE codigo = 'ING2204';
    IF v_ING2204 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Metrología e Introducción a la Fabricación', 'ING2204', false)
        RETURNING id INTO v_ING2204;
    END IF;

    SELECT id INTO v_ING2304 FROM materias WHERE codigo = 'ING2304';
    IF v_ING2304 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Transferencia y Tecnología del Calor', 'ING2304', false)
        RETURNING id INTO v_ING2304;
    END IF;

    SELECT id INTO v_ING2210 FROM materias WHERE codigo = 'ING2210';
    IF v_ING2210 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Vibraciones Mecánicas', 'ING2210', false)
        RETURNING id INTO v_ING2210;
    END IF;

    SELECT id INTO v_ING2206 FROM materias WHERE codigo = 'ING2206';
    IF v_ING2206 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Materiales II', 'ING2206', false)
        RETURNING id INTO v_ING2206;
    END IF;

    SELECT id INTO v_ING2301 FROM materias WHERE codigo = 'ING2301';
    IF v_ING2301 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Elementos de Máquinas (anual)', 'ING2301', false)
        RETURNING id INTO v_ING2301;
    END IF;

    SELECT id INTO v_ING8405 FROM materias WHERE codigo = 'ING8405';
    IF v_ING8405 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Ética, Legislación y Propiedad Intelectual en el Ejercicio Profesional', 'ING8405', false)
        RETURNING id INTO v_ING8405;
    END IF;

    SELECT id INTO v_ING2310 FROM materias WHERE codigo = 'ING2310';
    IF v_ING2310 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Tribología, Fricción, Desgaste y Lubricación', 'ING2310', false)
        RETURNING id INTO v_ING2310;
    END IF;

    SELECT id INTO v_ING2303 FROM materias WHERE codigo = 'ING2303';
    IF v_ING2303 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Sistemas Propulsivos I', 'ING2303', false)
        RETURNING id INTO v_ING2303;
    END IF;

    SELECT id INTO v_ING2305 FROM materias WHERE codigo = 'ING2305';
    IF v_ING2305 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Procesos de Fabricación I', 'ING2305', false)
        RETURNING id INTO v_ING2305;
    END IF;

    SELECT id INTO v_ING2307 FROM materias WHERE codigo = 'ING2307';
    IF v_ING2307 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Proyecto Integrador I', 'ING2307', false)
        RETURNING id INTO v_ING2307;
    END IF;

    SELECT id INTO v_ING8403 FROM materias WHERE codigo = 'ING8403';
    IF v_ING8403 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Economía para Ingeniería', 'ING8403', false)
        RETURNING id INTO v_ING8403;
    END IF;

    SELECT id INTO v_ING2302 FROM materias WHERE codigo = 'ING2302';
    IF v_ING2302 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Mantenimiento Industrial', 'ING2302', false)
        RETURNING id INTO v_ING2302;
    END IF;

    SELECT id INTO v_ING2314 FROM materias WHERE codigo = 'ING2314';
    IF v_ING2314 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Electiva I', 'ING2314', false)
        RETURNING id INTO v_ING2314;
    END IF;

    SELECT id INTO v_ING2315 FROM materias WHERE codigo = 'ING2315';
    IF v_ING2315 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Electiva II', 'ING2315', false)
        RETURNING id INTO v_ING2315;
    END IF;

    SELECT id INTO v_ING2316 FROM materias WHERE codigo = 'ING2316';
    IF v_ING2316 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Electiva III', 'ING2316', false)
        RETURNING id INTO v_ING2316;
    END IF;

    SELECT id INTO v_ING2308 FROM materias WHERE codigo = 'ING2308';
    IF v_ING2308 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Proyecto Integrador II', 'ING2308', false)
        RETURNING id INTO v_ING2308;
    END IF;

    SELECT id INTO v_ING8412 FROM materias WHERE codigo = 'ING8412';
    IF v_ING8412 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Seguridad y Salud Ocupacional', 'ING8412', false)
        RETURNING id INTO v_ING8412;
    END IF;

    SELECT id INTO v_ING2215 FROM materias WHERE codigo = 'ING2215';
    IF v_ING2215 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Electrónica de Control y Automatización', 'ING2215', false)
        RETURNING id INTO v_ING2215;
    END IF;

    SELECT id INTO v_ING2317 FROM materias WHERE codigo = 'ING2317';
    IF v_ING2317 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Electiva IV', 'ING2317', false)
        RETURNING id INTO v_ING2317;
    END IF;

    SELECT id INTO v_ING2318 FROM materias WHERE codigo = 'ING2318';
    IF v_ING2318 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Electiva V', 'ING2318', false)
        RETURNING id INTO v_ING2318;
    END IF;

    SELECT id INTO v_ING2325 FROM materias WHERE codigo = 'ING2325';
    IF v_ING2325 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Optativa', 'ING2325', false)
        RETURNING id INTO v_ING2325;
    END IF;

    SELECT id INTO v_ING2309 FROM materias WHERE codigo = 'ING2309';
    IF v_ING2309 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Proyecto Integrador III', 'ING2309', false)
        RETURNING id INTO v_ING2309;
    END IF;

    -- 3. Vincular materias al plan (plan_materia)
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2101, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM101, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM104, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1103, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2401, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2102, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM102, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM106, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF101, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2201, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2207, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM103, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF103, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8408, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2214, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2208, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6101, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF105, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3204, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8409, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2203, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF106, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8411, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2209, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2202, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2103, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2306, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2213, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2205, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2212, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2204, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2304, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2210, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2206, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2301, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8405, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2310, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2303, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2305, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2307, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8403, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2302, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2314, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2315, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2316, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2308, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8412, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2215, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2317, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2318, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2325, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2309, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;

    -- 4. Insertar Correlativas
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2102, v_ING2101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM102, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM106, v_INGM104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF101, v_INGM104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF101, v_INGM101)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ingeniería Mecánica
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2207, v_INGM106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM103, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM103, v_INGM106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF103, v_INGF101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF103, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF103, v_INGM106)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2214, v_ING2201)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2208, v_ING2207)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6101, v_INGM104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF105, v_INGF103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3204, v_INGF103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8409, v_ING8408)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2203, v_ING1103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF106, v_INGF105)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ingeniería Mecánica
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2209, v_ING2208)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2202, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2202, v_INGF101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2103, v_ING6101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2306, v_ING2203)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2213, v_ING2203)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2205, v_ING2209)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2212, v_ING3204)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2204, v_INGF106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2304, v_ING2213)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2210, v_ING2202)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2206, v_ING2205)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): Aplicaciones de Hidráulica y Neumática
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8405, v_ING8411)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2310, v_ING2206)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2303, v_ING2304)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2305, v_ING2204)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2307, v_ING2306)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8403, v_ING8412)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2302, v_ING2310)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2314, v_ING2307)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2315, v_ING2307)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2316, v_ING2307)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2308, v_ING2307)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8412, v_ING8405)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2215, v_ING2212)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2317, v_ING2307)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2318, v_ING2307)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2325, v_ING2307)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2309, v_ING2308)
    ON CONFLICT DO NOTHING;
END $$;


-- INGENIERIA ELECTROMECANICA
-- Carga de Materias y Correlativas para Plan 2024 - Carrera 16
-- Generado por generate_plan_sql.py

DO $$
DECLARE
    v_plan_id int;
    v_INGM101 int;
    v_INGM104 int;
    v_ING1103 int;
    v_ING2104 int;
    v_INGM102 int;
    v_INGM106 int;
    v_INGF101 int;
    v_ING6101 int;
    v_INGF102 int;
    v_INGM103 int;
    v_INGM108 int;
    v_ING8408 int;
    v_ING2207 int;
    v_INGF104 int;
    v_ING3201 int;
    v_ING2216 int;
    v_ING2208 int;
    v_ING8409 int;
    v_ING3202 int;
    v_ING3205 int;
    v_ING3301 int;
    v_ING2209 int;
    v_ING2225 int;
    v_ING8403 int;
    v_ING3207 int;
    v_ING3206 int;
    v_ING3101 int;
    v_ING4216 int;
    v_ING2213 int;
    v_ING3208 int;
    v_ING3102 int;
    v_ING2202 int;
    v_ING3304 int;
    v_ING8411 int;
    v_ING3305 int;
    v_ING4316 int;
    v_ING8412 int;
    v_ING8413 int;
    v_ING3311 int;
    v_ING2304 int;
    v_ING2311 int;
    v_ING8406 int;
    v_ING2302 int;
    v_ING8405 int;
    v_ING2301 int;
    v_ING2312 int;
    v_ING4317 int;
    v_ING3316 int;
    v_ING3317 int;
    v_ING3318 int;
    v_carrera_id int;
BEGIN
    SELECT id INTO v_carrera_id FROM carreras WHERE nombre = 'Ingenieria Electromecanica' LIMIT 1;
    -- 1. Buscar o crear Plan de Estudios para carrera 16
    SELECT id INTO v_plan_id FROM plan_estudios
    WHERE carrera_id = v_carrera_id AND anio_vigencia = 2024 LIMIT 1;
    IF v_plan_id IS NULL THEN
        INSERT INTO plan_estudios (carrera_id, nombre, anio_vigencia, activo)
        VALUES (v_carrera_id, 'Plan 2024', 2024, true)
        RETURNING id INTO v_plan_id;
    END IF;

    -- 2. Insertar o reutilizar Materias (identificadas por codigo)
    SELECT id INTO v_INGM101 FROM materias WHERE codigo = 'INGM101';
    IF v_INGM101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático I', 'INGM101', false)
        RETURNING id INTO v_INGM101;
    END IF;

    SELECT id INTO v_INGM104 FROM materias WHERE codigo = 'INGM104';
    IF v_INGM104 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Álgebra I-A', 'INGM104', false)
        RETURNING id INTO v_INGM104;
    END IF;

    SELECT id INTO v_ING1103 FROM materias WHERE codigo = 'ING1103';
    IF v_ING1103 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fundamentos de Química', 'ING1103', false)
        RETURNING id INTO v_ING1103;
    END IF;

    SELECT id INTO v_ING2104 FROM materias WHERE codigo = 'ING2104';
    IF v_ING2104 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Sistemas de Representación para Ingeniería', 'ING2104', false)
        RETURNING id INTO v_ING2104;
    END IF;

    SELECT id INTO v_INGM102 FROM materias WHERE codigo = 'INGM102';
    IF v_INGM102 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático II', 'INGM102', false)
        RETURNING id INTO v_INGM102;
    END IF;

    SELECT id INTO v_INGM106 FROM materias WHERE codigo = 'INGM106';
    IF v_INGM106 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Álgebra II', 'INGM106', false)
        RETURNING id INTO v_INGM106;
    END IF;

    SELECT id INTO v_INGF101 FROM materias WHERE codigo = 'INGF101';
    IF v_INGF101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física A', 'INGF101', false)
        RETURNING id INTO v_INGF101;
    END IF;

    SELECT id INTO v_ING6101 FROM materias WHERE codigo = 'ING6101';
    IF v_ING6101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fundamentos de la Programación', 'ING6101', false)
        RETURNING id INTO v_ING6101;
    END IF;

    SELECT id INTO v_INGF102 FROM materias WHERE codigo = 'INGF102';
    IF v_INGF102 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física B-I', 'INGF102', false)
        RETURNING id INTO v_INGF102;
    END IF;

    SELECT id INTO v_INGM103 FROM materias WHERE codigo = 'INGM103';
    IF v_INGM103 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Análisis Matemático III', 'INGM103', false)
        RETURNING id INTO v_INGM103;
    END IF;

    SELECT id INTO v_INGM108 FROM materias WHERE codigo = 'INGM108';
    IF v_INGM108 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Probabilidad y Estadística', 'INGM108', false)
        RETURNING id INTO v_INGM108;
    END IF;

    SELECT id INTO v_ING8408 FROM materias WHERE codigo = 'ING8408';
    IF v_ING8408 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Inglés I', 'ING8408', false)
        RETURNING id INTO v_ING8408;
    END IF;

    SELECT id INTO v_ING2207 FROM materias WHERE codigo = 'ING2207';
    IF v_ING2207 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Estática I', 'ING2207', false)
        RETURNING id INTO v_ING2207;
    END IF;

    SELECT id INTO v_INGF104 FROM materias WHERE codigo = 'INGF104';
    IF v_INGF104 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Física C-I', 'INGF104', false)
        RETURNING id INTO v_INGF104;
    END IF;

    SELECT id INTO v_ING3201 FROM materias WHERE codigo = 'ING3201';
    IF v_ING3201 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Electrotecnia A', 'ING3201', false)
        RETURNING id INTO v_ING3201;
    END IF;

    SELECT id INTO v_ING2216 FROM materias WHERE codigo = 'ING2216';
    IF v_ING2216 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Introducción a la Termodinámica y Máquinas Térmicas', 'ING2216', false)
        RETURNING id INTO v_ING2216;
    END IF;

    SELECT id INTO v_ING2208 FROM materias WHERE codigo = 'ING2208';
    IF v_ING2208 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Estática II', 'ING2208', false)
        RETURNING id INTO v_ING2208;
    END IF;

    SELECT id INTO v_ING8409 FROM materias WHERE codigo = 'ING8409';
    IF v_ING8409 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Inglés II', 'ING8409', false)
        RETURNING id INTO v_ING8409;
    END IF;

    SELECT id INTO v_ING3202 FROM materias WHERE codigo = 'ING3202';
    IF v_ING3202 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Electrotecnia B', 'ING3202', false)
        RETURNING id INTO v_ING3202;
    END IF;

    SELECT id INTO v_ING3205 FROM materias WHERE codigo = 'ING3205';
    IF v_ING3205 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Mediciones Eléctricas A', 'ING3205', false)
        RETURNING id INTO v_ING3205;
    END IF;

    SELECT id INTO v_ING3301 FROM materias WHERE codigo = 'ING3301';
    IF v_ING3301 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Automatización A', 'ING3301', false)
        RETURNING id INTO v_ING3301;
    END IF;

    SELECT id INTO v_ING2209 FROM materias WHERE codigo = 'ING2209';
    IF v_ING2209 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Introducción a la Mecánica del Continuo', 'ING2209', false)
        RETURNING id INTO v_ING2209;
    END IF;

    SELECT id INTO v_ING2225 FROM materias WHERE codigo = 'ING2225';
    IF v_ING2225 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Materiales Estructurales', 'ING2225', false)
        RETURNING id INTO v_ING2225;
    END IF;

    SELECT id INTO v_ING8403 FROM materias WHERE codigo = 'ING8403';
    IF v_ING8403 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Economía para Ingeniería', 'ING8403', false)
        RETURNING id INTO v_ING8403;
    END IF;

    SELECT id INTO v_ING3207 FROM materias WHERE codigo = 'ING3207';
    IF v_ING3207 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Máquinas Eléctricas A', 'ING3207', false)
        RETURNING id INTO v_ING3207;
    END IF;

    SELECT id INTO v_ING3206 FROM materias WHERE codigo = 'ING3206';
    IF v_ING3206 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Mediciones Eléctricas B', 'ING3206', false)
        RETURNING id INTO v_ING3206;
    END IF;

    SELECT id INTO v_ING3101 FROM materias WHERE codigo = 'ING3101';
    IF v_ING3101 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Tecnología CAD Aplicada', 'ING3101', false)
        RETURNING id INTO v_ING3101;
    END IF;

    SELECT id INTO v_ING4216 FROM materias WHERE codigo = 'ING4216';
    IF v_ING4216 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Principios de Electrónica', 'ING4216', false)
        RETURNING id INTO v_ING4216;
    END IF;

    SELECT id INTO v_ING2213 FROM materias WHERE codigo = 'ING2213';
    IF v_ING2213 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Fluidos y Máquinas Fluidodinámicas', 'ING2213', false)
        RETURNING id INTO v_ING2213;
    END IF;

    SELECT id INTO v_ING3208 FROM materias WHERE codigo = 'ING3208';
    IF v_ING3208 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Máquinas Eléctricas B', 'ING3208', false)
        RETURNING id INTO v_ING3208;
    END IF;

    SELECT id INTO v_ING3102 FROM materias WHERE codigo = 'ING3102';
    IF v_ING3102 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Materiales Electrotécnicos', 'ING3102', false)
        RETURNING id INTO v_ING3102;
    END IF;

    SELECT id INTO v_ING2202 FROM materias WHERE codigo = 'ING2202';
    IF v_ING2202 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Mecánica de la Partícula y el Cuerpo Rígido', 'ING2202', false)
        RETURNING id INTO v_ING2202;
    END IF;

    SELECT id INTO v_ING3304 FROM materias WHERE codigo = 'ING3304';
    IF v_ING3304 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Instalaciones Eléctricas A', 'ING3304', false)
        RETURNING id INTO v_ING3304;
    END IF;

    SELECT id INTO v_ING8411 FROM materias WHERE codigo = 'ING8411';
    IF v_ING8411 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Organización Empresarial e Industrial', 'ING8411', false)
        RETURNING id INTO v_ING8411;
    END IF;

    SELECT id INTO v_ING3305 FROM materias WHERE codigo = 'ING3305';
    IF v_ING3305 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Instalaciones Eléctricas B', 'ING3305', false)
        RETURNING id INTO v_ING3305;
    END IF;

    SELECT id INTO v_ING4316 FROM materias WHERE codigo = 'ING4316';
    IF v_ING4316 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Electrónica de Potencia I', 'ING4316', false)
        RETURNING id INTO v_ING4316;
    END IF;

    SELECT id INTO v_ING8412 FROM materias WHERE codigo = 'ING8412';
    IF v_ING8412 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Seguridad y Salud Ocupacional', 'ING8412', false)
        RETURNING id INTO v_ING8412;
    END IF;

    SELECT id INTO v_ING8413 FROM materias WHERE codigo = 'ING8413';
    IF v_ING8413 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Sistemas de Gestión Integrados', 'ING8413', false)
        RETURNING id INTO v_ING8413;
    END IF;

    SELECT id INTO v_ING3311 FROM materias WHERE codigo = 'ING3311';
    IF v_ING3311 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Componentes de los Sistemas Eléctricos de Potencia', 'ING3311', false)
        RETURNING id INTO v_ING3311;
    END IF;

    SELECT id INTO v_ING2304 FROM materias WHERE codigo = 'ING2304';
    IF v_ING2304 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Transferencia y Tecnología del Calor', 'ING2304', false)
        RETURNING id INTO v_ING2304;
    END IF;

    SELECT id INTO v_ING2311 FROM materias WHERE codigo = 'ING2311';
    IF v_ING2311 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Introducción a la Metrología y Fabricación', 'ING2311', false)
        RETURNING id INTO v_ING2311;
    END IF;

    SELECT id INTO v_ING8406 FROM materias WHERE codigo = 'ING8406';
    IF v_ING8406 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Formulación y Evaluación de Proyectos de Inversión', 'ING8406', false)
        RETURNING id INTO v_ING8406;
    END IF;

    SELECT id INTO v_ING2302 FROM materias WHERE codigo = 'ING2302';
    IF v_ING2302 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Mantenimiento Industrial', 'ING2302', false)
        RETURNING id INTO v_ING2302;
    END IF;

    SELECT id INTO v_ING8405 FROM materias WHERE codigo = 'ING8405';
    IF v_ING8405 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Ética, Legislación y Propiedad Intelectual en el Ejercicio Profesional', 'ING8405', false)
        RETURNING id INTO v_ING8405;
    END IF;

    SELECT id INTO v_ING2301 FROM materias WHERE codigo = 'ING2301';
    IF v_ING2301 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Elementos de Máquinas (anual)', 'ING2301', false)
        RETURNING id INTO v_ING2301;
    END IF;

    SELECT id INTO v_ING2312 FROM materias WHERE codigo = 'ING2312';
    IF v_ING2312 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Procesos de Fabricación', 'ING2312', false)
        RETURNING id INTO v_ING2312;
    END IF;

    SELECT id INTO v_ING4317 FROM materias WHERE codigo = 'ING4317';
    IF v_ING4317 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Control I', 'ING4317', false)
        RETURNING id INTO v_ING4317;
    END IF;

    SELECT id INTO v_ING3316 FROM materias WHERE codigo = 'ING3316';
    IF v_ING3316 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Optativa I', 'ING3316', false)
        RETURNING id INTO v_ING3316;
    END IF;

    SELECT id INTO v_ING3317 FROM materias WHERE codigo = 'ING3317';
    IF v_ING3317 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Optativa II', 'ING3317', false)
        RETURNING id INTO v_ING3317;
    END IF;

    SELECT id INTO v_ING3318 FROM materias WHERE codigo = 'ING3318';
    IF v_ING3318 IS NULL THEN
        INSERT INTO materias (nombre, codigo, es_basica_critica)
        VALUES ('Trabajo Final', 'ING3318', false)
        RETURNING id INTO v_ING3318;
    END IF;

    -- 3. Vincular materias al plan (plan_materia)
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM101, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM104, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING1103, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2104, 1)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM102, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM106, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF101, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING6101, 2)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF102, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM103, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGM108, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8408, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2207, 3)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_INGF104, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3201, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2216, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2208, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8409, 4)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3202, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3205, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3301, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2209, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2225, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8403, 5)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3207, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3206, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3101, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4216, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2213, 6)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3208, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3102, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2202, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3304, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8411, 7)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3305, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4316, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8412, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8413, 8)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3311, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2304, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2311, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8406, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2302, 9)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING8405, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2301, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING2312, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING4317, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3316, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3317, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;
    INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
    VALUES (v_plan_id, v_ING3318, 10)
    ON CONFLICT (plan_id, materia_id) DO UPDATE SET cuatrimestre_sugerido = EXCLUDED.cuatrimestre_sugerido;

    -- 4. Insertar Correlativas
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM102, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM106, v_INGM104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF101, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF101, v_INGM104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6101, v_INGM101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING6101, v_INGM104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF102, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF102, v_INGM106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF102, v_INGF101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM103, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM103, v_INGM106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGM108, v_INGM102)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): Introducción a la Ciencia y la Ingeniería
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2207, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2207, v_INGM106)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2207, v_INGF101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_INGF104, v_INGF102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3201, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3201, v_INGF102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2216, v_ING1103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2216, v_INGF101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2216, v_INGM102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2208, v_ING2207)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2208, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8409, v_ING8408)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3202, v_ING3201)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3202, v_INGF104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3205, v_ING3201)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3205, v_INGM108)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3301, v_ING3201)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2209, v_ING2208)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2225, v_ING2208)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8403, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3207, v_ING3205)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3207, v_ING3202)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3206, v_ING3205)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3206, v_ING3202)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3206, v_ING3301)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3101, v_ING2104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4216, v_ING3301)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2213, v_ING3301)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2213, v_ING2209)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2213, v_ING2216)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3208, v_ING3207)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3102, v_ING1103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3102, v_ING3206)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2202, v_INGF101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2202, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3304, v_ING3202)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3304, v_ING2208)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8411, v_ING8403)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3305, v_ING3304)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3305, v_ING3207)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3305, v_ING3101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4316, v_ING4216)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8412, v_ING8411)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8413, v_ING8411)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3311, v_ING2216)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3311, v_ING3304)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3311, v_ING3102)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3311, v_ING3208)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2304, v_ING2216)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2304, v_ING2213)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2311, v_ING2104)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2311, v_ING3205)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8406, v_ING8403)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2302, v_ING2225)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2302, v_ING2216)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING8405, v_INGM103)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2301, v_ING2225)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2301, v_ING3101)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2312, v_ING2311)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING2312, v_ING2225)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING4317, v_ING4216)
    ON CONFLICT DO NOTHING;
    -- No se encontró correlativa en la lista (se ignora): (**)
    -- No se encontró correlativa en la lista (se ignora): (**)
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3318, v_ING3305)
    ON CONFLICT DO NOTHING;
    INSERT INTO correlativas (materia_id, requiere_materia_id)
    VALUES (v_ING3318, v_ING2202)
    ON CONFLICT DO NOTHING;
END $$;

-- migrate:down

