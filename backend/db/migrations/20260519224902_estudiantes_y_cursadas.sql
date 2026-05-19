-- migrate:up
create type enum_etapa_estudiante as enum ('temprana','media','tardia');
create type enum_estado_cursada as enum('cursando','aprobada','desaprobada','libre','abandono');

create table estudiantes(
 id int primary key generated always as identity not null,
 carrera_id int references carreras(id),
 nombre varchar(255) not null,
 apellido varchar(255) not null,
 email varchar(100),
 legajo varchar(10) not null,
 dni varchar(16) not null,
 anio_ingreso int not null,
 etapa enum_etapa_estudiante default 'temprana',
 porcentaje_carrera float default 0.0,
 activo boolean not null,
 moodle_id varchar(255)
);

create table inscripciones_cuatrimestres(
 id int primary key generated always as identity not null,
 estudiante_id int references estudiantes(id),
 anio int not null,
 cuatrimestre int not null,
 materilas_anotadas int not null,
 activo boolean default true
);

create table cursadas(
 id int primary key generated always as identity not null,
 estudiante_id int references estudiantes(id),
 materia_id int references materias(id),
 inscripcion_id int references inscripciones_cuatrimestres(id),
 anio int not null,
 cuatrimestre int not null,
 estado enum_estado_cursada default 'cursando'
);

-- migrate:down

