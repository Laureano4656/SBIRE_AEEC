-- migrate:up

create table parciales(
 id int primary key generated always as identity not null,
 cursada_id int references cursadas(id),
 numero_parcial int not null,
 nota float not null,
 recuperatorio boolean default false not null
);

create table intentos_finales(
 id int primary key generated always as identity not null,
 cursada_id int references cursadas(id),
 numero_intento int default 1 not null,
 nota float not null,
 fecha date not null,
 aprobado boolean not null
);

create table asistencia(
  id int primary key generated always as identity not null,
  cursada_id int references cursadas(id),
  fecha date not null,
  presente boolean default false,
  observacion varchar(255)
);

-- migrate:down

DROP TABLE parciales;
DROP TABLE intentos_finales;
DROP TABLE asistencia;