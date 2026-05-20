-- migrate:up
create table correlativas(
 id int primary key generated always as identity not null,
 materia_id int references materias(id),
 requiere_materia_id int references materias(id)
)

-- migrate:down

DROP TABLE correlativas;