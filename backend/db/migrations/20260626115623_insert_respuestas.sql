-- migrate:up

DO $$
DECLARE
    -- Asignaciones (Arrays donde el índice = número de evento)
    asig_e1 INT[];
    asig_e2 INT[];

    -- Carreras
    carrera_e1 INT;
    carrera_e2 INT;

    -- Preguntas
    p_madre INT;
    p_padre INT;
    p_familia_vive INT;
    p_familia_oriunda INT;
    p_horas_viaje INT;
    p_comunicacion INT;
    p_tipo_institucion INT;
    p_secundario_tiempo INT;
    p_primera_opcion INT;
    p_seguridad_carrera INT;
    p_importancia_formacion INT;
    p_apoyo_familiar INT;
    
    -- Opciones
    o_secundario_madre INT;
    o_terciario_madre INT;
    o_universitario_madre INT;
    o_secundario_padre INT;
    o_terciario_padre INT;
    o_universitario_padre INT;
    o_escuela_publica INT;
    o_escuela_privada INT;

    ----- Evento 2

    -- Preguntas evento 2
    p_asistencia INT;
    p_estres INT;
    p_apoyo_contencion INT;
    p_motivacion INT;
    p_pensaste_abandonar INT;
    p_dejar_proximo INT;
    p_trabajando INT;
    p_carga_laboral INT;
    p_trabajo_rendimiento INT;
    p_horas_trabajo INT;
    p_situacion_economica INT;
    p_rendimiento_academico INT;
    p_objetivos INT;
    p_materia_dificultad INT;
    p_recursos_facultad INT;
    p_conocias_recursos INT;
    p_contacto_equipo INT;

    -- Opciones
    o_empece_este_cuatrimestre INT;
    o_carga_menos INT;
    o_carga_igual INT;
    o_carga_mas INT;
    o_abandonar_si INT;
    o_abandonar_lo_pense INT;
    o_abandonar_no INT;
    o_dejar_si INT;
    o_dejar_no_se INT;
    o_dejar_no INT;
    o_economica_si INT;
    o_economica_parcialmente INT;
    o_economica_no INT;
    o_recursos_no INT;
    o_recursos_este_cuatri INT;
    o_recursos_si INT;

    ----- Evento 3

    -- Preguntas evento 3
    p_localidad INT;
    p_situacion_vivienda INT;
    p_personas_hogar INT;
    p_espacio_estudio INT;
    p_tiempo_viaje INT;
    p_obstaculo_traslado INT;
    p_ganas_estudiar INT;
    p_interes_contenidos INT;
    p_conoce_espacios INT;

    -- Opciones evento 3
    o_vivienda_pension INT;
    o_vivienda_familiares INT;
    o_vivienda_alq INT;
    o_vivienda_propio INT;
    o_vivienda_otro INT;
    
    o_espacio_no INT;
    o_espacio_no_siempre INT;
    o_espacio_comparto INT;
    o_espacio_propio INT;
    
    o_tiempo_mas_1h INT;
    o_tiempo_31_1h INT;
    o_tiempo_15_30 INT;
    o_tiempo_menos_15 INT;
    
    o_ganas_menos INT;
    o_ganas_igual INT;
    o_ganas_mas INT;

    -- ===== EVENTO 4 ========
    -- Preguntas
    p_inscripcion_materia INT;

    -- Materias
    m_analisis_1 INT;
    m_algebra_1 INT;
    m_quimica INT;
    m_analisis_2 INT;
    m_algebra_2 INT;
    m_fisica_1 INT;
    m_programacion INT;

    -- ======== EVENTO 5 ========
    -- Preguntas
    p_e5_nota INT;
    p_e5_situacion INT;

    -- Opciones 
    o_e5_situacion_recursa INT;
    o_e5_situacion_habilita INT;
    o_e5_situacion_promociona INT;

    -- ======== EVENTO 6 ========
    -- Preguntas
    p_e6_aprobo_final INT;
    p_e6_nota_final INT;

    -- Opciones (Pregunta: ¿Aprobaste el final de {MATERIA}?)
    o_e6_aprobo_si INT;
    o_e6_aprobo_no INT;
    o_e6_aprobo_no_presento INT;

