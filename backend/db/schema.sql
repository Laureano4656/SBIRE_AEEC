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
    'desaprobada',
    'libre',
    'abandono'
);


--
-- Name: enum_etapa_estudiante; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_etapa_estudiante AS ENUM (
    'temprana',
    'media',
    'tardia'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

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
    inscripcion_id integer,
    anio integer NOT NULL,
    cuatrimestre integer NOT NULL,
    estado public.enum_estado_cursada DEFAULT 'cursando'::public.enum_estado_cursada
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
    activo boolean NOT NULL,
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
-- Name: inscripciones_cuatrimestres; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inscripciones_cuatrimestres (
    id integer NOT NULL,
    estudiante_id integer,
    anio integer NOT NULL,
    cuatrimestre integer NOT NULL,
    materilas_anotadas integer NOT NULL,
    activo boolean DEFAULT true
);


--
-- Name: inscripciones_cuatrimestres_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.inscripciones_cuatrimestres ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.inscripciones_cuatrimestres_id_seq
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
    plan_id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    codigo character varying(50) NOT NULL,
    cuatrimestre_sugerido integer NOT NULL,
    es_basica_critica boolean DEFAULT false NOT NULL
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
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


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
-- Name: estudiantes estudiantes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_pkey PRIMARY KEY (id);


--
-- Name: inscripciones_cuatrimestres inscripciones_cuatrimestres_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inscripciones_cuatrimestres
    ADD CONSTRAINT inscripciones_cuatrimestres_pkey PRIMARY KEY (id);


--
-- Name: materias materias_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materias
    ADD CONSTRAINT materias_pkey PRIMARY KEY (id);


--
-- Name: plan_estudios plan_estudios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plan_estudios
    ADD CONSTRAINT plan_estudios_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


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
-- Name: cursadas cursadas_inscripcion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cursadas
    ADD CONSTRAINT cursadas_inscripcion_id_fkey FOREIGN KEY (inscripcion_id) REFERENCES public.inscripciones_cuatrimestres(id);


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
-- Name: inscripciones_cuatrimestres inscripciones_cuatrimestres_estudiante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inscripciones_cuatrimestres
    ADD CONSTRAINT inscripciones_cuatrimestres_estudiante_id_fkey FOREIGN KEY (estudiante_id) REFERENCES public.estudiantes(id);


--
-- Name: materias materias_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materias
    ADD CONSTRAINT materias_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.plan_estudios(id);


--
-- Name: plan_estudios plan_estudios_carrera_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plan_estudios
    ADD CONSTRAINT plan_estudios_carrera_id_fkey FOREIGN KEY (carrera_id) REFERENCES public.carreras(id);


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
    ('20260520010848');
