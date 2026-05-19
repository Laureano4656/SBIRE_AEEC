-- migrate:up

create table public.materias(
 id int primary key generated always as identity not null,
 plan_id int references plan_estudios(id) not null,
 nombre varchar(255) not null,
 codigo varchar(50) not null,
 cuatrimestre_sugerido int not null,
 es_basica_critica boolean default false not null
);

-- migrate:down

DROP TABLE public.materias;