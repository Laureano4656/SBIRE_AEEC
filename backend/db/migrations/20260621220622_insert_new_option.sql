-- migrate:up

-- 1. Cambiamos el tipo de pregunta y vaciamos la configuración de riesgo (ahora el riesgo lo dictan las opciones)
UPDATE public.pregunta 
SET tipo_pregunta = 'opcion_multiple'::public.enum_tipo_pregunta,
    configuracion_riesgo = NULL
WHERE texto_pregunta = '¿Aprobaste el final de {MATERIA}?';

-- 2. Insertamos la tercera opción buscándola dinámicamente por el texto de la pregunta
INSERT INTO public.opcion_pregunta (pregunta_id, texto_opcion, valor_riesgo_manual, orden_visual)
SELECT id, 'No me presenté', 0.0, 3 
FROM public.pregunta 
WHERE texto_pregunta = '¿Aprobaste el final de {MATERIA}?';


-- migrate:down

-- 1. Eliminamos específicamente la tercera opción
DELETE FROM public.opcion_pregunta 
WHERE texto_opcion = 'No me presenté' 
  AND pregunta_id = (SELECT id FROM public.pregunta WHERE texto_pregunta = '¿Aprobaste el final de {MATERIA}?');

-- 2. Revertimos el tipo de pregunta y restauramos su JSON de riesgo original
UPDATE public.pregunta 
SET tipo_pregunta = 'si_no'::public.enum_tipo_pregunta,
    configuracion_riesgo = '{"valor_riesgo_maximo": "no"}'::jsonb
WHERE texto_pregunta = '¿Aprobaste el final de {MATERIA}?';