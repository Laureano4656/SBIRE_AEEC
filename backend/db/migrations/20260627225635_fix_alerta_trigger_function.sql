-- migrate:up
CREATE OR REPLACE FUNCTION actualizar_estado_alerta_en_intervencion()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE alertas
    SET estado = 'intervenida'
    WHERE id = NEW.alerta_id
      AND estado IN ('nueva', 'en_revision');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- migrate:down
CREATE OR REPLACE FUNCTION actualizar_estado_alerta_en_intervencion()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE alerta
    SET estado = 'intervenida'
    WHERE id = NEW.alerta_id
      AND estado IN ('nueva', 'en_revision');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

