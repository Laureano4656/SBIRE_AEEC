-- migrate:up

CREATE TABLE plan_materia (
    id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    plan_id int NOT NULL REFERENCES plan_estudios(id) ON DELETE CASCADE,
    materia_id int NOT NULL REFERENCES materias(id) ON DELETE CASCADE,
    cuatrimestre_sugerido int NOT NULL,
    UNIQUE (plan_id, materia_id)
);

INSERT INTO plan_materia (plan_id, materia_id, cuatrimestre_sugerido)
SELECT plan_id, id, cuatrimestre_sugerido FROM materias;

ALTER TABLE materias DROP COLUMN plan_id;
ALTER TABLE materias DROP COLUMN cuatrimestre_sugerido;
ALTER TABLE materias ADD UNIQUE (codigo);

-- migrate:down

ALTER TABLE materias DROP CONSTRAINT IF EXISTS materias_codigo_key;
ALTER TABLE materias ADD COLUMN plan_id int REFERENCES plan_estudios(id);
ALTER TABLE materias ADD COLUMN cuatrimestre_sugerido int;

UPDATE materias m
SET plan_id = sub.plan_id, cuatrimestre_sugerido = sub.cuatrimestre_sugerido
FROM (
    SELECT DISTINCT ON (materia_id) materia_id, plan_id, cuatrimestre_sugerido
    FROM plan_materia
) sub
WHERE m.id = sub.materia_id;

ALTER TABLE materias ALTER COLUMN plan_id SET NOT NULL;
ALTER TABLE materias ALTER COLUMN cuatrimestre_sugerido SET NOT NULL;

DROP TABLE plan_materia;
