-- migrate:up

DELETE FROM materias WHERE codigo IN ('1912', '1913', '1914', '1915', '1916');

-- migrate:down

