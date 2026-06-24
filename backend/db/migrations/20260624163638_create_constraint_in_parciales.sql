-- migrate:up

-- Agregamos la restricción de unicidad para la combinación cursada_id y numero_parcial
ALTER TABLE parciales 
ADD CONSTRAINT uq_cursada_numero_parcial UNIQUE (cursada_id, numero_parcial);


-- migrate:down

-- Eliminamos la restricción en caso de hacer un rollback
ALTER TABLE parciales 
DROP CONSTRAINT IF EXISTS uq_cursada_numero_parcial;