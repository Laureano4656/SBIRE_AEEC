\restrict dbmate

-- Dumped from database version 17.10 (Debian 17.10-1.pgdg13+1)
-- Dumped by pg_dump version 18.4 (Ubuntu 18.4-1.pgdg24.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_estado_cursada; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_estado_cursada AS ENUM (
    'cursando',
    'aprobada',
    'aprobada_falta_final',
    'desaprobada'
);


--
-- Name: enum_estado_encuesta; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_estado_encuesta AS ENUM (
    'borrador',
    'activa',
    'pausada',
    'archivada'
);


--
-- Name: enum_etapa_estudiante; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_etapa_estudiante AS ENUM (
    'temprana',
    'media',
    'tardia'
);


--
-- Name: enum_periodicidad; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_periodicidad AS ENUM (
    'unica_vez',
    'cuatrimestral',
    'anual',
    'inicio_cuatrimestre_acad',
    'fin_cuatrimestre_acad',
    'llamado_final_acad'
);


--
-- Name: enum_tipo_pregunta; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_tipo_pregunta AS ENUM (
    'texto_libre',
    'opcion_multiple',
    'escala',
    'si_no',
    'numero'
);


--
-- Name: estado_alerta_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.estado_alerta_enum AS ENUM (
    'nueva',
    'en_revision',
    'intervenida',
    'resuelta',
    'falso_positivo'
);


--
-- Name: estado_entrevista_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.estado_entrevista_enum AS ENUM (
    'pendiente',
    'realizada',
    'cancelada'
);


--
-- Name: etapa_desercion_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.etapa_desercion_enum AS ENUM (
    'temprana',
    'tardia',
    'extendida'
);


--
-- Name: modalidad_entrevista_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.modalidad_entrevista_enum AS ENUM (
    'presencial',
    'virtual'
);


--
-- Name: nivel_riesgo_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.nivel_riesgo_enum AS ENUM (
    'bajo',
    'medio',
    'alto',
    'critico'
);


--
-- Name: origen_alerta_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.origen_alerta_enum AS ENUM (
    'score_riesgo',
    'omision_encuesta',
    'carrera_extendida'
);


--
-- Name: resultado_intervencion_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.resultado_intervencion_enum AS ENUM (
    'positivo',
    'neutro',
    'negativo',
    'sin_contacto'
);


--
-- Name: rol_usuario_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.rol_usuario_enum AS ENUM (
    'administrador',
    'admin_departamental',
    'docente_carga',
    'docente_tutor',
    'asesor_par',
    'estudiante'
);


--
-- Name: tipo_intervencion_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.tipo_intervencion_enum AS ENUM (
    'tutoria_academica',
    'entrevista',
    'derivacion',
    'contacto_familiar',
    'seguimiento_virtual',
    'asesoria_par',
    'otro'
);


--
-- Name: actualizar_estado_alerta_en_intervencion(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.actualizar_estado_alerta_en_intervencion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE alertas
    SET estado = 'intervenida'
    WHERE id = NEW.alerta_id
      AND estado IN ('nueva', 'en_revision');
    RETURN NEW;
END;
$$;


--
-- Name: set_actualizado_en(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_actualizado_en() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alertas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alertas (
    id integer NOT NULL,
    estudiante_id integer NOT NULL,
    score_id integer,
    asignacion_id integer,
    tipo_desercion public.etapa_desercion_enum NOT NULL,
    nivel_riesgo public.nivel_riesgo_enum NOT NULL,
    origen public.origen_alerta_enum NOT NULL,
    estado public.estado_alerta_enum DEFAULT 'nueva'::public.estado_alerta_enum NOT NULL,
    anio_cursada smallint NOT NULL,
    generada_en timestamp with time zone DEFAULT now() NOT NULL,
    fecha_cierre timestamp with time zone,
    CONSTRAINT ck_alerta_anio_cursada CHECK ((anio_cursada >= 1)),
    CONSTRAINT ck_alerta_cierre_consistente CHECK (((fecha_cierre IS NULL) OR (estado = ANY (ARRAY['resuelta'::public.estado_alerta_enum, 'falso_positivo'::public.estado_alerta_enum])))),
    CONSTRAINT ck_alerta_origen_encuesta CHECK (((origen <> 'omision_encuesta'::public.origen_alerta_enum) OR (asignacion_id IS NOT NULL))),
    CONSTRAINT ck_alerta_origen_score CHECK (((origen <> 'score_riesgo'::public.origen_alerta_enum) OR (score_id IS NOT NULL)))
);


--
-- Name: alertas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.alertas ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.alertas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: asignacion_encuesta; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.asignacion_encuesta (
    id integer NOT NULL,
    estudiante_id integer NOT NULL,
    periodo_lectivo character varying(50) NOT NULL,
    completado boolean DEFAULT false,
    fecha_asignacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    evento_id integer,
    borrador boolean DEFAULT true NOT NULL
);


--
-- Name: asignacion_encuesta_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.asignacion_encuesta ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.asignacion_encuesta_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: asistencia; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.asistencia (
    id integer NOT NULL,
    cursada_id integer,
    fecha date NOT NULL,
    presente boolean DEFAULT false,
    observacion character varying(255)
);


--
-- Name: asistencia_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.asistencia ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.asistencia_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: carreras; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carreras (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    codigo character varying(50) NOT NULL,
    duracion_cuatrimestre integer NOT NULL,
    activo boolean DEFAULT true NOT NULL
);


--
-- Name: carreras_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.carreras ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.carreras_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: configuracion_indicador; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.configuracion_indicador (
    id integer NOT NULL,
    carrera_id integer NOT NULL,
    etapa public.etapa_desercion_enum NOT NULL,
    umbral_amarillo double precision DEFAULT 0.30 NOT NULL,
    umbral_rojo double precision DEFAULT 0.60 NOT NULL,
    factor_extension double precision DEFAULT 1.5 NOT NULL,
    descripcion text,
    activo boolean DEFAULT true NOT NULL,
    actualizado_en timestamp with time zone DEFAULT now() NOT NULL,
    actualizado_por integer,
    CONSTRAINT ck_factor_extension_positivo CHECK ((factor_extension > (0.0)::double precision)),
    CONSTRAINT ck_umbrales_rango CHECK (((umbral_amarillo >= (0.0)::double precision) AND (umbral_amarillo < umbral_rojo) AND (umbral_rojo <= (1.0)::double precision)))
);


--
-- Name: configuracion_indicador_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.configuracion_indicador ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.configuracion_indicador_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: correlativas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.correlativas (
    id integer NOT NULL,
    materia_id integer,
    requiere_materia_id integer
);


--
-- Name: correlativas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.correlativas ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.correlativas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: cursadas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cursadas (
    id integer NOT NULL,
    estudiante_id integer,
    materia_id integer,
    anio integer NOT NULL,
    cuatrimestre integer NOT NULL,
    estado public.enum_estado_cursada
);


--
-- Name: cursadas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.cursadas ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.cursadas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: entrevista_planificada; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.entrevista_planificada (
    id integer NOT NULL,
    alerta_id integer NOT NULL,
    tutor_id integer NOT NULL,
    estudiante_id integer NOT NULL,
    fecha_propuesta timestamp with time zone NOT NULL,
    modalidad public.modalidad_entrevista_enum NOT NULL,
    notas_previas text,
    estado public.estado_entrevista_enum DEFAULT 'pendiente'::public.estado_entrevista_enum NOT NULL,
    intervencion_id integer,
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ck_entrevista_realizada_tiene_intervencion CHECK (((estado <> 'realizada'::public.estado_entrevista_enum) OR (intervencion_id IS NOT NULL)))
);


--
-- Name: entrevista_planificada_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.entrevista_planificada ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.entrevista_planificada_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: estudiantes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.estudiantes (
    id integer NOT NULL,
    carrera_id integer,
    nombre character varying(255) NOT NULL,
    apellido character varying(255) NOT NULL,
    email character varying(100),
    legajo character varying(10) NOT NULL,
    dni character varying(16) NOT NULL,
    anio_ingreso integer NOT NULL,
    etapa public.enum_etapa_estudiante DEFAULT 'temprana'::public.enum_etapa_estudiante,
    porcentaje_carrera double precision DEFAULT 0.0,
    activo boolean DEFAULT true NOT NULL,
    moodle_id character varying(255)
);


--
-- Name: estudiantes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.estudiantes ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.estudiantes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: evento_disparador; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evento_disparador (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    periodicidad public.enum_periodicidad DEFAULT 'unica_vez'::public.enum_periodicidad
);


--
-- Name: evento_disparador_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.evento_disparador ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.evento_disparador_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: importacion_archivo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.importacion_archivo (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    nombre_archivo character varying(255) NOT NULL,
    fecha_importacion timestamp without time zone DEFAULT now() NOT NULL,
    filas_importadas integer NOT NULL,
    filas_errores integer DEFAULT 0 NOT NULL
);


--
-- Name: importacion_archivo_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.importacion_archivo ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.importacion_archivo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: indicador; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.indicador (
    id integer NOT NULL,
    nombre character varying(150) NOT NULL,
    dimension integer,
    activo boolean DEFAULT true,
    carrera_id integer NOT NULL
);


--
-- Name: indicador_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.indicador ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.indicador_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: intentos_finales; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.intentos_finales (
    id integer NOT NULL,
    cursada_id integer,
    numero_intento integer DEFAULT 1 NOT NULL,
    nota double precision NOT NULL,
    fecha date NOT NULL,
    aprobado boolean NOT NULL
);


--
-- Name: intentos_finales_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.intentos_finales ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.intentos_finales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: intervenciones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.intervenciones (
    id integer NOT NULL,
    alerta_id integer NOT NULL,
    tutor_id integer NOT NULL,
    tipo public.tipo_intervencion_enum NOT NULL,
    resultado public.resultado_intervencion_enum NOT NULL,
    fecha date NOT NULL,
    descripcion text,
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ck_intervencion_fecha_no_futura CHECK ((fecha <= CURRENT_DATE))
);


--
-- Name: intervenciones_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.intervenciones ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.intervenciones_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: materias; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.materias (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    codigo character varying(50) NOT NULL,
    es_basica_critica boolean DEFAULT false NOT NULL,
    cuatrimestre_dictado integer DEFAULT 0 NOT NULL,
    CONSTRAINT check_cuatrimestre_dictado CHECK ((cuatrimestre_dictado = ANY (ARRAY[0, 1, 2])))
);


--
-- Name: materias_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.materias ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.materias_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: opcion_pregunta; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.opcion_pregunta (
    id integer NOT NULL,
    pregunta_id integer,
    texto_opcion character varying(255) NOT NULL,
    valor_riesgo_manual numeric(3,2),
    orden_visual integer DEFAULT 0,
    CONSTRAINT opcion_pregunta_valor_riesgo_manual_check CHECK (((valor_riesgo_manual >= (0)::numeric) AND (valor_riesgo_manual <= (1)::numeric)))
);


--
-- Name: opcion_pregunta_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.opcion_pregunta ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.opcion_pregunta_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: parciales; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.parciales (
    id integer NOT NULL,
    cursada_id integer,
    numero_parcial integer NOT NULL,
    nota double precision NOT NULL,
    recuperatorio boolean DEFAULT false NOT NULL
);


--
-- Name: parciales_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.parciales ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.parciales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: peso_indicadores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.peso_indicadores (
    id integer NOT NULL,
    id_configuracion integer NOT NULL,
    id_indicador integer NOT NULL,
    peso_global double precision DEFAULT 0.0 NOT NULL
);


--
-- Name: peso_indicadores_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.peso_indicadores ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.peso_indicadores_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: plan_estudios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.plan_estudios (
    id integer NOT NULL,
    carrera_id integer,
    nombre character varying(50),
    anio_vigencia integer,
    activo boolean
);


--
-- Name: plan_estudios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.plan_estudios ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.plan_estudios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: plan_materia; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.plan_materia (
    id integer NOT NULL,
    plan_id integer NOT NULL,
    materia_id integer NOT NULL,
    cuatrimestre_sugerido integer NOT NULL
);


--
-- Name: plan_materia_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.plan_materia ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.plan_materia_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: pregunta; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pregunta (
    id integer NOT NULL,
    indicador_id integer,
    carrera_id integer NOT NULL,
    texto_pregunta text NOT NULL,
    tipo_pregunta public.enum_tipo_pregunta NOT NULL,
    configuracion_riesgo jsonb,
    activa boolean DEFAULT true,
    evento_id integer
);


--
-- Name: pregunta_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.pregunta ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.pregunta_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: respuesta_estudiante; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.respuesta_estudiante (
    id integer NOT NULL,
    asignacion_id integer,
    pregunta_id integer,
    materia_id integer,
    opcion_seleccionada_id integer,
    valor_numerico numeric(10,2),
    valor_texto text,
    riesgo_calculado numeric(3,2),
    CONSTRAINT respuesta_estudiante_riesgo_calculado_check CHECK (((riesgo_calculado >= (0)::numeric) AND (riesgo_calculado <= (1)::numeric)))
);


--
-- Name: respuesta_estudiante_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.respuesta_estudiante ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.respuesta_estudiante_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


--
-- Name: score_riesgo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.score_riesgo (
    id integer NOT NULL,
    estudiante_id integer NOT NULL,
    score double precision NOT NULL,
    nivel public.nivel_riesgo_enum NOT NULL,
    calculado_en timestamp with time zone DEFAULT now() NOT NULL,
    score_total_id integer,
    factor_aplicado double precision DEFAULT 1.0 NOT NULL,
    score_ponderado double precision DEFAULT 0.0 NOT NULL,
    id_indicador integer,
    CONSTRAINT ck_factor_aplicado_positivo CHECK ((factor_aplicado > (0.0)::double precision)),
    CONSTRAINT ck_score_ponderado_rango CHECK (((score_ponderado >= (0.0)::double precision) AND (score_ponderado <= (1.0)::double precision))),
    CONSTRAINT ck_score_riesgo_rango CHECK (((score >= (0.0)::double precision) AND (score <= (1.0)::double precision)))
);


--
-- Name: score_riesgo_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.score_riesgo ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.score_riesgo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: score_total; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.score_total (
    id integer NOT NULL,
    estudiante_id integer NOT NULL,
    valor double precision NOT NULL,
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ck_score_total_rango CHECK (((valor >= (0.0)::double precision) AND (valor <= (1.0)::double precision)))
);


--
-- Name: score_total_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.score_total ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.score_total_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    carrera_id integer,
    nombre character varying(200) NOT NULL,
    apellido character varying(200) NOT NULL,
    email character varying(320) NOT NULL,
    moodle_id character varying(100),
    rol public.rol_usuario_enum NOT NULL,
    max_casos_activos smallint,
    activo boolean DEFAULT true NOT NULL,
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    actualizado_en timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ck_usuario_email_formato CHECK (((email)::text ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'::text)),
    CONSTRAINT ck_usuario_max_casos CHECK (((max_casos_activos IS NULL) OR (max_casos_activos > 0)))
);


--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.usuarios ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.usuarios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: alertas alertas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alertas
    ADD CONSTRAINT alertas_pkey PRIMARY KEY (id);


--
-- Name: asignacion_encuesta asignacion_encuesta_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asignacion_encuesta
    ADD CONSTRAINT asignacion_encuesta_pkey PRIMARY KEY (id);


--
-- Name: asistencia asistencia_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asistencia
    ADD CONSTRAINT asistencia_pkey PRIMARY KEY (id);


--
-- Name: carreras carreras_codigo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carreras
    ADD CONSTRAINT carreras_codigo_key UNIQUE (codigo);


--
-- Name: carreras carreras_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carreras
    ADD CONSTRAINT carreras_pkey PRIMARY KEY (id);


--
-- Name: configuracion_indicador configuracion_indicador_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuracion_indicador
    ADD CONSTRAINT configuracion_indicador_pkey PRIMARY KEY (id);


--
-- Name: correlativas correlativas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.correlativas
    ADD CONSTRAINT correlativas_pkey PRIMARY KEY (id);


--
-- Name: cursadas cursadas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cursadas
    ADD CONSTRAINT cursadas_pkey PRIMARY KEY (id);


--
-- Name: entrevista_planificada entrevista_planificada_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrevista_planificada
    ADD CONSTRAINT entrevista_planificada_pkey PRIMARY KEY (id);


--
-- Name: estudiantes estudiantes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_pkey PRIMARY KEY (id);


--
-- Name: evento_disparador evento_disparador_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evento_disparador
    ADD CONSTRAINT evento_disparador_nombre_key UNIQUE (nombre);


--
-- Name: evento_disparador evento_disparador_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evento_disparador
    ADD CONSTRAINT evento_disparador_pkey PRIMARY KEY (id);


--
-- Name: importacion_archivo importacion_archivo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.importacion_archivo
    ADD CONSTRAINT importacion_archivo_pkey PRIMARY KEY (id);


--
-- Name: indicador indicador_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.indicador
    ADD CONSTRAINT indicador_pkey PRIMARY KEY (id);


--
-- Name: intentos_finales intentos_finales_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intentos_finales
    ADD CONSTRAINT intentos_finales_pkey PRIMARY KEY (id);


--
-- Name: intervenciones intervenciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intervenciones
    ADD CONSTRAINT intervenciones_pkey PRIMARY KEY (id);


--
-- Name: materias materias_codigo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materias
    ADD CONSTRAINT materias_codigo_key UNIQUE (codigo);


--
-- Name: materias materias_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materias
    ADD CONSTRAINT materias_pkey PRIMARY KEY (id);


--
-- Name: opcion_pregunta opcion_pregunta_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.opcion_pregunta
    ADD CONSTRAINT opcion_pregunta_pkey PRIMARY KEY (id);


--
-- Name: parciales parciales_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parciales
    ADD CONSTRAINT parciales_pkey PRIMARY KEY (id);


--
-- Name: peso_indicadores peso_indicadores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.peso_indicadores
    ADD CONSTRAINT peso_indicadores_pkey PRIMARY KEY (id);


--
-- Name: plan_estudios plan_estudios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plan_estudios
    ADD CONSTRAINT plan_estudios_pkey PRIMARY KEY (id);


--
-- Name: plan_materia plan_materia_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plan_materia
    ADD CONSTRAINT plan_materia_pkey PRIMARY KEY (id);


--
-- Name: plan_materia plan_materia_plan_id_materia_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plan_materia
    ADD CONSTRAINT plan_materia_plan_id_materia_id_key UNIQUE (plan_id, materia_id);


--
-- Name: pregunta pregunta_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pregunta
    ADD CONSTRAINT pregunta_pkey PRIMARY KEY (id);


--
-- Name: respuesta_estudiante respuesta_estudiante_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.respuesta_estudiante
    ADD CONSTRAINT respuesta_estudiante_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: score_riesgo score_riesgo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.score_riesgo
    ADD CONSTRAINT score_riesgo_pkey PRIMARY KEY (id);


--
-- Name: score_total score_total_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.score_total
    ADD CONSTRAINT score_total_pkey PRIMARY KEY (id);


--
-- Name: configuracion_indicador uq_configuracion_carrera_etapa; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuracion_indicador
    ADD CONSTRAINT uq_configuracion_carrera_etapa UNIQUE (carrera_id, etapa);


--
-- Name: parciales uq_cursada_numero_parcial; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parciales
    ADD CONSTRAINT uq_cursada_numero_parcial UNIQUE (cursada_id, numero_parcial);


--
-- Name: usuarios uq_usuario_email; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT uq_usuario_email UNIQUE (email);


--
-- Name: usuarios uq_usuario_moodle_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT uq_usuario_moodle_id UNIQUE (moodle_id);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: idx_alerta_anio_tipo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_alerta_anio_tipo ON public.alertas USING btree (anio_cursada, tipo_desercion, estado);


--
-- Name: idx_alerta_estudiante_estado; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_alerta_estudiante_estado ON public.alertas USING btree (estudiante_id, estado);


--
-- Name: idx_alerta_nivel_estado; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_alerta_nivel_estado ON public.alertas USING btree (nivel_riesgo, estado) WHERE (estado = ANY (ARRAY['nueva'::public.estado_alerta_enum, 'en_revision'::public.estado_alerta_enum]));


--
-- Name: idx_config_indicador_carrera_etapa; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_config_indicador_carrera_etapa ON public.configuracion_indicador USING btree (carrera_id, etapa) WHERE (activo = true);


--
-- Name: idx_entrevista_tutor_pendiente; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_entrevista_tutor_pendiente ON public.entrevista_planificada USING btree (tutor_id, fecha_propuesta) WHERE (estado = 'pendiente'::public.estado_entrevista_enum);


--
-- Name: idx_intervencion_alerta; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_intervencion_alerta ON public.intervenciones USING btree (alerta_id, fecha DESC);


--
-- Name: idx_intervencion_tutor_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_intervencion_tutor_fecha ON public.intervenciones USING btree (tutor_id, fecha DESC);


--
-- Name: idx_score_riesgo_estudiante_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_score_riesgo_estudiante_fecha ON public.score_riesgo USING btree (estudiante_id, calculado_en DESC);


--
-- Name: idx_score_riesgo_nivel; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_score_riesgo_nivel ON public.score_riesgo USING btree (nivel, calculado_en DESC);


--
-- Name: idx_score_riesgo_sin_total; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_score_riesgo_sin_total ON public.score_riesgo USING btree (estudiante_id) WHERE (score_total_id IS NULL);


--
-- Name: idx_score_total_estudiante_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_score_total_estudiante_fecha ON public.score_total USING btree (estudiante_id, creado_en DESC);


--
-- Name: idx_usuario_moodle_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usuario_moodle_id ON public.usuarios USING btree (moodle_id);


--
-- Name: idx_usuario_rol_carrera; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usuario_rol_carrera ON public.usuarios USING btree (rol, carrera_id) WHERE (activo = true);


--
-- Name: intervenciones trg_intervencion_actualiza_alerta; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_intervencion_actualiza_alerta AFTER INSERT ON public.intervenciones FOR EACH ROW EXECUTE FUNCTION public.actualizar_estado_alerta_en_intervencion();


--
-- Name: usuarios trg_usuario_actualizado_en; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_usuario_actualizado_en BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.set_actualizado_en();


--
-- Name: asignacion_encuesta asignacion_encuesta_estudiante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asignacion_encuesta
    ADD CONSTRAINT asignacion_encuesta_estudiante_id_fkey FOREIGN KEY (estudiante_id) REFERENCES public.estudiantes(id);


--
-- Name: asistencia asistencia_cursada_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asistencia
    ADD CONSTRAINT asistencia_cursada_id_fkey FOREIGN KEY (cursada_id) REFERENCES public.cursadas(id);


--
-- Name: correlativas correlativas_materia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.correlativas
    ADD CONSTRAINT correlativas_materia_id_fkey FOREIGN KEY (materia_id) REFERENCES public.materias(id);


--
-- Name: correlativas correlativas_requiere_materia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.correlativas
    ADD CONSTRAINT correlativas_requiere_materia_id_fkey FOREIGN KEY (requiere_materia_id) REFERENCES public.materias(id);


--
-- Name: cursadas cursadas_estudiante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cursadas
    ADD CONSTRAINT cursadas_estudiante_id_fkey FOREIGN KEY (estudiante_id) REFERENCES public.estudiantes(id);


--
-- Name: cursadas cursadas_materia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cursadas
    ADD CONSTRAINT cursadas_materia_id_fkey FOREIGN KEY (materia_id) REFERENCES public.materias(id);


--
-- Name: estudiantes estudiantes_carrera_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_carrera_id_fkey FOREIGN KEY (carrera_id) REFERENCES public.carreras(id);


--
-- Name: alertas fk_alerta_asignacion; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alertas
    ADD CONSTRAINT fk_alerta_asignacion FOREIGN KEY (asignacion_id) REFERENCES public.asignacion_encuesta(id);


--
-- Name: alertas fk_alerta_estudiante; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alertas
    ADD CONSTRAINT fk_alerta_estudiante FOREIGN KEY (estudiante_id) REFERENCES public.estudiantes(id) ON DELETE RESTRICT;


--
-- Name: alertas fk_alerta_score; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alertas
    ADD CONSTRAINT fk_alerta_score FOREIGN KEY (score_id) REFERENCES public.score_riesgo(id) ON DELETE SET NULL;


--
-- Name: asignacion_encuesta fk_asignacion_evento; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asignacion_encuesta
    ADD CONSTRAINT fk_asignacion_evento FOREIGN KEY (evento_id) REFERENCES public.evento_disparador(id);


--
-- Name: peso_indicadores fk_configuracion; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.peso_indicadores
    ADD CONSTRAINT fk_configuracion FOREIGN KEY (id_configuracion) REFERENCES public.configuracion_indicador(id);


--
-- Name: configuracion_indicador fk_configuracion_actualizado_por; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuracion_indicador
    ADD CONSTRAINT fk_configuracion_actualizado_por FOREIGN KEY (actualizado_por) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- Name: configuracion_indicador fk_configuracion_carrera; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuracion_indicador
    ADD CONSTRAINT fk_configuracion_carrera FOREIGN KEY (carrera_id) REFERENCES public.carreras(id) ON DELETE RESTRICT;


--
-- Name: indicador fk_dimension; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.indicador
    ADD CONSTRAINT fk_dimension FOREIGN KEY (dimension) REFERENCES public.indicador(id);


--
-- Name: entrevista_planificada fk_entrevista_alerta; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrevista_planificada
    ADD CONSTRAINT fk_entrevista_alerta FOREIGN KEY (alerta_id) REFERENCES public.alertas(id) ON DELETE CASCADE;


--
-- Name: entrevista_planificada fk_entrevista_estudiante; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrevista_planificada
    ADD CONSTRAINT fk_entrevista_estudiante FOREIGN KEY (estudiante_id) REFERENCES public.estudiantes(id) ON DELETE RESTRICT;


--
-- Name: entrevista_planificada fk_entrevista_intervencion; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrevista_planificada
    ADD CONSTRAINT fk_entrevista_intervencion FOREIGN KEY (intervencion_id) REFERENCES public.intervenciones(id) ON DELETE SET NULL;


--
-- Name: entrevista_planificada fk_entrevista_tutor; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrevista_planificada
    ADD CONSTRAINT fk_entrevista_tutor FOREIGN KEY (tutor_id) REFERENCES public.usuarios(id) ON DELETE RESTRICT;


--
-- Name: score_riesgo fk_indicador; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.score_riesgo
    ADD CONSTRAINT fk_indicador FOREIGN KEY (id_indicador) REFERENCES public.indicador(id);


--
-- Name: indicador fk_indicador_carrera; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.indicador
    ADD CONSTRAINT fk_indicador_carrera FOREIGN KEY (carrera_id) REFERENCES public.carreras(id) ON DELETE CASCADE;


--
-- Name: intervenciones fk_intervencion_alerta; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intervenciones
    ADD CONSTRAINT fk_intervencion_alerta FOREIGN KEY (alerta_id) REFERENCES public.alertas(id) ON DELETE RESTRICT;


--
-- Name: intervenciones fk_intervencion_tutor; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intervenciones
    ADD CONSTRAINT fk_intervencion_tutor FOREIGN KEY (tutor_id) REFERENCES public.usuarios(id) ON DELETE RESTRICT;


--
-- Name: pregunta fk_pregunta_evento; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pregunta
    ADD CONSTRAINT fk_pregunta_evento FOREIGN KEY (evento_id) REFERENCES public.evento_disparador(id);


--
-- Name: score_riesgo fk_score_riesgo_estudiante; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.score_riesgo
    ADD CONSTRAINT fk_score_riesgo_estudiante FOREIGN KEY (estudiante_id) REFERENCES public.estudiantes(id) ON DELETE RESTRICT;


--
-- Name: score_riesgo fk_score_riesgo_score_total; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.score_riesgo
    ADD CONSTRAINT fk_score_riesgo_score_total FOREIGN KEY (score_total_id) REFERENCES public.score_total(id) ON DELETE SET NULL;


--
-- Name: score_total fk_score_total_estudiante; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.score_total
    ADD CONSTRAINT fk_score_total_estudiante FOREIGN KEY (estudiante_id) REFERENCES public.estudiantes(id) ON DELETE RESTRICT;


--
-- Name: importacion_archivo fk_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.importacion_archivo
    ADD CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: usuarios fk_usuario_carrera; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT fk_usuario_carrera FOREIGN KEY (carrera_id) REFERENCES public.carreras(id) ON DELETE SET NULL;


--
-- Name: peso_indicadores id_indicador; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.peso_indicadores
    ADD CONSTRAINT id_indicador FOREIGN KEY (id_indicador) REFERENCES public.indicador(id);


--
-- Name: intentos_finales intentos_finales_cursada_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intentos_finales
    ADD CONSTRAINT intentos_finales_cursada_id_fkey FOREIGN KEY (cursada_id) REFERENCES public.cursadas(id);


--
-- Name: opcion_pregunta opcion_pregunta_pregunta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.opcion_pregunta
    ADD CONSTRAINT opcion_pregunta_pregunta_id_fkey FOREIGN KEY (pregunta_id) REFERENCES public.pregunta(id);


--
-- Name: parciales parciales_cursada_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parciales
    ADD CONSTRAINT parciales_cursada_id_fkey FOREIGN KEY (cursada_id) REFERENCES public.cursadas(id);


--
-- Name: plan_estudios plan_estudios_carrera_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plan_estudios
    ADD CONSTRAINT plan_estudios_carrera_id_fkey FOREIGN KEY (carrera_id) REFERENCES public.carreras(id);


--
-- Name: plan_materia plan_materia_materia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plan_materia
    ADD CONSTRAINT plan_materia_materia_id_fkey FOREIGN KEY (materia_id) REFERENCES public.materias(id) ON DELETE CASCADE;


--
-- Name: plan_materia plan_materia_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plan_materia
    ADD CONSTRAINT plan_materia_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.plan_estudios(id) ON DELETE CASCADE;


--
-- Name: pregunta pregunta_carrera_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pregunta
    ADD CONSTRAINT pregunta_carrera_id_fkey FOREIGN KEY (carrera_id) REFERENCES public.carreras(id);


--
-- Name: pregunta pregunta_indicador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pregunta
    ADD CONSTRAINT pregunta_indicador_id_fkey FOREIGN KEY (indicador_id) REFERENCES public.indicador(id);


--
-- Name: respuesta_estudiante respuesta_estudiante_asignacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.respuesta_estudiante
    ADD CONSTRAINT respuesta_estudiante_asignacion_id_fkey FOREIGN KEY (asignacion_id) REFERENCES public.asignacion_encuesta(id);


--
-- Name: respuesta_estudiante respuesta_estudiante_materia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.respuesta_estudiante
    ADD CONSTRAINT respuesta_estudiante_materia_id_fkey FOREIGN KEY (materia_id) REFERENCES public.materias(id);


--
-- Name: respuesta_estudiante respuesta_estudiante_opcion_seleccionada_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.respuesta_estudiante
    ADD CONSTRAINT respuesta_estudiante_opcion_seleccionada_id_fkey FOREIGN KEY (opcion_seleccionada_id) REFERENCES public.opcion_pregunta(id);


--
-- Name: respuesta_estudiante respuesta_estudiante_pregunta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.respuesta_estudiante
    ADD CONSTRAINT respuesta_estudiante_pregunta_id_fkey FOREIGN KEY (pregunta_id) REFERENCES public.pregunta(id);


--
-- PostgreSQL database dump complete
--

\unrestrict dbmate


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20260519130911'),
    ('20260519215955'),
    ('20260519220838'),
    ('20260519224902'),
    ('20260520010848'),
    ('20260520011725'),
    ('20260520013912'),
    ('20260520222501'),
    ('20260613231008'),
    ('20260614074112'),
    ('20260614083525'),
    ('20260615205151'),
    ('20260615205417'),
    ('20260615205758'),
    ('20260620154126'),
    ('20260620161556'),
    ('20260620171940'),
    ('20260620191526'),
    ('20260621153402'),
    ('20260621220622'),
    ('20260622194648'),
    ('20260623212022'),
    ('20260624163638'),
    ('20260624221247'),
    ('20260624230347'),
    ('20260625000000'),
    ('20260625013510'),
    ('20260625182109'),
    ('20260626114649'),
    ('20260626115623'),
    ('20260626125225'),
    ('20260626225339'),
    ('20260627000001'),
    ('20260627154515'),
    ('20260627195954'),
    ('20260627224347'),
    ('20260627225635');
