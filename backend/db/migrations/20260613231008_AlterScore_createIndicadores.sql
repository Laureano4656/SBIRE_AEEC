-- migrate:up
/*Tabla: Indicador (Solo podría modificarla el administrador general)
id_indicador (PK)
nombre
dimension
activo

Tabla: Configuracion_Indicadores (Solo podrían modificarla los administradores departamentales)
id_configuracion (PK)
fecha_creacion
id_admin_departamental (FK) o id_departamento (FK)
estado
umbral_verde_amarillo
umbral_amarillo_rojo

Tabla: Peso_Indicadores
id_detalle (PK)
id_configuracion (FK)
id_indicador (FK)
peso_global

Tabla: Valor_Indicador_Estudiante
id_valor (PK)
id_estudiante (FK)
id_indicador (FK)
fecha_medicion
valor_crudo
valor_normalizado

Tabla: Historial_Riesgo_Semaforo
id_historial (PK)
id_estudiante (FK)
id_configuracion (FK)
indice_riesgo_total
fecha_calculo
*/
create table indicador (
    id int primary key generated always as identity NOT NULL ,
	nombre varchar(150) not null,
	dimension int, -- fk a esta tabla, si es null es un criterio si es distinto de null es un subcriterio
	activo bool default true,
	
	constraint fk_dimension
	 foreign key (dimension) references indicador(id)
);
create table peso_indicadores (
	id int primary key generated always as identity NOT NULL ,
	id_configuracion int not null,
	id_indicador int not null,
	peso_global float not null default 0.0,
	
	constraint fk_configuracion
	 foreign key (id_configuracion) references configuracion_indicador(id),
	
	constraint id_indicador
	 foreign key (id_indicador) references indicador(id)
);
alter table score_riesgo
 drop constraint fk_score_riesgo_configuracion,
 drop configuracion_id,
 add column id_indicador int,
 add constraint fk_indicador
  foreign key (id_indicador) references indicador(id);


-- migrate:down

