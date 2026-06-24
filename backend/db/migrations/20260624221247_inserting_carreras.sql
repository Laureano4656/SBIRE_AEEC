-- migrate:up
UPDATE carreras SET codigo = '11' where id = 1;
update carreras set codigo = '12' where id = 2;
INSERT INTO carreras (nombre,codigo,duracion_cuatrimestre,activo)
VALUES
('Ingenieria Quimica', '4', 4, true),
('Ingenieria Electronica', '5', 4, true),
('Ingenieria en Alimentos', '9', 4, true),
('Ingenieria en Computacion','13', 4, true),
('Ingenieria en Materiales', '6', 4, true),
('Ingenieria Electrica','1', 4, true),
('Ingenieria Mecanica', '3', 4, true),
('Ingenieria Electromecanica', '8', 4, true);
-- migrate:down

