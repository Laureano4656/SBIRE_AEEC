-- migrate:up

-- 1. Agregamos la columna carrera_id a la tabla de indicadores
ALTER TABLE indicador ADD COLUMN carrera_id INT;

-- 2. Bloque seguro para duplicar toda la estructura para las carreras 1 a 10
DO $$
DECLARE
    c_id INT;
    r_dim RECORD;
    r_ind RECORD;
    r_preg RECORD;
    r_opc RECORD;
    new_dim_id INT;
    new_ind_id INT;
    new_preg_id INT;
BEGIN
    -- Iteramos para las carreras 1 a 10
    FOR c_id IN 1..10 LOOP
        
        -- A. Clonamos las Dimensiones Padre
        FOR r_dim IN SELECT * FROM indicador WHERE carrera_id IS NULL AND dimension IS NULL LOOP
            INSERT INTO indicador (nombre, dimension, activo, carrera_id)
            VALUES (r_dim.nombre, NULL, r_dim.activo, c_id)
            RETURNING id INTO new_dim_id;
            
            -- B. Clonamos los Indicadores Hijo
            FOR r_ind IN SELECT * FROM indicador WHERE carrera_id IS NULL AND dimension = r_dim.id LOOP
                INSERT INTO indicador (nombre, dimension, activo, carrera_id)
                VALUES (r_ind.nombre, new_dim_id, r_ind.activo, c_id)
                RETURNING id INTO new_ind_id;
                
                -- C. Clonamos las Preguntas asociadas
                FOR r_preg IN SELECT * FROM pregunta WHERE carrera_id IS NULL AND indicador_id = r_ind.id LOOP
                    INSERT INTO pregunta (indicador_id, carrera_id, texto_pregunta, evento_id, tipo_pregunta, configuracion_riesgo, activa)
                    VALUES (new_ind_id, c_id, r_preg.texto_pregunta, r_preg.evento_id, r_preg.tipo_pregunta, r_preg.configuracion_riesgo, r_preg.activa)
                    RETURNING id INTO new_preg_id;
                    
                    -- D. NUEVO: Clonamos las Opciones de esta pregunta
                    FOR r_opc IN SELECT * FROM opcion_pregunta WHERE pregunta_id = r_preg.id LOOP
                        INSERT INTO opcion_pregunta (pregunta_id, texto_opcion, valor_riesgo_manual, orden_visual) 
                        VALUES (new_preg_id, r_opc.texto_opcion, r_opc.valor_riesgo_manual, r_opc.orden_visual);
                    END LOOP;
                    
                END LOOP;
            END LOOP;
            
            -- Por si tenés preguntas colgadas directamente de la Dimensión Padre
            FOR r_preg IN SELECT * FROM pregunta WHERE carrera_id IS NULL AND indicador_id = r_dim.id LOOP
                INSERT INTO pregunta (indicador_id, carrera_id, texto_pregunta, evento_id, tipo_pregunta, configuracion_riesgo, activa)
                VALUES (new_dim_id, c_id, r_preg.texto_pregunta, r_preg.evento_id, r_preg.tipo_pregunta, r_preg.configuracion_riesgo, r_preg.activa)
                RETURNING id INTO new_preg_id;
                
                -- Clonamos también las opciones para estas preguntas huérfanas
                FOR r_opc IN SELECT * FROM opcion_pregunta WHERE pregunta_id = r_preg.id LOOP
                    INSERT INTO opcion_pregunta (pregunta_id, texto_opcion, valor_riesgo_manual, orden_visual) 
                    VALUES (new_preg_id, r_opc.texto_opcion, r_opc.valor_riesgo_manual, r_opc.orden_visual);
                END LOOP;
                
            END LOOP;

        END LOOP;
    END LOOP;
END $$;

-- 3. Limpieza de los registros globales originales (El borrado en cascada debería llevarse las viejas opciones)
-- Por las dudas, borramos explícitamente las opciones viejas primero si no tenés ON DELETE CASCADE
DELETE FROM opcion_pregunta WHERE pregunta_id IN (SELECT id FROM pregunta WHERE carrera_id IS NULL);
DELETE FROM pregunta WHERE carrera_id IS NULL;
DELETE FROM indicador WHERE carrera_id IS NULL;

-- 4. Aplicamos la restricción NOT NULL
ALTER TABLE indicador ALTER COLUMN carrera_id SET NOT NULL;
ALTER TABLE pregunta ALTER COLUMN carrera_id SET NOT NULL;

-- 5. Claves foráneas (Asegurate que tu tabla de carreras se llame 'carreras')
ALTER TABLE indicador ADD CONSTRAINT fk_indicador_carrera FOREIGN KEY (carrera_id) REFERENCES carreras(id) ON DELETE CASCADE;


-- migrate:down

ALTER TABLE indicador DROP CONSTRAINT IF EXISTS fk_indicador_carrera;
ALTER TABLE indicador ALTER COLUMN carrera_id DROP NOT NULL;
ALTER TABLE pregunta ALTER COLUMN carrera_id DROP NOT NULL;