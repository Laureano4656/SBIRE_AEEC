-- migrate:up

alter table respuesta
 drop column texto_libre,
 add column valor varchar(255),
 add column confianza float,
 add column motivo varchar(100);

alter table preguntas
 add column min float,
 add column max float,
 add column cant_opciones int;
 add column id_indicador int,
 add constraint fk_indicador
  foreign key (id_indicador) references indicador(id);

-- migrate:down

