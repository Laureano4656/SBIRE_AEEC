-- migrate:up
CREATE TABLE public.plan_estudios (
	id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
	carrera_id int references carreras(id),
	nombre varchar(50),
	anio_vigencia int,
	activo boolean
);

-- migrate:down

DROP TABLE public.plan_estudios;
