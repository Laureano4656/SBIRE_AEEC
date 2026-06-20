-- migrate:up

CREATE TABLE IF NOT EXISTS importacion_archivo(
    id int primary key generated always as identity,
    usuario_id int not null,
    nombre_archivo varchar(255) not null,
    fecha_importacion timestamp not null default now(),
    filas_importadas int not null,
    filas_errores int not null default 0,

    CONSTRAINT fk_usuario
        FOREIGN KEY(usuario_id) 
        REFERENCES usuarios(id)
        ON DELETE CASCADE
)

-- migrate:down

