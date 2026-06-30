-- migrate:up

DELETE FROM respuesta_estudiante WHERE asignacion_id IN (
    SELECT id FROM asignacion_encuesta WHERE estudiante_id IN (3, 4, 5) AND periodo_lectivo = '20261'
);

DO $$
DECLARE
    -- Asignaciones
    asig_e3 INT[];
    asig_e4 INT[];
    asig_e5 INT[];

    -- Carrera
    carrera_e INT;

    -- Preguntas Evento 1
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

    -- Opciones Evento 1
    o_secundario_madre INT;
    o_terciario_madre INT;
    o_universitario_madre INT;
    o_secundario_padre INT;
    o_terciario_padre INT;
    o_universitario_padre INT;

    o_escuela_publica INT;
    o_escuela_privada INT;

    -- Preguntas Evento 2
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

    -- Opciones Evento 2
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

    -- Preguntas Evento 3
    p_localidad INT;
    p_situacion_vivienda INT;
    p_personas_hogar INT;
    p_espacio_estudio INT;
    p_tiempo_viaje INT;
    p_obstaculo_traslado INT;
    p_ganas_estudiar INT;
    p_interes_contenidos INT;
    p_conoce_espacios INT;

    -- Opciones Evento 3
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

    -- Pregunta Evento 4
    p_inscripcion_materia INT;

    -- Preguntas Evento 5
    p_e5_nota INT;
    p_e5_situacion INT;

    -- Opciones Evento 5
    o_e5_situacion_recursa INT;
    o_e5_situacion_habilita INT;
    o_e5_situacion_promociona INT;

    -- Preguntas Evento 6
    p_e6_aprobo_final INT;
    p_e6_nota_final INT;

    -- Opciones Evento 6
    o_e6_aprobo_si INT;
    o_e6_aprobo_no INT;
    o_e6_aprobo_no_presento INT;

    -- Materias
    m_analisis_2 INT;
    m_algebra_2 INT;
    m_fisica_a INT;
    m_programacion INT;
    m_analisis_3 INT;
    m_prob_estad INT;
    m_mecanica_solido INT;
    m_fisica_b_2 INT;
    m_ingles_1 INT;
    m_proyecto_1 INT;
    m_admin_estrategica INT;
    m_economia_industrial INT;
    m_maquinas_equipos INT;
    m_termodinamica INT;
    m_ingles_2 INT;
    m_admin_operaciones INT;
    m_inv_operativa_a INT;
    m_gestion_tecnologia INT;
    m_tecnologia_materiales INT;
    m_etica INT;
    m_mecanica_fluidos INT;
    m_planif_control INT;
    m_inv_operativa_b INT;
    m_sist_representacion INT;
    m_fisica_exp_a INT;
    m_logistica INT;
    m_electiva_1 INT;
    m_proyecto_2 INT;
    m_diseno_instalaciones INT;
    m_sist_gestion INT;
    m_comp_organizacional INT;
    m_procesos_fabricacion INT;
    m_ingles_prof_a INT;

