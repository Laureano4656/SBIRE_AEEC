-- migrate:up

-- ==============================================================================
-- 1. INSERTAR DIMENSIONES (Criterios Principales -> dimension = NULL)
-- ==============================================================================
INSERT INTO public.indicador (id, nombre, dimension, activo) 
OVERRIDING SYSTEM VALUE VALUES
(1, 'Dimensión Sociodemográfica y de Origen', NULL, true),
(2, 'Dimensión de Infraestructura y Logística', NULL, true),
(3, 'Dimensión Vocacional y Psicológica', NULL, true),
(4, 'Dimensión Económica y Laboral', NULL, true),
(5, 'Dimensión Académica e Institucional Perceptiva', NULL, true);

-- ==============================================================================
-- 2. INSERTAR INDICADORES (Subcriterios -> dimension = ID de la dimensión padre)
-- ==============================================================================
INSERT INTO public.indicador (id, nombre, dimension, activo) 
OVERRIDING SYSTEM VALUE VALUES
(101, 'Capital Cultural Familiar', 1, true),
(102, 'Arraigo Local y Red de Apoyo', 1, true),
(103, 'Trayectoria Educativa Previa', 1, true),
(104, 'Estabilidad Habitacional', 2, true),
(105, 'Entorno de Estudio Físico', 2, true),
(106, 'Fricción de Movilidad', 2, true),
(107, 'Certeza Vocacional y Motivación', 3, true),
(108, 'Salud Mental y Nivel de Estrés', 3, true),
(109, 'Riesgo de Abandono Declarado', 3, true),
(110, 'Carga Laboral', 4, true),
(111, 'Vulnerabilidad Económica', 4, true),
(112, 'Autopercepción de Rendimiento', 5, true),
(113, 'Vinculación Institucional', 5, true),
(114, 'Rendimiento Académico', 5, true);

-- Actualizar secuencia de la tabla indicador para evitar errores a futuro
SELECT setval(pg_get_serial_sequence('public.indicador', 'id'), (SELECT MAX(id) FROM public.indicador));

-- ==============================================================================
-- 3. INSERTAR PREGUNTAS (Configuración de riesgo en JSONB inyectada directamente)
-- ==============================================================================
INSERT INTO public.pregunta (id, indicador_id, carrera_id, texto_pregunta, evento_disparador, tipo_pregunta, configuracion_riesgo, activa) 
OVERRIDING SYSTEM VALUE VALUES
-- Dim 1: Sociodemográfica
(1, 101, NULL, '¿Nivel educativo de tu madre?', 'unica_vez', 'opcion_multiple', NULL, true),
(2, 101, NULL, '¿Nivel educativo de tu padre?', 'unica_vez', 'opcion_multiple', NULL, true),
(3, 102, NULL, '¿Tu familia vive en Mar del Plata?', 'unica_vez', 'si_no', '{"valor_riesgo_maximo": "no"}', true),
(4, 102, NULL, '¿Tu familia es oriunda de Mar del Plata?', 'unica_vez', 'si_no', '{"valor_riesgo_maximo": "no"}', true),
(5, 102, NULL, '¿Cuántas horas de viaje tenés que hacer para visitar a tu familia?', 'unica_vez', 'numero', '{"intervalo_min": 0, "intervalo_max": 48, "extremo_riesgoso": "max"}', true),
(6, 102, NULL, '¿Te comunicas con ellos con asiduidad?', 'unica_vez', 'si_no', '{"valor_riesgo_maximo": "no"}', true),
(7, 103, NULL, '¿En qué tipo de institución cursaste el secundario?', 'unica_vez', 'opcion_multiple', NULL, true),
(8, 103, NULL, '¿Terminaste el secundario en tiempo y forma (sin adeudar materias al recibirte)?', 'unica_vez', 'si_no', '{"valor_riesgo_maximo": "no"}', true),

-- Dim 2: Infraestructura y Logística
(9, 104, NULL, '¿En qué localidad vivís actualmente?', 'anual', 'texto_libre', NULL, true),
(10, 104, NULL, '¿Cómo es tu situación de vivienda?', 'anual', 'opcion_multiple', NULL, true),
(11, 104, NULL, '¿Cuántas personas viven en tu hogar incluyéndote?', 'anual', 'numero', '{"intervalo_min": 1, "intervalo_max": 10, "extremo_riesgoso": "max"}', true),
(12, 105, NULL, '¿Contás con un espacio en tu casa adecuado para estudiar?', 'anual', 'opcion_multiple', NULL, true),
(13, 106, NULL, '¿A cuanto tiempo aproximado de la facultad vivís?', 'anual', 'opcion_multiple', NULL, true),
(14, 106, NULL, '¿El costo o el tiempo de traslado representa un obstáculo para asistir a clases?', 'anual', 'escala', '{"intervalo_min": 1, "intervalo_max": 5, "extremo_riesgoso": "max"}', true),
(15, 106, NULL, '¿Hubo días que no pudiste asistir a la facultad por problemas relacionados con el traslado?', 'cuatrimestral', 'si_no', '{"valor_riesgo_maximo": "si"}', true),

