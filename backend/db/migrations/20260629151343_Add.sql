-- migrate:up

ALTER TABLE configuracion_indicador 
ADD COLUMN valores_saaty_crudos JSONB;

-- migrate:down

