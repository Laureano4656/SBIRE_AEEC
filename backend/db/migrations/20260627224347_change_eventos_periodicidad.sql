-- migrate:up

UPDATE evento_disparador SET periodicidad = 'cuatrimestral', nombre = 'Encuesta cuatrimestral' WHERE id =2;

UPDATE evento_disparador SET periodicidad = 'anual' WHERE id =3;

UPDATE evento_disparador SET periodicidad = 'inicio_cuatrimestre_acad' where id = 4;

UPDATE evento_disparador SET periodicidad = 'fin_cuatrimestre_acad' where id = 5;

UPDATE evento_disparador SET periodicidad = 'llamado_final_acad' where id = 6;
-- migrate:down