-- Dim 3: Vocacional y Psicológica
(16, 107, NULL, '¿La carrera que te encontras cursando fue tu primera opción como carrera a estudiar?', 'unica_vez', 'si_no', '{"valor_riesgo_maximo": "no"}', true),
(17, 107, NULL, '¿Qué tan seguro te sentis de haber elegido esta carrera?', 'unica_vez', 'escala', '{"intervalo_min": 1, "intervalo_max": 5, "extremo_riesgoso": "min"}', true),
(18, 107, NULL, '¿Cuán importante considerás que es la formación académica en la vida de una persona / para tu futuro económico?', 'unica_vez', 'escala', '{"intervalo_min": 1, "intervalo_max": 5, "extremo_riesgoso": "min"}', true),
(19, 107, NULL, '¿Sentís que tu entorno familiar apoya tu decisión de estudiar esta carrera?', 'unica_vez', 'escala', '{"intervalo_min": 1, "intervalo_max": 5, "extremo_riesgoso": "min"}', true),
(20, 107, NULL, '¿Los contenidos vistos este año te dieron más o menos ganas de continuar la carrera?', 'anual', 'opcion_multiple', NULL, true),
(21, 107, NULL, '¿Cuán interesado te sentiste en dichos contenidos?', 'anual', 'escala', '{"intervalo_min": 1, "intervalo_max": 5, "extremo_riesgoso": "min"}', true),
(22, 108, NULL, '¿Sentiste altos niveles de estrés en relación a la carrera?', 'cuatrimestral', 'escala', '{"intervalo_min": 1, "intervalo_max": 5, "extremo_riesgoso": "max"}', true),
(23, 108, NULL, '¿Buscaste o recibiste algún tipo de apoyo o contención?', 'cuatrimestral', 'si_no', '{"valor_riesgo_maximo": "no"}', true),
(24, 109, NULL, '¿Qué tan motivado te sentís con la carrera?', 'cuatrimestral', 'escala', '{"intervalo_min": 1, "intervalo_max": 5, "extremo_riesgoso": "min"}', true),
(25, 109, NULL, '¿En este cuatrimestre pensaste en abandonar la carrera?', 'cuatrimestral', 'opcion_multiple', NULL, true),
(26, 109, NULL, '¿Estás considerando dejar de cursar el próximo cuatrimestre?', 'cuatrimestral', 'opcion_multiple', NULL, true),

-- Dim 4: Económica y Laboral
(27, 110, NULL, '¿Estás trabajando actualmente?', 'cuatrimestral', 'si_no', '{"valor_riesgo_maximo": "si"}', true),
(28, 110, NULL, '¿Tu carga laboral cambió respecto al cuatrimestre anterior?', 'cuatrimestral', 'opcion_multiple', NULL, true),
(29, 110, NULL, '¿Sentís que el trabajo interfiere con tu rendimiento académico?', 'cuatrimestral', 'escala', '{"intervalo_min": 1, "intervalo_max": 5, "extremo_riesgoso": "max"}', true),
(30, 111, NULL, '¿Tu situación económica representó un obstáculo para estudiar en este cuatrimestre?', 'cuatrimestral', 'opcion_multiple', NULL, true),

-- Dim 5: Académica e Institucional Perceptiva
(31, 112, NULL, '¿Cómo calificarías tu rendimiento académico en este último cuatrimestre?', 'cuatrimestral', 'escala', '{"intervalo_min": 1, "intervalo_max": 5, "extremo_riesgoso": "min"}', true),
(32, 112, NULL, '¿Pudiste cumplir tus objetivos académicos de este cuatrimestre?', 'cuatrimestral', 'si_no', '{"valor_riesgo_maximo": "no"}', true),
(33, 112, NULL, '¿Hubo alguna materia en que tuviste especiales dificultades?', 'cuatrimestral', 'si_no', '{"valor_riesgo_maximo": "si"}', true),
(34, 113, NULL, '¿Conoces los espacios que la facultad brinda para estudiar?', 'anual', 'si_no', '{"valor_riesgo_maximo": "no"}', true),
(35, 113, NULL, '¿Sentís que la facultad te brinda los recursos necesarios para avanzar en la carrera?', 'cuatrimestral', 'escala', '{"intervalo_min": 1, "intervalo_max": 5, "extremo_riesgoso": "min"}', true),
(36, 113, NULL, '¿Conocías los recursos de apoyo disponibles (tutorías, asesorías, becas, etc...)?', 'cuatrimestral', 'opcion_multiple', NULL, true),
(37, 113, NULL, '¿Te gustaría ser contactado por alguien del equipo de la facultad a fin de conversar tu situación en profundidad?', 'cuatrimestral', 'si_no', '{"valor_riesgo_maximo": "si"}', true),