BEGIN
    -- Cargar asignaciones en un array (Índices del 1 al 6)
    asig_e1 := ARRAY[
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 1 AND evento_id = 1 LIMIT 1),
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 1 AND evento_id = 2 LIMIT 1),
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 1 AND evento_id = 3 LIMIT 1),
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 1 AND evento_id = 4 LIMIT 1),
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 1 AND evento_id = 5 LIMIT 1),
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 1 AND evento_id = 6 LIMIT 1)
    ];

    asig_e2 := ARRAY[
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 2 AND evento_id = 1 LIMIT 1),
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 2 AND evento_id = 2 LIMIT 1),
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 2 AND evento_id = 3 LIMIT 1),
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 2 AND evento_id = 4 LIMIT 1),
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 2 AND evento_id = 5 LIMIT 1),
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 2 AND evento_id = 6 LIMIT 1)
    ];

    -- Cargar carreras desde los estudiantes
    SELECT carrera_id INTO carrera_e1 FROM estudiantes WHERE id = 1;
    SELECT carrera_id INTO carrera_e2 FROM estudiantes WHERE id = 2;
    
    -- Cargar preguntas
    SELECT id INTO p_madre FROM pregunta WHERE texto_pregunta ILIKE '%nivel educativo de tu madre%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_padre FROM pregunta WHERE texto_pregunta ILIKE '%nivel educativo de tu padre%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_familia_vive FROM pregunta WHERE texto_pregunta ILIKE '%familia vive en Mar del Plata%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_familia_oriunda FROM pregunta WHERE texto_pregunta ILIKE '%familia es oriunda%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_horas_viaje FROM pregunta WHERE texto_pregunta ILIKE '%horas de viaje%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_comunicacion FROM pregunta WHERE texto_pregunta ILIKE '%comunicas con ellos%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_tipo_institucion FROM pregunta WHERE texto_pregunta ILIKE '%tipo de institución%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_secundario_tiempo FROM pregunta WHERE texto_pregunta ILIKE '%secundario en tiempo%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_primera_opcion FROM pregunta WHERE texto_pregunta ILIKE '%primera op%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_seguridad_carrera FROM pregunta WHERE texto_pregunta ILIKE '%seguro te sentis%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_importancia_formacion FROM pregunta WHERE texto_pregunta ILIKE '%formación acad%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_apoyo_familiar FROM pregunta WHERE texto_pregunta ILIKE '%entorno familiar apoya%' AND carrera_id = carrera_e1 LIMIT 1;

    -- Cargar opciones
    SELECT id INTO o_secundario_madre FROM opcion_pregunta WHERE texto_opcion = 'Secundario' AND pregunta_id = p_madre;
    SELECT id INTO o_terciario_madre FROM opcion_pregunta WHERE texto_opcion = 'Terciario' AND pregunta_id = p_madre;
    SELECT id INTO o_universitario_madre FROM opcion_pregunta WHERE texto_opcion = 'Universitario' AND pregunta_id = p_padre;
    SELECT id INTO o_secundario_padre FROM opcion_pregunta WHERE texto_opcion = 'Secundario' AND pregunta_id = p_padre;
    SELECT id INTO o_terciario_padre FROM opcion_pregunta WHERE texto_opcion = 'Terciario' AND pregunta_id = p_padre;
    SELECT id INTO o_universitario_padre FROM opcion_pregunta WHERE texto_opcion = 'Universitario' AND pregunta_id = p_padre;
    
    SELECT id INTO o_escuela_publica FROM opcion_pregunta WHERE texto_opcion = 'Escuela Publica' AND pregunta_id = p_tipo_institucion;
    SELECT id INTO o_escuela_privada FROM opcion_pregunta WHERE texto_opcion = 'Escuela Privada' AND pregunta_id = p_tipo_institucion;

    -- ========= CARGAR PREGUNTAS EVENTO 2 ========
    SELECT id INTO p_asistencia        FROM pregunta WHERE texto_pregunta ILIKE '%no pudiste asistir%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_estres            FROM pregunta WHERE texto_pregunta ILIKE '%niveles de estrés%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_apoyo_contencion  FROM pregunta WHERE texto_pregunta ILIKE '%apoyo o contención%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_motivacion        FROM pregunta WHERE texto_pregunta ILIKE '%tan motivado%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_pensaste_abandonar FROM pregunta WHERE texto_pregunta ILIKE '%pensaste en abandonar%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_dejar_proximo     FROM pregunta WHERE texto_pregunta ILIKE '%dejar de cursar el próximo%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_trabajando        FROM pregunta WHERE texto_pregunta ILIKE '%trabajando actualmente%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_carga_laboral     FROM pregunta WHERE texto_pregunta ILIKE '%carga laboral cambió%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_trabajo_rendimiento FROM pregunta WHERE texto_pregunta ILIKE '%trabajo interfiere%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_horas_trabajo     FROM pregunta WHERE texto_pregunta ILIKE '%horas trabajas por semana%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_situacion_economica FROM pregunta WHERE texto_pregunta ILIKE '%situación económica%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_rendimiento_academico FROM pregunta WHERE texto_pregunta ILIKE '%calificarías tu rendimiento académico%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_objetivos         FROM pregunta WHERE texto_pregunta ILIKE '%objetivos académicos%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_materia_dificultad FROM pregunta WHERE texto_pregunta ILIKE '%materia en que tuviste%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_recursos_facultad FROM pregunta WHERE texto_pregunta ILIKE '%facultad te brinda los recursos%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_conocias_recursos FROM pregunta WHERE texto_pregunta ILIKE '%recursos de apoyo disponibles%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_contacto_equipo   FROM pregunta WHERE texto_pregunta ILIKE '%contactado por alguien%' AND carrera_id = carrera_e1 LIMIT 1;

    -- ======== CARGAR OPCIONES EVENTO 2 ========
    SELECT id INTO o_empece_este_cuatrimestre FROM opcion_pregunta WHERE texto_opcion = 'Empecé a trabajar este cuatrimestre' AND pregunta_id = p_carga_laboral;
    SELECT id INTO o_carga_menos       FROM opcion_pregunta WHERE texto_opcion = 'Disminuyó'                    AND pregunta_id = p_carga_laboral;
    SELECT id INTO o_carga_igual       FROM opcion_pregunta WHERE texto_opcion = 'Se mantuvo igual'                    AND pregunta_id = p_carga_laboral;
    SELECT id INTO o_carga_mas         FROM opcion_pregunta WHERE texto_opcion = 'Aumentó'                      AND pregunta_id = p_carga_laboral;
    SELECT id INTO o_abandonar_si      FROM opcion_pregunta WHERE texto_opcion = 'Si'                       AND pregunta_id = p_pensaste_abandonar;
    SELECT id INTO o_abandonar_lo_pense FROM opcion_pregunta WHERE texto_opcion = 'Lo pensé pero lo descarte' AND pregunta_id = p_pensaste_abandonar;
    SELECT id INTO o_abandonar_no      FROM opcion_pregunta WHERE texto_opcion = 'No'                       AND pregunta_id = p_pensaste_abandonar;
    SELECT id INTO o_dejar_si          FROM opcion_pregunta WHERE texto_opcion = 'Si'                       AND pregunta_id = p_dejar_proximo;
    SELECT id INTO o_dejar_no_se       FROM opcion_pregunta WHERE texto_opcion = 'No lo sé'                 AND pregunta_id = p_dejar_proximo;
    SELECT id INTO o_dejar_no          FROM opcion_pregunta WHERE texto_opcion = 'No'                       AND pregunta_id = p_dejar_proximo;
    SELECT id INTO o_economica_si      FROM opcion_pregunta WHERE texto_opcion = 'Si'                       AND pregunta_id = p_situacion_economica;
    SELECT id INTO o_economica_parcialmente FROM opcion_pregunta WHERE texto_opcion = 'Parcialmente'        AND pregunta_id = p_situacion_economica;
    SELECT id INTO o_economica_no      FROM opcion_pregunta WHERE texto_opcion = 'No'                       AND pregunta_id = p_situacion_economica;
    SELECT id INTO o_recursos_no       FROM opcion_pregunta WHERE texto_opcion = 'No'                       AND pregunta_id = p_conocias_recursos;
    SELECT id INTO o_recursos_este_cuatri FROM opcion_pregunta WHERE texto_opcion = 'Los conocí este cuatrimestre' AND pregunta_id = p_conocias_recursos;
    SELECT id INTO o_recursos_si       FROM opcion_pregunta WHERE texto_opcion = 'Si'                       AND pregunta_id = p_conocias_recursos;

    -- ======== CARGAR PREGUNTAS EVENTO 3 ========
    SELECT id INTO p_localidad          FROM pregunta WHERE texto_pregunta ILIKE '%localidad vivís%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_situacion_vivienda FROM pregunta WHERE texto_pregunta ILIKE '%situación de vivienda%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_personas_hogar     FROM pregunta WHERE texto_pregunta ILIKE '%personas viven en tu hogar%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_espacio_estudio    FROM pregunta WHERE texto_pregunta ILIKE '%espacio en tu casa adecuado%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_tiempo_viaje       FROM pregunta WHERE texto_pregunta ILIKE '%tiempo aproximado de la facultad%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_obstaculo_traslado FROM pregunta WHERE texto_pregunta ILIKE '%obstáculo%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_ganas_estudiar     FROM pregunta WHERE texto_pregunta ILIKE '%menos ganas de continuar la carrera%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_interes_contenidos FROM pregunta WHERE texto_pregunta ILIKE '%interesado te sentiste%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_conoce_espacios    FROM pregunta WHERE texto_pregunta ILIKE '%espacios que la facultad brinda%' AND carrera_id = carrera_e1 LIMIT 1;

    -- ======== CARGAR OPCIONES EVENTO 3 ========
    -- Pregunta 53: Situación de vivienda
    SELECT id INTO o_vivienda_pension    FROM opcion_pregunta WHERE texto_opcion = 'Pensión' AND pregunta_id = p_situacion_vivienda;
    SELECT id INTO o_vivienda_familiares FROM opcion_pregunta WHERE texto_opcion = 'Vivo en casa de familiares que no son mis padres' AND pregunta_id = p_situacion_vivienda;
    SELECT id INTO o_vivienda_alq        FROM opcion_pregunta WHERE texto_opcion = 'Casa/Departamento (Alquilado)' AND pregunta_id = p_situacion_vivienda;
    SELECT id INTO o_vivienda_propio     FROM opcion_pregunta WHERE texto_opcion = 'Casa/Departamento (Propio)' AND pregunta_id = p_situacion_vivienda;
    SELECT id INTO o_vivienda_otro       FROM opcion_pregunta WHERE texto_opcion = 'Otro' AND pregunta_id = p_situacion_vivienda;

    -- Pregunta 55: Espacio adecuado para estudiar
    SELECT id INTO o_espacio_no         FROM opcion_pregunta WHERE texto_opcion = 'No' AND pregunta_id = p_espacio_estudio;
    SELECT id INTO o_espacio_no_siempre FROM opcion_pregunta WHERE texto_opcion = 'No siempre está disponible' AND pregunta_id = p_espacio_estudio;
    SELECT id INTO o_espacio_comparto   FROM opcion_pregunta WHERE texto_opcion = 'Si, pero comparto' AND pregunta_id = p_espacio_estudio;
    SELECT id INTO o_espacio_propio     FROM opcion_pregunta WHERE texto_opcion = 'Si, uno propio' AND pregunta_id = p_espacio_estudio;

    -- Pregunta 56: Tiempo aproximado (Se escapan las comillas simples duplicándolas)
    SELECT id INTO o_tiempo_mas_1h   FROM opcion_pregunta WHERE texto_opcion = '> 1h' AND pregunta_id = p_tiempo_viaje;
    SELECT id INTO o_tiempo_31_1h    FROM opcion_pregunta WHERE texto_opcion = '31''-1 h' AND pregunta_id = p_tiempo_viaje;
    SELECT id INTO o_tiempo_15_30    FROM opcion_pregunta WHERE texto_opcion = '15''-30''' AND pregunta_id = p_tiempo_viaje;
    SELECT id INTO o_tiempo_menos_15 FROM opcion_pregunta WHERE texto_opcion = '< 15''' AND pregunta_id = p_tiempo_viaje;

    -- Pregunta 63: Ganas de estudiar
    SELECT id INTO o_ganas_menos FROM opcion_pregunta WHERE texto_opcion = 'Menos' AND pregunta_id = p_ganas_estudiar;
    SELECT id INTO o_ganas_igual FROM opcion_pregunta WHERE texto_opcion = 'Igual' AND pregunta_id = p_ganas_estudiar;
    SELECT id INTO o_ganas_mas   FROM opcion_pregunta WHERE texto_opcion = 'Más' AND pregunta_id = p_ganas_estudiar;

    -- ======== CARGAR IDs DE MATERIAS ========
    -- Se utiliza ILIKE para evitar problemas de mayúsculas/minúsculas o tildes
    SELECT id INTO m_analisis_1   FROM materias WHERE nombre ILIKE '%Análisis Matemático I%' LIMIT 1;
    SELECT id INTO m_algebra_1    FROM materias WHERE nombre ILIKE '%Álgebra I-B%' LIMIT 1;
    SELECT id INTO m_quimica      FROM materias WHERE nombre ILIKE '%Fundamentos de Química%' LIMIT 1;
    SELECT id INTO m_analisis_2   FROM materias WHERE nombre ILIKE '%Análisis Matemático II%' LIMIT 1;
    SELECT id INTO m_algebra_2    FROM materias WHERE nombre ILIKE '%Álgebra II%' LIMIT 1;
    SELECT id INTO m_fisica_1     FROM materias WHERE nombre ILIKE '%Física A%' LIMIT 1;
    SELECT id INTO m_programacion FROM materias WHERE nombre ILIKE '%Fundamentos de la Programación%' LIMIT 1;

    -- ======== CARGAR PREGUNTAS EVENTO 4 ========
    SELECT id INTO p_inscripcion_materia FROM pregunta WHERE texto_pregunta ILIKE '%inscribiste a {MATERIA}%' AND carrera_id = carrera_e1 LIMIT 1;

    -- ======== CARGAR DATOS EVENTO 5 ========
    SELECT id INTO p_e5_nota      FROM pregunta WHERE texto_pregunta ILIKE '%nota en {MATERIA}%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_e5_situacion FROM pregunta WHERE texto_pregunta ILIKE '%situación final en {MATERIA}%' AND carrera_id = carrera_e1 LIMIT 1;

    -- Cargar opciones de situación final 
    SELECT id INTO o_e5_situacion_recursa    FROM opcion_pregunta WHERE texto_opcion = 'Recursa'    AND pregunta_id = p_e5_situacion LIMIT 1;
    SELECT id INTO o_e5_situacion_habilita   FROM opcion_pregunta WHERE texto_opcion = 'Habilita'   AND pregunta_id = p_e5_situacion LIMIT 1;
    SELECT id INTO o_e5_situacion_promociona FROM opcion_pregunta WHERE texto_opcion = 'Promociona' AND pregunta_id = p_e5_situacion LIMIT 1;

    -- ======== CARGAR DATOS EVENTO 6 ========
    SELECT id INTO p_e6_aprobo_final FROM pregunta WHERE texto_pregunta ILIKE '%Aprobaste el final de {MATERIA}%' AND carrera_id = carrera_e1 LIMIT 1;
    SELECT id INTO p_e6_nota_final   FROM pregunta WHERE texto_pregunta ILIKE '%nota en el final de {MATERIA}%' AND carrera_id = carrera_e1 LIMIT 1;

    -- Cargar opciones de aprobación de final 
    SELECT id INTO o_e6_aprobo_si          FROM opcion_pregunta WHERE texto_opcion = 'Sí' AND pregunta_id = p_e6_aprobo_final LIMIT 1;
    SELECT id INTO o_e6_aprobo_no          FROM opcion_pregunta WHERE texto_opcion = 'No' AND pregunta_id = p_e6_aprobo_final LIMIT 1;
    SELECT id INTO o_e6_aprobo_no_presento FROM opcion_pregunta WHERE texto_opcion = 'No me presenté' AND pregunta_id = p_e6_aprobo_final LIMIT 1;



    ----- CARGAR RESPUESTAS ESTUDIANTES ----

    -- Estudiante 1 - Evento 1
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    (asig_e1[1], p_madre,                 NULL, o_secundario_madre,      NULL, NULL, 0.6),
    (asig_e1[1], p_padre,                 NULL, o_secundario_padre,      NULL, NULL, 0.6),
    (asig_e1[1], p_familia_vive,          NULL, NULL,              NULL, 'no', 1),
    (asig_e1[1], p_familia_oriunda,       NULL, NULL,              NULL, 'no', 1),
    (asig_e1[1], p_horas_viaje,           NULL, NULL,              3,    NULL, 0.6),
    (asig_e1[1], p_comunicacion,          NULL, NULL,              NULL, 'si', 0),
    (asig_e1[1], p_tipo_institucion,      NULL, o_escuela_publica, NULL, NULL, 0.5),
    (asig_e1[1], p_secundario_tiempo,     NULL, NULL,              NULL, 'si', 0),
    (asig_e1[1], p_primera_opcion,        NULL, NULL,              NULL, 'si', 0),
    (asig_e1[1], p_seguridad_carrera,     NULL, NULL,              4,    NULL, 0.25),
    (asig_e1[1], p_importancia_formacion, NULL, NULL,              5,    NULL, 0),
    (asig_e1[1], p_apoyo_familiar,        NULL, NULL,              4,    NULL, 0.25);

    -- Estudiante 2 - Evento 1
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    (asig_e2[1], p_madre,                 NULL, o_terciario_madre,       NULL, NULL, 0.3),
    (asig_e2[1], p_padre,                 NULL, o_universitario_padre,   NULL, NULL, 0),
    (asig_e2[1], p_familia_vive,          NULL, NULL,              NULL, 'si', 0),
    (asig_e2[1], p_familia_oriunda,       NULL, NULL,              NULL, 'si', 0),
    (asig_e2[1], p_horas_viaje,           NULL, NULL,              0,    NULL, 0),
    (asig_e2[1], p_comunicacion,          NULL, NULL,              NULL, 'no', 1),
    (asig_e2[1], p_tipo_institucion,      NULL, o_escuela_privada, NULL, NULL, 0),
    (asig_e2[1], p_secundario_tiempo,     NULL, NULL,              NULL, 'no', 1),
    (asig_e2[1], p_primera_opcion,        NULL, NULL,              NULL, 'no', 1),
    (asig_e2[1], p_seguridad_carrera,     NULL, NULL,              2,    NULL, 0.75),
    (asig_e2[1], p_importancia_formacion, NULL, NULL,              3,    NULL, 0.5),
    (asig_e2[1], p_apoyo_familiar,        NULL, NULL,              2,    NULL, 0.75);

    -- Estudiante 1 - Evento 2
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    (asig_e1[2], p_asistencia,          NULL, NULL,               NULL, 'no',  0),
    (asig_e1[2], p_estres,              NULL, NULL,               4,    NULL,  0.25),
    (asig_e1[2], p_apoyo_contencion,    NULL, NULL,               NULL, 'si',  0),
    (asig_e1[2], p_motivacion,          NULL, NULL,               4,    NULL,  0.25),
    (asig_e1[2], p_pensaste_abandonar,  NULL, o_abandonar_no,     NULL, NULL,  0),
    (asig_e1[2], p_dejar_proximo,       NULL, o_dejar_no,         NULL, NULL,  0),
    (asig_e1[2], p_trabajando,          NULL, NULL,               NULL, 'no',  0),
    (asig_e1[2], p_carga_laboral,       NULL, o_carga_igual,      NULL, NULL,  0.5),
    (asig_e1[2], p_trabajo_rendimiento, NULL, NULL,               3,    NULL,  0.5),
    (asig_e1[2], p_horas_trabajo,       NULL, NULL,               20,   NULL,  0.25),
    (asig_e1[2], p_situacion_economica, NULL, o_economica_no,     NULL, NULL,  0),
    (asig_e1[2], p_rendimiento_academico, NULL, NULL,             4,    NULL,  0.25),
    (asig_e1[2], p_objetivos,           NULL, NULL,               NULL, 'si',  0),
    (asig_e1[2], p_materia_dificultad,  NULL, NULL,               NULL, 'no',  0),
    (asig_e1[2], p_recursos_facultad,   NULL, NULL,               4,    NULL,  0.25),
    (asig_e1[2], p_conocias_recursos,   NULL, o_recursos_si,      NULL, NULL,  0),
    (asig_e1[2], p_contacto_equipo,     NULL, NULL,               NULL, 'no',  1);

    -- Estudiante 2 - Evento 2 
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    (asig_e2[2], p_asistencia,          NULL, NULL,               NULL, 'si',  1),
    (asig_e2[2], p_estres,              NULL, NULL,               2,    NULL,  0.75),
    (asig_e2[2], p_apoyo_contencion,    NULL, NULL,               NULL, 'no',  1),
    (asig_e2[2], p_motivacion,          NULL, NULL,               2,    NULL,  0.75),
    (asig_e2[2], p_pensaste_abandonar,  NULL, o_abandonar_si,     NULL, NULL,  1),
    (asig_e2[2], p_dejar_proximo,       NULL, o_dejar_si,         NULL, NULL,  1),
    (asig_e2[2], p_trabajando,          NULL, NULL,               NULL, 'si',  1),
    (asig_e2[2], p_carga_laboral,       NULL, o_carga_mas,        NULL, NULL,  1),
    (asig_e2[2], p_trabajo_rendimiento, NULL, NULL,               5,    NULL,  1),
    (asig_e2[2], p_horas_trabajo,       NULL, NULL,               45,   NULL,  0.56),
    (asig_e2[2], p_situacion_economica, NULL, o_economica_si,     NULL, NULL,  1),
    (asig_e2[2], p_rendimiento_academico, NULL, NULL,             2,    NULL,  0.75),
    (asig_e2[2], p_objetivos,           NULL, NULL,               NULL, 'no',  1),
    (asig_e2[2], p_materia_dificultad,  NULL, NULL,               NULL, 'si',  1),
    (asig_e2[2], p_recursos_facultad,   NULL, NULL,               2,    NULL,  0.75),
    (asig_e2[2], p_conocias_recursos,   NULL, o_recursos_no,      NULL, NULL,  1),
    (asig_e2[2], p_contacto_equipo,     NULL, NULL,               NULL, 'si',  0);

    -- ======== EVENTO 3 ========
    -- Estudiante 1 - Evento 3
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    (asig_e1[3], p_localidad,          NULL, NULL,                 NULL, 'Mar del Plata', NULL), -- Texto libre: riesgo calculado luego
    (asig_e1[3], p_situacion_vivienda, NULL, o_vivienda_propio,    NULL, NULL, 0),
    (asig_e1[3], p_personas_hogar,     NULL, NULL,                 4,    NULL, 0.4), 
    (asig_e1[3], p_espacio_estudio,    NULL, o_espacio_propio,     NULL, NULL, 0),
    (asig_e1[3], p_tiempo_viaje,       NULL, o_tiempo_15_30,       NULL, NULL, 0.3),
    (asig_e1[3], p_obstaculo_traslado, NULL, NULL,                 2,    NULL, 0.25),
    (asig_e1[3], p_ganas_estudiar,     NULL, o_ganas_igual,        NULL, NULL, 0.5),
    (asig_e1[3], p_interes_contenidos, NULL, NULL,                 4,    NULL, 0.75),
    (asig_e1[3], p_conoce_espacios,    NULL, NULL,                 NULL, 'si', 0);

    -- Estudiante 2 - Evento 3
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    (asig_e2[3], p_localidad,          NULL, NULL,                 NULL, 'Miramar',       NULL), -- Texto libre: riesgo calculado luego
    (asig_e2[3], p_situacion_vivienda, NULL, o_vivienda_alq,       NULL, NULL, 0.3),
    (asig_e2[3], p_personas_hogar,     NULL, NULL,                 2,    NULL, 0.2), 
    (asig_e2[3], p_espacio_estudio,    NULL, o_espacio_no,         NULL, NULL, 1),
    (asig_e2[3], p_tiempo_viaje,       NULL, o_tiempo_mas_1h,      NULL, NULL, 1),
    (asig_e2[3], p_obstaculo_traslado, NULL, NULL,                 5,    NULL, 1),
    (asig_e2[3], p_ganas_estudiar,     NULL, o_ganas_menos,        NULL, NULL, 1),
    (asig_e2[3], p_interes_contenidos, NULL, NULL,                 3,    NULL, 0.5),
    (asig_e2[3], p_conoce_espacios,    NULL, NULL,                 NULL, 'no', 1);

    -- Estudiante 1 - Evento 4 (Cuatrimestre 2 - 4 materias actuales)
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    (asig_e1[4], p_inscripcion_materia, m_algebra_2,    NULL, NULL, 'si', 0),
    (asig_e1[4], p_inscripcion_materia, m_analisis_2,   NULL, NULL, 'si', 0),
    (asig_e1[4], p_inscripcion_materia, m_fisica_1,     NULL, NULL, 'si', 0),
    (asig_e1[4], p_inscripcion_materia, m_programacion, NULL, NULL, 'si', 0);

    -- Estudiante 2 - Evento 4 (Cuatrimestre 2 - 3 materias actuales)
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    (asig_e2[4], p_inscripcion_materia, m_analisis_1, NULL, NULL, 'si', 0),
    (asig_e2[4], p_inscripcion_materia, m_algebra_1,  NULL, NULL, 'si', 0),
    (asig_e2[4], p_inscripcion_materia, m_quimica,    NULL, NULL, 'si', 0);

    -- ======== INSERCIÓN DE RESPUESTAS EVENTO 5 ========

    -- Estudiante 1 - Evento 5 (Reportando las 3 materias finalizadas del Cuatrimestre 1)
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    
    -- Análisis 1 (Nota 8, Promociona)
    (asig_e1[5], p_e5_nota,      m_analisis_1, NULL,                      8,    NULL, 0.22),
    (asig_e1[5], p_e5_situacion, m_analisis_1, o_e5_situacion_promociona, NULL, NULL, 0),

    -- Álgebra 1 (Nota 7, Promociona)
    (asig_e1[5], p_e5_nota,      m_algebra_1,  NULL,                      7,    NULL, 0.33),
    (asig_e1[5], p_e5_situacion, m_algebra_1,  o_e5_situacion_promociona, NULL, NULL, 0),

    -- Química (Nota 5, Habilita)
    (asig_e1[5], p_e5_nota,      m_quimica,    NULL,                      5,    NULL, 0.55),
    (asig_e1[5], p_e5_situacion, m_quimica,    o_e5_situacion_habilita,   NULL, NULL, 0.5);

    -- (El Estudiante 2 NO responde el Evento 5 en esta etapa)

    -- ======== INSERCIÓN DE RESPUESTAS EVENTO 6 ========

    -- Estudiante 1 - Evento 6 (Rindiendo final de Fundamentos de Química)
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    
    -- Fundamentos de Química (Aprobó, Nota 6)
    (asig_e1[6], p_e6_aprobo_final, m_quimica, o_e6_aprobo_si, NULL, NULL, 0),
    (asig_e1[6], p_e6_nota_final,   m_quimica, NULL,           6,    NULL, 0.44);

    -- (El Estudiante 2 no responde el Evento 6 porque no tiene materias regulares aún)

END $$;

-- migrate:down

