-- migrate:up
CREATE TABLE carreras (
    id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre varchar(255) NOT NULL,
    codigo varchar(50) NOT NULL UNIQUE,
    duracion_cuatrimestre int NOT NULL,
    activo boolean NOT NULL DEFAULT true
);


-- migrate:down

DROP TABLE carreras;