-- migrate:up

update evento_disparador set nombre = 'Encuesta de unica vez' where id = 1;

update evento_disparador set nombre = 'Encuesta cuatriemestral' where id = 2;

update evento_disparador set nombre = 'Encuesta anual' where id = 3;

update evento_disparador set nombre = 'Encuesta inicio de cuatrimestre' where id = 4;

update evento_disparador set nombre = 'Encuesta fin de cuatrimestre' where id = 5;

update evento_disparador set nombre = 'Encuesta llamados a final' where id = 6;

-- migrate:down

