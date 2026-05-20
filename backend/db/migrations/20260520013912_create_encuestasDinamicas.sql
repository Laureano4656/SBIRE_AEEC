-- migrate:up

create type enum_estado_encuesta as enum ('borrador','activa','pausada','archivada');
create type enum_tipo_pregunta as enum ('texto_libre','opcion_multiple','escala','si_no','numero');
create type enum_modalidad_encuesta as enum ('unica_ingreso','periodica','aleatoria');

create table encuestas(
 id int primary key generated always as identity not null,
 titulo varchar(100) not null,
 estado enum_estado_encuesta default 'borrador',
 modalidad enum_modalidad_encuesta default 'aleatoria',
 fecha_desde date not null,
 fecha_hasta date not null,
 periodica boolean default false not null,
 frecuencia_dias int
);

create table preguntas(
 id int primary key generated always as identity not null,
 encuesta_id int references encuestas(id),
 texto text,
 tipo enum_tipo_pregunta default 'texto_libre',
 orden int,
 obligatoria boolean default true,
 condicion_pregunta_id int references preguntas(id)
);

create table opcion_respuesta(
 id int primary key generated always as identity not null,
 pregunta_id int references preguntas(id),
 texto text,
 orden int
);

create table asignacion_encuestas(
 id int primary key generated always as identity not null,
 encuesta_id int references encuestas(id),
 estudiante_id int references estudiantes(id),
 fecha_asignacion TIMESTAMPTZ not null,
 completada boolean default false,
 fecha_completada TIMESTAMPTZ default null
);

create table respuesta(
 id int primary key generated always as identity not null,
 asignacion_id int references asignacion_encuestas(id),
 pregunta_id int references preguntas(id),
 opcion_id int references opcion_respuesta(id),
 texto_libre text,
 valencia int,
 fecha_respuesta TIMESTAMPTZ
);
-- migrate:down

DROP TABLE respuesta;
DROP TABLE asignacion_encuestas;
DROP TABLE opcion_respuesta;
DROP TABLE preguntas;
DROP TABLE encuestas;