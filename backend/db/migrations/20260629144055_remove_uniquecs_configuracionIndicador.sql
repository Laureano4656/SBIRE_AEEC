-- migrate:up
-- ALTER TABLE ONLY public.configuracion_indicador
--     ADD CONSTRAINT uq_configuracion_carrera_etapa UNIQUE (carrera_id, etapa);
ALTER TABLE ONLY public.configuracion_indicador
    DROP CONSTRAINT uq_configuracion_carrera_etapa;
-- migrate:down