BEGIN
    -- ======== CARGAR ASIGNACIONES ========
    asig_e3 := ARRAY[
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 3 AND evento_id = 1 AND periodo_lectivo = '20261' LIMIT 1),
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 3 AND evento_id = 2 AND periodo_lectivo = '20261' LIMIT 1),
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 3 AND evento_id = 3 AND periodo_lectivo = '20261' LIMIT 1),
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 3 AND evento_id = 4 AND periodo_lectivo = '20261' LIMIT 1),
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 3 AND evento_id = 5 AND periodo_lectivo = '20261' LIMIT 1),
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 3 AND evento_id = 6 AND periodo_lectivo = '20261' LIMIT 1)
    ];

    asig_e4 := ARRAY[
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 4 AND evento_id = 1 AND periodo_lectivo = '20261' LIMIT 1),
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 4 AND evento_id = 2 AND periodo_lectivo = '20261' LIMIT 1),
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 4 AND evento_id = 3 AND periodo_lectivo = '20261' LIMIT 1),
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 4 AND evento_id = 4 AND periodo_lectivo = '20261' LIMIT 1),
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 4 AND evento_id = 5 AND periodo_lectivo = '20261' LIMIT 1)
    ];

    asig_e5 := ARRAY[
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 5 AND evento_id = 1 AND periodo_lectivo = '20261' LIMIT 1),
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 5 AND evento_id = 2 AND periodo_lectivo = '20261' LIMIT 1),
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 5 AND evento_id = 3 AND periodo_lectivo = '20261' LIMIT 1),
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 5 AND evento_id = 4 AND periodo_lectivo = '20261' LIMIT 1),
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 5 AND evento_id = 5 AND periodo_lectivo = '20261' LIMIT 1),
        (SELECT id FROM asignacion_encuesta WHERE estudiante_id = 5 AND evento_id = 6 AND periodo_lectivo = '20261' LIMIT 1)
    ];

    SELECT carrera_id INTO carrera_e FROM estudiantes WHERE id = 3;

    -- ======== CARGAR PREGUNTAS Y OPCIONES ========
    SELECT id INTO p_madre FROM pregunta WHERE texto_pregunta ILIKE '%nivel educativo de tu madre%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_padre FROM pregunta WHERE texto_pregunta ILIKE '%nivel educativo de tu padre%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_familia_vive FROM pregunta WHERE texto_pregunta ILIKE '%familia vive en Mar del Plata%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_familia_oriunda FROM pregunta WHERE texto_pregunta ILIKE '%familia es oriunda%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_horas_viaje FROM pregunta WHERE texto_pregunta ILIKE '%horas de viaje%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_comunicacion FROM pregunta WHERE texto_pregunta ILIKE '%comunicas con ellos%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_tipo_institucion FROM pregunta WHERE texto_pregunta ILIKE '%tipo de institución%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_secundario_tiempo FROM pregunta WHERE texto_pregunta ILIKE '%secundario en tiempo%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_primera_opcion FROM pregunta WHERE texto_pregunta ILIKE '%primera op%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_seguridad_carrera FROM pregunta WHERE texto_pregunta ILIKE '%seguro te sentis%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_importancia_formacion FROM pregunta WHERE texto_pregunta ILIKE '%formación acad%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_apoyo_familiar FROM pregunta WHERE texto_pregunta ILIKE '%entorno familiar apoya%' AND carrera_id = carrera_e LIMIT 1;

    SELECT id INTO o_secundario_madre FROM opcion_pregunta WHERE texto_opcion = 'Secundario' AND pregunta_id = p_madre;
    SELECT id INTO o_terciario_madre FROM opcion_pregunta WHERE texto_opcion = 'Terciario' AND pregunta_id = p_madre;
    SELECT id INTO o_universitario_madre FROM opcion_pregunta WHERE texto_opcion = 'Universitario' AND pregunta_id = p_madre;
    SELECT id INTO o_secundario_padre FROM opcion_pregunta WHERE texto_opcion = 'Secundario' AND pregunta_id = p_padre;
    SELECT id INTO o_terciario_padre FROM opcion_pregunta WHERE texto_opcion = 'Terciario' AND pregunta_id = p_padre;
    SELECT id INTO o_universitario_padre FROM opcion_pregunta WHERE texto_opcion = 'Universitario' AND pregunta_id = p_padre;

    SELECT id INTO o_escuela_publica FROM opcion_pregunta WHERE texto_opcion = 'Escuela Publica' AND pregunta_id = p_tipo_institucion;
    SELECT id INTO o_escuela_privada FROM opcion_pregunta WHERE texto_opcion = 'Escuela Privada' AND pregunta_id = p_tipo_institucion;

    SELECT id INTO p_asistencia        FROM pregunta WHERE texto_pregunta ILIKE '%no pudiste asistir%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_estres            FROM pregunta WHERE texto_pregunta ILIKE '%niveles de estrés%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_apoyo_contencion  FROM pregunta WHERE texto_pregunta ILIKE '%apoyo o contención%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_motivacion        FROM pregunta WHERE texto_pregunta ILIKE '%tan motivado%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_pensaste_abandonar FROM pregunta WHERE texto_pregunta ILIKE '%pensaste en abandonar%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_dejar_proximo     FROM pregunta WHERE texto_pregunta ILIKE '%dejar de cursar el próximo%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_trabajando        FROM pregunta WHERE texto_pregunta ILIKE '%trabajando actualmente%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_carga_laboral     FROM pregunta WHERE texto_pregunta ILIKE '%carga laboral cambió%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_trabajo_rendimiento FROM pregunta WHERE texto_pregunta ILIKE '%trabajo interfiere%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_horas_trabajo     FROM pregunta WHERE texto_pregunta ILIKE '%horas trabajas por semana%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_situacion_economica FROM pregunta WHERE texto_pregunta ILIKE '%situación económica%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_rendimiento_academico FROM pregunta WHERE texto_pregunta ILIKE '%rendimiento académico%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_objetivos         FROM pregunta WHERE texto_pregunta ILIKE '%objetivos académicos%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_materia_dificultad FROM pregunta WHERE texto_pregunta ILIKE '%materia en que tuviste%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_recursos_facultad FROM pregunta WHERE texto_pregunta ILIKE '%facultad te brinda los recursos%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_conocias_recursos FROM pregunta WHERE texto_pregunta ILIKE '%recursos de apoyo disponibles%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_contacto_equipo   FROM pregunta WHERE texto_pregunta ILIKE '%contactado por alguien%' AND carrera_id = carrera_e LIMIT 1;

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

    SELECT id INTO p_localidad          FROM pregunta WHERE texto_pregunta ILIKE '%localidad vivís%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_situacion_vivienda FROM pregunta WHERE texto_pregunta ILIKE '%situación de vivienda%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_personas_hogar     FROM pregunta WHERE texto_pregunta ILIKE '%personas viven en tu hogar%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_espacio_estudio    FROM pregunta WHERE texto_pregunta ILIKE '%espacio en tu casa adecuado%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_tiempo_viaje       FROM pregunta WHERE texto_pregunta ILIKE '%tiempo aproximado de la facultad%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_obstaculo_traslado FROM pregunta WHERE texto_pregunta ILIKE '%obstáculo%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_ganas_estudiar     FROM pregunta WHERE texto_pregunta ILIKE '%menos ganas de continuar la carrera%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_interes_contenidos FROM pregunta WHERE texto_pregunta ILIKE '%interesado te sentiste%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_conoce_espacios    FROM pregunta WHERE texto_pregunta ILIKE '%espacios que la facultad brinda%' AND carrera_id = carrera_e LIMIT 1;

    SELECT id INTO o_vivienda_pension    FROM opcion_pregunta WHERE texto_opcion = 'Pensión' AND pregunta_id = p_situacion_vivienda;
    SELECT id INTO o_vivienda_familiares FROM opcion_pregunta WHERE texto_opcion = 'Vivo en casa de familiares que no son mis padres' AND pregunta_id = p_situacion_vivienda;
    SELECT id INTO o_vivienda_alq        FROM opcion_pregunta WHERE texto_opcion = 'Casa/Departamento (Alquilado)' AND pregunta_id = p_situacion_vivienda;
    SELECT id INTO o_vivienda_propio     FROM opcion_pregunta WHERE texto_opcion = 'Casa/Departamento (Propio)' AND pregunta_id = p_situacion_vivienda;
    SELECT id INTO o_vivienda_otro       FROM opcion_pregunta WHERE texto_opcion = 'Otro' AND pregunta_id = p_situacion_vivienda;
    SELECT id INTO o_espacio_no         FROM opcion_pregunta WHERE texto_opcion = 'No' AND pregunta_id = p_espacio_estudio;
    SELECT id INTO o_espacio_no_siempre FROM opcion_pregunta WHERE texto_opcion = 'No siempre está disponible' AND pregunta_id = p_espacio_estudio;
    SELECT id INTO o_espacio_comparto   FROM opcion_pregunta WHERE texto_opcion = 'Si, pero comparto' AND pregunta_id = p_espacio_estudio;
    SELECT id INTO o_espacio_propio     FROM opcion_pregunta WHERE texto_opcion = 'Si, uno propio' AND pregunta_id = p_espacio_estudio;
    SELECT id INTO o_tiempo_mas_1h   FROM opcion_pregunta WHERE texto_opcion = '> 1h' AND pregunta_id = p_tiempo_viaje;
    SELECT id INTO o_tiempo_31_1h    FROM opcion_pregunta WHERE texto_opcion = '31''-1 h' AND pregunta_id = p_tiempo_viaje;
    SELECT id INTO o_tiempo_15_30    FROM opcion_pregunta WHERE texto_opcion = '15''-30''' AND pregunta_id = p_tiempo_viaje;
    SELECT id INTO o_tiempo_menos_15 FROM opcion_pregunta WHERE texto_opcion = '< 15''' AND pregunta_id = p_tiempo_viaje;
    SELECT id INTO o_ganas_menos FROM opcion_pregunta WHERE texto_opcion = 'Menos' AND pregunta_id = p_ganas_estudiar;
    SELECT id INTO o_ganas_igual FROM opcion_pregunta WHERE texto_opcion = 'Igual' AND pregunta_id = p_ganas_estudiar;
    SELECT id INTO o_ganas_mas   FROM opcion_pregunta WHERE texto_opcion = 'Más' AND pregunta_id = p_ganas_estudiar;

    SELECT id INTO p_inscripcion_materia FROM pregunta WHERE texto_pregunta ILIKE '%inscribiste a {MATERIA}%' AND carrera_id = carrera_e LIMIT 1;

    SELECT id INTO p_e5_nota      FROM pregunta WHERE texto_pregunta ILIKE '%nota en {MATERIA}%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_e5_situacion FROM pregunta WHERE texto_pregunta ILIKE '%situación final en {MATERIA}%' AND carrera_id = carrera_e LIMIT 1;

    SELECT id INTO o_e5_situacion_recursa    FROM opcion_pregunta WHERE texto_opcion = 'Recursa'    AND pregunta_id = p_e5_situacion LIMIT 1;
    SELECT id INTO o_e5_situacion_habilita   FROM opcion_pregunta WHERE texto_opcion = 'Habilita'   AND pregunta_id = p_e5_situacion LIMIT 1;
    SELECT id INTO o_e5_situacion_promociona FROM opcion_pregunta WHERE texto_opcion = 'Promociona' AND pregunta_id = p_e5_situacion LIMIT 1;

    SELECT id INTO p_e6_aprobo_final FROM pregunta WHERE texto_pregunta ILIKE '%Aprobaste el final de {MATERIA}%' AND carrera_id = carrera_e LIMIT 1;
    SELECT id INTO p_e6_nota_final   FROM pregunta WHERE texto_pregunta ILIKE '%nota en el final de {MATERIA}%' AND carrera_id = carrera_e LIMIT 1;

    SELECT id INTO o_e6_aprobo_si          FROM opcion_pregunta WHERE texto_opcion = 'Sí' AND pregunta_id = p_e6_aprobo_final LIMIT 1;
    SELECT id INTO o_e6_aprobo_no          FROM opcion_pregunta WHERE texto_opcion = 'No' AND pregunta_id = p_e6_aprobo_final LIMIT 1;
    SELECT id INTO o_e6_aprobo_no_presento FROM opcion_pregunta WHERE texto_opcion = 'No me presenté' AND pregunta_id = p_e6_aprobo_final LIMIT 1;

    -- ======== CARGAR IDs DE MATERIAS ========
    SELECT id INTO m_analisis_2         FROM materias WHERE nombre ILIKE '%Análisis Matemático II%' LIMIT 1;
    SELECT id INTO m_algebra_2          FROM materias WHERE nombre ILIKE '%Álgebra II%' LIMIT 1;
    SELECT id INTO m_fisica_a           FROM materias WHERE nombre ILIKE '%Física A%' LIMIT 1;
    SELECT id INTO m_programacion       FROM materias WHERE nombre ILIKE '%Fundamentos de la Programación%' LIMIT 1;
    SELECT id INTO m_analisis_3         FROM materias WHERE nombre ILIKE '%Análisis Matemático III%' LIMIT 1;
    SELECT id INTO m_prob_estad         FROM materias WHERE nombre ILIKE '%Probabilidad y Estadística%' LIMIT 1;
    SELECT id INTO m_mecanica_solido    FROM materias WHERE nombre ILIKE '%Mecánica del Sólido%' LIMIT 1;
    SELECT id INTO m_fisica_b_2         FROM materias WHERE nombre ILIKE '%Física B-II%' LIMIT 1;
    SELECT id INTO m_ingles_1           FROM materias WHERE nombre ILIKE '%Inglés I%' LIMIT 1;
    SELECT id INTO m_proyecto_1         FROM materias WHERE nombre ILIKE '%Proyecto de Ingeniería Industrial I%' LIMIT 1;
    SELECT id INTO m_admin_estrategica  FROM materias WHERE nombre ILIKE '%Administración Estratégica%' LIMIT 1;
    SELECT id INTO m_economia_industrial FROM materias WHERE nombre ILIKE '%Conceptos de Economía Industrial%' LIMIT 1;
    SELECT id INTO m_maquinas_equipos   FROM materias WHERE nombre ILIKE '%Máquinas y Equipos Industriales I%' LIMIT 1;
    SELECT id INTO m_termodinamica      FROM materias WHERE nombre ILIKE '%Termodinámica Industrial%' LIMIT 1;
    SELECT id INTO m_ingles_2           FROM materias WHERE nombre ILIKE '%Inglés II%' LIMIT 1;
    SELECT id INTO m_admin_operaciones       FROM materias WHERE nombre ILIKE '%Administración de Operaciones%' LIMIT 1;
    SELECT id INTO m_inv_operativa_a         FROM materias WHERE nombre ILIKE '%Investigación Operativa A%' LIMIT 1;
    SELECT id INTO m_gestion_tecnologia      FROM materias WHERE nombre ILIKE '%Gestión de la Tecnología y la Innovación%' LIMIT 1;
    SELECT id INTO m_tecnologia_materiales   FROM materias WHERE nombre ILIKE '%Tecnología de los Materiales%' LIMIT 1;
    SELECT id INTO m_etica                   FROM materias WHERE nombre ILIKE '%Ética, Legislación%' LIMIT 1;
    SELECT id INTO m_mecanica_fluidos        FROM materias WHERE nombre ILIKE '%Mecánica de Fluidos%' LIMIT 1;
    SELECT id INTO m_planif_control      FROM materias WHERE nombre ILIKE '%Planificación y Control de la Producción%' LIMIT 1;
    SELECT id INTO m_inv_operativa_b     FROM materias WHERE nombre ILIKE '%Investigación Operativa B%' LIMIT 1;
    SELECT id INTO m_sist_representacion FROM materias WHERE nombre ILIKE '%Sistemas de Representación para Ingeniería%' LIMIT 1;
    SELECT id INTO m_fisica_exp_a        FROM materias WHERE nombre ILIKE '%Física Experimental A%' LIMIT 1;
    SELECT id INTO m_logistica           FROM materias WHERE nombre ILIKE '%Gestión de la Logística%' LIMIT 1;
    SELECT id INTO m_electiva_1          FROM materias WHERE nombre ILIKE '%Electiva I%' LIMIT 1;
    SELECT id INTO m_proyecto_2          FROM materias WHERE nombre ILIKE '%Proyecto de Ingeniería Industrial II%' LIMIT 1;
    SELECT id INTO m_diseno_instalaciones FROM materias WHERE nombre ILIKE '%Diseño de Instalaciones y Procesos%' LIMIT 1;
    SELECT id INTO m_sist_gestion         FROM materias WHERE nombre ILIKE '%Sistemas de Gestión y Mejora Continua%' LIMIT 1;
    SELECT id INTO m_comp_organizacional  FROM materias WHERE nombre ILIKE '%Comportamiento Organizacional%' LIMIT 1;
    SELECT id INTO m_procesos_fabricacion FROM materias WHERE nombre ILIKE '%Introducción a los Procesos de Fabricación%' LIMIT 1;
    SELECT id INTO m_ingles_prof_a        FROM materias WHERE nombre ILIKE '%Inglés Profesional A%' LIMIT 1;

    -- ======================================================================
    -- MATEO (3) - BAJO RIESGO
    -- ======================================================================

    -- Evento 1 - Mateo
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    (asig_e3[1], p_madre,                 NULL, o_universitario_madre,    NULL, NULL, 0),
    (asig_e3[1], p_padre,                 NULL, o_universitario_padre,    NULL, NULL, 0),
    (asig_e3[1], p_familia_vive,          NULL, NULL,              NULL, 'si', 0),
    (asig_e3[1], p_familia_oriunda,       NULL, NULL,              NULL, 'si', 0),
    (asig_e3[1], p_horas_viaje,           NULL, NULL,              0,    NULL, 0),
    (asig_e3[1], p_comunicacion,          NULL, NULL,              NULL, 'si', 0),
    (asig_e3[1], p_tipo_institucion,      NULL, o_escuela_privada, NULL, NULL, 0),
    (asig_e3[1], p_secundario_tiempo,     NULL, NULL,              NULL, 'si', 0),
    (asig_e3[1], p_primera_opcion,        NULL, NULL,              NULL, 'si', 0),
    (asig_e3[1], p_seguridad_carrera,     NULL, NULL,              5,    NULL, 0),
    (asig_e3[1], p_importancia_formacion, NULL, NULL,              5,    NULL, 0),
    (asig_e3[1], p_apoyo_familiar,        NULL, NULL,              5,    NULL, 0);

    -- Evento 2 - Mateo
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    (asig_e3[2], p_asistencia,          NULL, NULL,               NULL, 'no',  0),
    (asig_e3[2], p_estres,              NULL, NULL,               3,    NULL, 0.5),
    (asig_e3[2], p_apoyo_contencion,    NULL, NULL,               NULL, 'si',  0),
    (asig_e3[2], p_motivacion,          NULL, NULL,               4,    NULL, 0.25),
    (asig_e3[2], p_pensaste_abandonar,  NULL, o_abandonar_no,     NULL, NULL,  0),
    (asig_e3[2], p_dejar_proximo,       NULL, o_dejar_no,         NULL, NULL,  0),
    (asig_e3[2], p_trabajando,          NULL, NULL,               NULL, 'no',  0),
    (asig_e3[2], p_carga_laboral,       NULL, o_carga_igual,      NULL, NULL, 0.5),
    (asig_e3[2], p_trabajo_rendimiento, NULL, NULL,               2,    NULL, 0.25),
    (asig_e3[2], p_horas_trabajo,       NULL, NULL,               0,    NULL, 0),
    (asig_e3[2], p_situacion_economica, NULL, o_economica_no,     NULL, NULL,  0),
    (asig_e3[2], p_rendimiento_academico, NULL, NULL,             4,    NULL, 0.25),
    (asig_e3[2], p_objetivos,           NULL, NULL,               NULL, 'si',  0),
    (asig_e3[2], p_materia_dificultad,  NULL, NULL,               NULL, 'no',  0),
    (asig_e3[2], p_recursos_facultad,   NULL, NULL,               4,    NULL, 0.25),
    (asig_e3[2], p_conocias_recursos,   NULL, o_recursos_si,      NULL, NULL,  0),
    (asig_e3[2], p_contacto_equipo,     NULL, NULL,               NULL, 'si',  0);

    -- Evento 3 - Mateo
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    (asig_e3[3], p_localidad,          NULL, NULL,                 NULL, 'Mar del Plata', NULL),
    (asig_e3[3], p_situacion_vivienda, NULL, o_vivienda_propio,    NULL, NULL, 0),
    (asig_e3[3], p_personas_hogar,     NULL, NULL,                 3,    NULL, 0.3),
    (asig_e3[3], p_espacio_estudio,    NULL, o_espacio_propio,     NULL, NULL, 0),
    (asig_e3[3], p_tiempo_viaje,       NULL, o_tiempo_menos_15,    NULL, NULL, 0),
    (asig_e3[3], p_obstaculo_traslado, NULL, NULL,                 1,    NULL, 0),
    (asig_e3[3], p_ganas_estudiar,     NULL, o_ganas_mas,          NULL, NULL, 0),
    (asig_e3[3], p_interes_contenidos, NULL, NULL,                 5,    NULL, 0),
    (asig_e3[3], p_conoce_espacios,    NULL, NULL,                 NULL, 'si', 0);

    -- Evento 4 - Mateo (C7 - cursando)
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    (asig_e3[4], p_inscripcion_materia, m_diseno_instalaciones, NULL, NULL, 'si', 0),
    (asig_e3[4], p_inscripcion_materia, m_sist_gestion,         NULL, NULL, 'si', 0),
    (asig_e3[4], p_inscripcion_materia, m_comp_organizacional,  NULL, NULL, 'si', 0),
    (asig_e3[4], p_inscripcion_materia, m_procesos_fabricacion, NULL, NULL, 'si', 0),
    (asig_e3[4], p_inscripcion_materia, m_ingles_prof_a,        NULL, NULL, 'si', 0);

    -- Evento 5 - Mateo (C6 - aprobadas)
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    (asig_e3[5], p_e5_nota,      m_planif_control,     NULL,                      8,    NULL, 0.22),
    (asig_e3[5], p_e5_situacion, m_planif_control,     o_e5_situacion_promociona, NULL, NULL, 0),
    (asig_e3[5], p_e5_nota,      m_inv_operativa_b,    NULL,                      7,    NULL, 0.33),
    (asig_e3[5], p_e5_situacion, m_inv_operativa_b,    o_e5_situacion_promociona, NULL, NULL, 0),
    (asig_e3[5], p_e5_nota,      m_sist_representacion, NULL,                      9,    NULL, 0.11),
    (asig_e3[5], p_e5_situacion, m_sist_representacion, o_e5_situacion_promociona, NULL, NULL, 0),
    (asig_e3[5], p_e5_nota,      m_fisica_exp_a,        NULL,                      6,    NULL, 0.44),
    (asig_e3[5], p_e5_situacion, m_fisica_exp_a,        o_e5_situacion_habilita,   NULL, NULL, 0.5),
    (asig_e3[5], p_e5_nota,      m_logistica,           NULL,                      8,    NULL, 0.22),
    (asig_e3[5], p_e5_situacion, m_logistica,           o_e5_situacion_promociona, NULL, NULL, 0),
    (asig_e3[5], p_e5_nota,      m_electiva_1,          NULL,                      7,    NULL, 0.33),
    (asig_e3[5], p_e5_situacion, m_electiva_1,          o_e5_situacion_promociona, NULL, NULL, 0),
    (asig_e3[5], p_e5_nota,      m_proyecto_2,          NULL,                      9,    NULL, 0.11),
    (asig_e3[5], p_e5_situacion, m_proyecto_2,          o_e5_situacion_promociona, NULL, NULL, 0);

    -- Evento 6 - Mateo (finales de Inv Operativa B y Física Exp A)
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    (asig_e3[6], p_e6_aprobo_final, m_inv_operativa_b, o_e6_aprobo_si, NULL, NULL, 0),
    (asig_e3[6], p_e6_nota_final,   m_inv_operativa_b, NULL,           7,    NULL, 0.33),
    (asig_e3[6], p_e6_aprobo_final, m_fisica_exp_a,    o_e6_aprobo_si, NULL, NULL, 0),
    (asig_e3[6], p_e6_nota_final,   m_fisica_exp_a,    NULL,           6,    NULL, 0.44);

    -- ======================================================================
    -- MARTINA (4) - RIESGO MIXTO
    -- ======================================================================

    -- Evento 1 - Martina
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    (asig_e4[1], p_madre,                 NULL, o_secundario_madre,      NULL, NULL, 0.6),
    (asig_e4[1], p_padre,                 NULL, o_secundario_padre,      NULL, NULL, 0.6),
    (asig_e4[1], p_familia_vive,          NULL, NULL,              NULL, 'si', 0),
    (asig_e4[1], p_familia_oriunda,       NULL, NULL,              NULL, 'si', 0),
    (asig_e4[1], p_horas_viaje,           NULL, NULL,              0,    NULL, 0),
    (asig_e4[1], p_comunicacion,          NULL, NULL,              NULL, 'si', 0),
    (asig_e4[1], p_tipo_institucion,      NULL, o_escuela_publica, NULL, NULL, 0.5),
    (asig_e4[1], p_secundario_tiempo,     NULL, NULL,              NULL, 'si', 0),
    (asig_e4[1], p_primera_opcion,        NULL, NULL,              NULL, 'si', 0),
    (asig_e4[1], p_seguridad_carrera,     NULL, NULL,              4,    NULL, 0.25),
    (asig_e4[1], p_importancia_formacion, NULL, NULL,              5,    NULL, 0),
    (asig_e4[1], p_apoyo_familiar,        NULL, NULL,              4,    NULL, 0.25);

    -- Evento 2 - Martina
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    (asig_e4[2], p_asistencia,          NULL, NULL,               NULL, 'no',  0),
    (asig_e4[2], p_estres,              NULL, NULL,               4,    NULL, 0.25),
    (asig_e4[2], p_apoyo_contencion,    NULL, NULL,               NULL, 'si',  0),
    (asig_e4[2], p_motivacion,          NULL, NULL,               3,    NULL, 0.5),
    (asig_e4[2], p_pensaste_abandonar,  NULL, o_abandonar_lo_pense, NULL, NULL, 0.5),
    (asig_e4[2], p_dejar_proximo,       NULL, o_dejar_no_se,      NULL, NULL, 0.5),
    (asig_e4[2], p_trabajando,          NULL, NULL,               NULL, 'no',  0),
    (asig_e4[2], p_carga_laboral,       NULL, o_carga_igual,      NULL, NULL, 0.5),
    (asig_e4[2], p_trabajo_rendimiento, NULL, NULL,               1,    NULL, 0),
    (asig_e4[2], p_horas_trabajo,       NULL, NULL,               0,    NULL, 0),
    (asig_e4[2], p_situacion_economica, NULL, o_economica_no,     NULL, NULL,  0),
    (asig_e4[2], p_rendimiento_academico, NULL, NULL,             3,    NULL, 0.5),
    (asig_e4[2], p_objetivos,           NULL, NULL,               NULL, 'si',  0),
    (asig_e4[2], p_materia_dificultad,  NULL, NULL,               NULL, 'si',  1),
    (asig_e4[2], p_recursos_facultad,   NULL, NULL,               3,    NULL, 0.5),
    (asig_e4[2], p_conocias_recursos,   NULL, o_recursos_este_cuatri, NULL, NULL, 0.5),
    (asig_e4[2], p_contacto_equipo,     NULL, NULL,               NULL, 'no',  1);

    -- Evento 3 - Martina
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    (asig_e4[3], p_localidad,          NULL, NULL,                 NULL, 'Mar del Plata', NULL),
    (asig_e4[3], p_situacion_vivienda, NULL, o_vivienda_propio,    NULL, NULL, 0),
    (asig_e4[3], p_personas_hogar,     NULL, NULL,                 4,    NULL, 0.4),
    (asig_e4[3], p_espacio_estudio,    NULL, o_espacio_comparto,   NULL, NULL, 0.25),
    (asig_e4[3], p_tiempo_viaje,       NULL, o_tiempo_15_30,       NULL, NULL, 0.3),
    (asig_e4[3], p_obstaculo_traslado, NULL, NULL,                 2,    NULL, 0.25),
    (asig_e4[3], p_ganas_estudiar,     NULL, o_ganas_igual,        NULL, NULL, 0.5),
    (asig_e4[3], p_interes_contenidos, NULL, NULL,                 4,    NULL, 0.25),
    (asig_e4[3], p_conoce_espacios,    NULL, NULL,                 NULL, 'si', 0);

    -- Evento 4 - Martina (C3 - cursando)
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    (asig_e4[4], p_inscripcion_materia, m_analisis_3,    NULL, NULL, 'si', 0),
    (asig_e4[4], p_inscripcion_materia, m_prob_estad,    NULL, NULL, 'si', 0),
    (asig_e4[4], p_inscripcion_materia, m_mecanica_solido, NULL, NULL, 'si', 0),
    (asig_e4[4], p_inscripcion_materia, m_fisica_b_2,    NULL, NULL, 'si', 0),
    (asig_e4[4], p_inscripcion_materia, m_ingles_1,      NULL, NULL, 'si', 0),
    (asig_e4[4], p_inscripcion_materia, m_proyecto_1,    NULL, NULL, 'si', 0);

    -- Evento 5 - Martina (C2 - aprobadas)
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    (asig_e4[5], p_e5_nota,      m_analisis_2,    NULL,                      7,    NULL, 0.33),
    (asig_e4[5], p_e5_situacion, m_analisis_2,    o_e5_situacion_promociona, NULL, NULL, 0),
    (asig_e4[5], p_e5_nota,      m_algebra_2,     NULL,                      6,    NULL, 0.44),
    (asig_e4[5], p_e5_situacion, m_algebra_2,     o_e5_situacion_habilita,   NULL, NULL, 0.5),
    (asig_e4[5], p_e5_nota,      m_fisica_a,      NULL,                      5,    NULL, 0.55),
    (asig_e4[5], p_e5_situacion, m_fisica_a,      o_e5_situacion_habilita,   NULL, NULL, 0.5),
    (asig_e4[5], p_e5_nota,      m_programacion,  NULL,                      8,    NULL, 0.22),
    (asig_e4[5], p_e5_situacion, m_programacion,  o_e5_situacion_promociona, NULL, NULL, 0);

    -- ======================================================================
    -- BAUTISTA (5) - RIESGO MODERADO
    -- ======================================================================

    -- Evento 1 - Bautista
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    (asig_e5[1], p_madre,                 NULL, o_terciario_madre,       NULL, NULL, 0.3),
    (asig_e5[1], p_padre,                 NULL, o_secundario_padre,      NULL, NULL, 0.6),
    (asig_e5[1], p_familia_vive,          NULL, NULL,              NULL, 'si', 0),
    (asig_e5[1], p_familia_oriunda,       NULL, NULL,              NULL, 'no', 1),
    (asig_e5[1], p_horas_viaje,           NULL, NULL,              0,    NULL, 0),
    (asig_e5[1], p_comunicacion,          NULL, NULL,              NULL, 'si', 0),
    (asig_e5[1], p_tipo_institucion,      NULL, o_escuela_publica, NULL, NULL, 0.5),
    (asig_e5[1], p_secundario_tiempo,     NULL, NULL,              NULL, 'si', 0),
    (asig_e5[1], p_primera_opcion,        NULL, NULL,              NULL, 'no', 1),
    (asig_e5[1], p_seguridad_carrera,     NULL, NULL,              3,    NULL, 0.5),
    (asig_e5[1], p_importancia_formacion, NULL, NULL,              4,    NULL, 0.25),
    (asig_e5[1], p_apoyo_familiar,        NULL, NULL,              3,    NULL, 0.5);

    -- Evento 2 - Bautista
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    (asig_e5[2], p_asistencia,          NULL, NULL,               NULL, 'no',  0),
    (asig_e5[2], p_estres,              NULL, NULL,               3,    NULL, 0.5),
    (asig_e5[2], p_apoyo_contencion,    NULL, NULL,               NULL, 'si',  0),
    (asig_e5[2], p_motivacion,          NULL, NULL,               3,    NULL, 0.5),
    (asig_e5[2], p_pensaste_abandonar,  NULL, o_abandonar_lo_pense, NULL, NULL, 0.5),
    (asig_e5[2], p_dejar_proximo,       NULL, o_dejar_no,         NULL, NULL,  0),
    (asig_e5[2], p_trabajando,          NULL, NULL,               NULL, 'si',  1),
    (asig_e5[2], p_carga_laboral,       NULL, o_carga_igual,      NULL, NULL, 0.5),
    (asig_e5[2], p_trabajo_rendimiento, NULL, NULL,               3,    NULL, 0.5),
    (asig_e5[2], p_horas_trabajo,       NULL, NULL,               25,   NULL, 0.31),
    (asig_e5[2], p_situacion_economica, NULL, o_economica_parcialmente, NULL, NULL, 0.5),
    (asig_e5[2], p_rendimiento_academico, NULL, NULL,             3,    NULL, 0.5),
    (asig_e5[2], p_objetivos,           NULL, NULL,               NULL, 'si',  0),
    (asig_e5[2], p_materia_dificultad,  NULL, NULL,               NULL, 'si',  1),
    (asig_e5[2], p_recursos_facultad,   NULL, NULL,               3,    NULL, 0.5),
    (asig_e5[2], p_conocias_recursos,   NULL, o_recursos_este_cuatri, NULL, NULL, 0.5),
    (asig_e5[2], p_contacto_equipo,     NULL, NULL,               NULL, 'si',  0);

    -- Evento 3 - Bautista
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    (asig_e5[3], p_localidad,          NULL, NULL,                 NULL, 'Mar del Plata', NULL),
    (asig_e5[3], p_situacion_vivienda, NULL, o_vivienda_alq,       NULL, NULL, 0.3),
    (asig_e5[3], p_personas_hogar,     NULL, NULL,                 3,    NULL, 0.3),
    (asig_e5[3], p_espacio_estudio,    NULL, o_espacio_comparto,   NULL, NULL, 0.25),
    (asig_e5[3], p_tiempo_viaje,       NULL, o_tiempo_15_30,       NULL, NULL, 0.3),
    (asig_e5[3], p_obstaculo_traslado, NULL, NULL,                 3,    NULL, 0.5),
    (asig_e5[3], p_ganas_estudiar,     NULL, o_ganas_igual,        NULL, NULL, 0.5),
    (asig_e5[3], p_interes_contenidos, NULL, NULL,                 3,    NULL, 0.5),
    (asig_e5[3], p_conoce_espacios,    NULL, NULL,                 NULL, 'no', 1);

    -- Evento 4 - Bautista (C5 - cursando)
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    (asig_e5[4], p_inscripcion_materia, m_admin_operaciones,      NULL, NULL, 'si', 0),
    (asig_e5[4], p_inscripcion_materia, m_inv_operativa_a,        NULL, NULL, 'si', 0),
    (asig_e5[4], p_inscripcion_materia, m_gestion_tecnologia,     NULL, NULL, 'si', 0),
    (asig_e5[4], p_inscripcion_materia, m_tecnologia_materiales,  NULL, NULL, 'si', 0),
    (asig_e5[4], p_inscripcion_materia, m_etica,                  NULL, NULL, 'si', 0),
    (asig_e5[4], p_inscripcion_materia, m_mecanica_fluidos,       NULL, NULL, 'si', 0);

    -- Evento 5 - Bautista (C4 - aprobadas)
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    (asig_e5[5], p_e5_nota,      m_admin_estrategica,    NULL,                      7,    NULL, 0.33),
    (asig_e5[5], p_e5_situacion, m_admin_estrategica,    o_e5_situacion_promociona, NULL, NULL, 0),
    (asig_e5[5], p_e5_nota,      m_economia_industrial,  NULL,                      6,    NULL, 0.44),
    (asig_e5[5], p_e5_situacion, m_economia_industrial,  o_e5_situacion_promociona, NULL, NULL, 0),
    (asig_e5[5], p_e5_nota,      m_maquinas_equipos,     NULL,                      5,    NULL, 0.55),
    (asig_e5[5], p_e5_situacion, m_maquinas_equipos,     o_e5_situacion_habilita,   NULL, NULL, 0.5),
    (asig_e5[5], p_e5_nota,      m_termodinamica,        NULL,                      4,    NULL, 0.66),
    (asig_e5[5], p_e5_situacion, m_termodinamica,        o_e5_situacion_recursa,    NULL, NULL, 1),
    (asig_e5[5], p_e5_nota,      m_ingles_2,             NULL,                      6,    NULL, 0.44),
    (asig_e5[5], p_e5_situacion, m_ingles_2,             o_e5_situacion_habilita,   NULL, NULL, 0.5);

    -- Evento 6 - Bautista (final de Termodinámica)
    INSERT INTO respuesta_estudiante (asignacion_id, pregunta_id, materia_id, opcion_seleccionada_id, valor_numerico, valor_texto, riesgo_calculado) VALUES
    (asig_e5[6], p_e6_aprobo_final, m_termodinamica, o_e6_aprobo_si, NULL, NULL, 0),
    (asig_e5[6], p_e6_nota_final,   m_termodinamica, NULL,           6,    NULL, 0.44);

END $$;

-- migrate:down

DELETE FROM respuesta_estudiante WHERE asignacion_id IN (
    SELECT id FROM asignacion_encuesta WHERE estudiante_id IN (3, 4, 5) AND periodo_lectivo = '20261'
);