-- Meta-preguntas Académicas (El backend reemplazará {MATERIA} dinámicamente)
(38, 114, NULL, '¿Cuál fue tu nota en {MATERIA}?', 'fin_cuatrimestre_acad', 'numero', '{"intervalo_min": 1, "intervalo_max": 10, "extremo_riesgoso": "min"}', true),
(39, 114, NULL, '¿Cuál fue tu situación final en {MATERIA}?', 'fin_cuatrimestre_acad', 'opcion_multiple', NULL, true),
(40, 114, NULL, '¿Cuál fue tu nota en el final de {MATERIA}?', 'llamado_final_acad', 'numero', '{"intervalo_min": 1, "intervalo_max": 10, "extremo_riesgoso": "min"}', true),
(41, 110, NULL, '¿Cuántas horas trabajas por semana?', 'cuatrimestral', 'numero', '{"intervalo_min": 0, "intervalo_max": 80, "extremo_riesgoso": "max"}', true);

-- Actualizar secuencia de la tabla pregunta
SELECT setval(pg_get_serial_sequence('public.pregunta', 'id'), (SELECT MAX(id) FROM public.pregunta));

-- ==============================================================================
-- 4. INSERTAR OPCIONES PARA LAS PREGUNTAS MÚLTIPLES
-- (Para que no se rompa el Frontend y el AHP ya tenga sus pesos)
-- ==============================================================================
INSERT INTO public.opcion_pregunta (pregunta_id, texto_opcion, valor_riesgo_manual, orden_visual) VALUES
-- Q1 y Q2: Nivel educativo padres
(1, 'Inicial', 1.0, 1), (1, 'Secundario', 0.6, 2), (1, 'Terciario', 0.3, 3), (1, 'Universitario', 0.0, 4),
(2, 'Inicial', 1.0, 1), (2, 'Secundario', 0.6, 2), (2, 'Terciario', 0.3, 3), (2, 'Universitario', 0.0, 4),

-- Q7: Tipo de institución secundaria
(7, 'Escuela Publica', 0.5, 1), (7, 'Escuela Privada', 0.0, 2), (7, 'Escuela religiosa', 0.0, 3), (7, 'Instituto Tecnico', 0.0, 4), (7, 'Otro', 0.5, 5),

-- Q10: Situación de vivienda
(10, 'Pensión', 1.0, 1), (10, 'Vivo en casa de familiares que no son mis padres', 0.5, 2), (10, 'Casa/Departamento (Alquilado)', 0.3, 3), (10, 'Casa/Departamento (Propio)', 0.0, 4), (10, 'Otro', 0.5, 5),

-- Q12: Espacio en casa para estudiar
(12, 'No', 1.0, 1), (12, 'No siempre está disponible', 0.6, 2), (12, 'Si, pero comparto', 0.3, 3), (12, 'Si, uno propio', 0.0, 4),

-- Q13: Tiempo de traslado
(13, '> 1h', 1.0, 1), (13, '31''-1 h', 0.6, 2), (13, '15''-30''', 0.3, 3), (13, '< 15''', 0.0, 4),

-- Q20: Ganas de continuar
(20, 'Menos', 1.0, 1), (20, 'Igual', 0.5, 2), (20, 'Más', 0.0, 3),

-- Q25: Pensaste en abandonar
(25, 'Si', 1.0, 1), (25, 'Lo pensé pero lo descarte', 0.5, 2), (25, 'No', 0.0, 3),

-- Q26: Dejar de cursar próximo cuatrimestre
(26, 'Si', 1.0, 1), (26, 'No lo sé', 0.5, 2), (26, 'No', 0.0, 3),

-- Q28: Carga laboral cambio
(28, 'Empecé a trabajar este cuatrimestre', 1.0, 1), (28, 'Aumentó', 0.8, 2), (28, 'Se mantuvo igual', 0.4, 3), (28, 'Disminuyó', 0.0, 4),

-- Q30: Obstáculo económico
(30, 'Si', 1.0, 1), (30, 'Parcialmente', 0.5, 2), (30, 'No', 0.0, 3),

-- Q36: Conocimiento recursos apoyo
(36, 'No', 1.0, 1), (36, 'Los conocí este cuatrimestre', 0.5, 2), (36, 'Si', 0.0, 3),

-- Q39: Situación final materia
(39, 'Recursa', 1.0, 1), (39, 'Habilita', 0.5, 2), (39, 'Promociona', 0.0, 3);

-- migrate:down

