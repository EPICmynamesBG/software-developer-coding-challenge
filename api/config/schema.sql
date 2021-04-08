--
-- PostgreSQL database dump
--

-- Dumped from database version 13.2 (Debian 13.2-1.pgdg100+1)
-- Dumped by pg_dump version 13.2

-- Started on 2021-04-07 23:52:58 EDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16385)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 2995 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 637 (class 1247 OID 16397)
-- Name: account_roles; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.account_roles AS ENUM (
    'standard',
    'admin'
);


ALTER TYPE public.account_roles OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 202 (class 1259 OID 16410)
-- Name: account_listings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_listings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    account_id uuid NOT NULL,
    display jsonb DEFAULT '{}'::jsonb NOT NULL,
    vehicle_vin character varying(17),
    vehicle_nhtsa_info jsonb DEFAULT '{}'::jsonb NOT NULL,
    start_at_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    end_at_timestamp timestamp with time zone NOT NULL,
    is_active boolean DEFAULT false NOT NULL,
    is_complete boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.account_listings OWNER TO postgres;

--
-- TOC entry 201 (class 1259 OID 16401)
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    role public.account_roles DEFAULT 'standard'::public.account_roles NOT NULL
);


ALTER TABLE public.accounts OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 16432)
-- Name: files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.files (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    account_id uuid NOT NULL,
    account_listing_id uuid,
    file_type text NOT NULL,
    file_name text NOT NULL,
    storage_path text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.files OWNER TO postgres;

--
-- TOC entry 2996 (class 0 OID 0)
-- Dependencies: 203
-- Name: COLUMN files.storage_path; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.files.storage_path IS 'the full storage path/URI';


--
-- TOC entry 204 (class 1259 OID 16459)
-- Name: listing_bids; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.listing_bids (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    account_id uuid NOT NULL,
    account_listing_id uuid NOT NULL,
    bid_value numeric(15,6) NOT NULL,
    currency text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.listing_bids OWNER TO postgres;

--
-- TOC entry 2848 (class 2606 OID 16426)
-- Name: account_listings account_listings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_listings
    ADD CONSTRAINT account_listings_pkey PRIMARY KEY (id);


--
-- TOC entry 2846 (class 2606 OID 16424)
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- TOC entry 2850 (class 2606 OID 16441)
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- TOC entry 2852 (class 2606 OID 16443)
-- Name: files files_storage_path_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_storage_path_key UNIQUE (storage_path);


--
-- TOC entry 2854 (class 2606 OID 16473)
-- Name: listing_bids listing_bids_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listing_bids
    ADD CONSTRAINT listing_bids_pkey PRIMARY KEY (id);


--
-- TOC entry 2855 (class 2606 OID 16427)
-- Name: account_listings account_listings_account_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_listings
    ADD CONSTRAINT account_listings_account_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- TOC entry 2856 (class 2606 OID 16449)
-- Name: files files_account_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_account_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- TOC entry 2857 (class 2606 OID 16454)
-- Name: files files_account_listings_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_account_listings_fkey FOREIGN KEY (account_listing_id) REFERENCES public.account_listings(id) ON DELETE SET NULL;


--
-- TOC entry 2858 (class 2606 OID 16467)
-- Name: listing_bids listing_bids_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listing_bids
    ADD CONSTRAINT listing_bids_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- TOC entry 2859 (class 2606 OID 16474)
-- Name: listing_bids listing_bids_account_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listing_bids
    ADD CONSTRAINT listing_bids_account_listing_id_fkey FOREIGN KEY (account_listing_id) REFERENCES public.account_listings(id) ON DELETE CASCADE;


-- Completed on 2021-04-07 23:53:00 EDT

--
-- PostgreSQL database dump complete
--

