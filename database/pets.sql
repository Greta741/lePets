-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2016 m. Grd 13 d. 19:28
-- Server version: 10.1.16-MariaDB
-- PHP Version: 5.6.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pets`
--

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `adresai`
--

CREATE TABLE `adresai` (
  `id` int(11) NOT NULL,
  `veislyno_id` int(11) NOT NULL,
  `salis` varchar(100) COLLATE utf8_lithuanian_ci NOT NULL,
  `miestas` varchar(100) COLLATE utf8_lithuanian_ci NOT NULL,
  `adresas` varchar(100) COLLATE utf8_lithuanian_ci NOT NULL,
  `data` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rodomas` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- Sukurta duomenų kopija lentelei `adresai`
--

INSERT INTO `adresai` (`id`, `veislyno_id`, `salis`, `miestas`, `adresas`, `data`, `rodomas`) VALUES
(1, 4, 'sdgd', 'dfgdfg', 'dsgdfg', '2016-10-03 00:00:00', 1),
(2, 9, 'sdgd', 'dfgdfg', 'dsgdfg', '2016-10-03 00:00:00', 1),
(14, 11, 'adcg', 'dhvh', 'gfjhg', '2016-12-01 00:00:00', 1),
(15, 11, 'safdgfhgjg', 'sfdhgjhkjk', 'gjfhkjk', '2016-11-04 00:00:00', 1),
(16, 12, 'sdgdf', 'asdgdfh', 'sdgfh', '2016-12-09 16:26:12', 1);

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `apdovanojimas`
--

CREATE TABLE `apdovanojimas` (
  `id` int(11) NOT NULL,
  `data` datetime NOT NULL,
  `uzimta_vieta` int(3) NOT NULL,
  `prizas` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `dalyviu_skaicius` int(4) NOT NULL,
  `seimininkas` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `konkurso_miestas` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `konkurso_salis` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `asmenines_zinutes`
--

CREATE TABLE `asmenines_zinutes` (
  `id` int(11) NOT NULL,
  `adresatas` int(11) NOT NULL,
  `siuntejas` int(11) NOT NULL,
  `tekstas` varchar(500) COLLATE utf8_lithuanian_ci NOT NULL,
  `tema` varchar(200) COLLATE utf8_lithuanian_ci NOT NULL,
  `issiuntimo_laikas` datetime DEFAULT CURRENT_TIMESTAMP,
  `perziurejimo_laikas` datetime DEFAULT NULL,
  `busena` varchar(20) COLLATE utf8_lithuanian_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `atsiemimo_vieta`
--

CREATE TABLE `atsiemimo_vieta` (
  `id` int(11) NOT NULL,
  `miestas` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `gatve` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `namo_numeris` int(4) NOT NULL,
  `buto_numeris` int(4) NOT NULL,
  `salis` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `gyvunas`
--

CREATE TABLE `gyvunas` (
  `id` int(11) NOT NULL,
  `apdovanojimas_id` int(11) DEFAULT NULL,
  `pardavimas_id` int(11) NOT NULL,
  `tipas_id` int(11) NOT NULL,
  `vartotojas_id` int(11) NOT NULL,
  `veislės_id` int(11) DEFAULT NULL,
  `vardas` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `nuotrauka` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  `tevas` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `motina` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `spalva` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `registravimo_data` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `amzius` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `naujienos`
--

CREATE TABLE `naujienos` (
  `id` int(11) NOT NULL,
  `veislyno_id` int(11) NOT NULL,
  `data` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `antraste` varchar(50) COLLATE utf8_lithuanian_ci NOT NULL,
  `tekstas` varchar(500) COLLATE utf8_lithuanian_ci NOT NULL,
  `nuotraukos_url` varchar(100) COLLATE utf8_lithuanian_ci DEFAULT NULL,
  `ar_svarbus` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- Sukurta duomenų kopija lentelei `naujienos`
--

INSERT INTO `naujienos` (`id`, `veislyno_id`, `data`, `antraste`, `tekstas`, `nuotraukos_url`, `ar_svarbus`) VALUES
(3, 11, '2016-12-01 00:00:00', 'sagfdg', 'sdgdfjhg', 'http://webneel.com/daily/sites/default/files/images/daily/02-2014/25-evil-cat-drawing.preview.jpg', 1),
(13, 11, '2016-12-09 16:35:33', 'aszgdxhcvbnm', 'sdhfcvjbn.m,.', NULL, 0),
(14, 11, '2016-12-13 14:05:13', 'sdyf\r\n', 'ADHJKL;\r\n''', NULL, 1);

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `nuotrauka`
--

CREATE TABLE `nuotrauka` (
  `id` int(11) NOT NULL,
  `veisle` int(11) DEFAULT NULL,
  `poveisle` int(11) DEFAULT NULL,
  `url` varchar(100) COLLATE utf8_lithuanian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `pardavimas`
--

CREATE TABLE `pardavimas` (
  `id` int(11) NOT NULL,
  `atsiemimo_vieta_id` int(11) NOT NULL,
  `kaina` float NOT NULL,
  `pardavejo_vardas` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `telefono_numeris` int(12) NOT NULL,
  `data` datetime NOT NULL,
  `aprasymas` varchar(500) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `pastai`
--

CREATE TABLE `pastai` (
  `id` int(11) NOT NULL,
  `veislyno_id` int(11) NOT NULL,
  `pasto_adresas` varchar(100) COLLATE utf8_lithuanian_ci NOT NULL,
  `data` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rodomas` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- Sukurta duomenų kopija lentelei `pastai`
--

INSERT INTO `pastai` (`id`, `veislyno_id`, `pasto_adresas`, `data`, `rodomas`) VALUES
(1, 5, 'sdgfd@mail.com', '2016-10-03 00:00:00', 1),
(2, 9, 'sdgfd@mail.com', '2016-10-03 00:00:00', 1),
(3, 10, 'sdgfd@mail.com', '2016-10-03 00:00:00', 1),
(8, 11, 'fshgfhgf', '2016-12-01 00:00:00', 1),
(9, 11, 'sddsdg@sdgdfg', '2016-11-04 00:00:00', 1),
(10, 12, 'tdfugfj@sdgdfg', '2016-12-09 16:26:12', 1);

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `poveisle`
--

CREATE TABLE `poveisle` (
  `id` int(11) NOT NULL,
  `veisle` int(11) NOT NULL,
  `redagavimo_data` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `pavadinimas` varchar(100) COLLATE utf8_lithuanian_ci NOT NULL,
  `aprasymas` varchar(500) COLLATE utf8_lithuanian_ci NOT NULL,
  `registravimo_data` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `gyvunu_kiekis` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `prenumerata`
--

CREATE TABLE `prenumerata` (
  `id` int(11) NOT NULL,
  `parinktys` int(11) DEFAULT NULL,
  `vartotojas` int(11) NOT NULL,
  `registravimo_data` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `galioja_iki` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `prenumeratos_parinktys`
--

CREATE TABLE `prenumeratos_parinktys` (
  `id` int(11) NOT NULL,
  `veisle` int(11) DEFAULT NULL,
  `poveisle` int(11) DEFAULT NULL,
  `tipas` int(11) DEFAULT NULL,
  `max_kaina` int(11) DEFAULT NULL,
  `min_kaina` int(11) DEFAULT NULL,
  `max_amzius` int(11) DEFAULT NULL,
  `min_amzius` int(11) DEFAULT NULL,
  `turi_apdovanojima` tinyint(1) DEFAULT NULL,
  `nurodytas_tevas` tinyint(1) DEFAULT NULL,
  `nurodyta_motina` tinyint(1) DEFAULT NULL,
  `su_nuotrauka` tinyint(1) DEFAULT NULL,
  `miestas` varchar(100) COLLATE utf8_lithuanian_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `prisijungimo_duomenys`
--

CREATE TABLE `prisijungimo_duomenys` (
  `id` int(11) NOT NULL,
  `slaptazodis` varchar(200) COLLATE utf8_lithuanian_ci NOT NULL,
  `paskutinio_aktyvumo_laikas` datetime DEFAULT CURRENT_TIMESTAMP,
  `prieigos_raktas` varchar(200) COLLATE utf8_lithuanian_ci DEFAULT NULL,
  `busena` varchar(20) COLLATE utf8_lithuanian_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- Sukurta duomenų kopija lentelei `prisijungimo_duomenys`
--

INSERT INTO `prisijungimo_duomenys` (`id`, `slaptazodis`, `paskutinio_aktyvumo_laikas`, `prieigos_raktas`, `busena`) VALUES
(1, '$2a$10$8j3PMYC6wW7vdYV100iI4e77JcX9nyQfmceGWot5a8Z0Uxt/XA.g6', '2016-12-13 14:09:22', '$2a$10$s4PJdPC.bUOlBTAdjpoeUe8eUzXQE84/zB.x0JdqVWg.2XBM/Chim', 'aktyvus');

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `pavadinimas` varchar(50) COLLATE utf8_lithuanian_ci NOT NULL,
  `lygis` int(11) NOT NULL,
  `priskyrimo_laikas` datetime DEFAULT CURRENT_TIMESTAMP,
  `aprasymas` varchar(200) COLLATE utf8_lithuanian_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- Sukurta duomenų kopija lentelei `roles`
--

INSERT INTO `roles` (`id`, `pavadinimas`, `lygis`, `priskyrimo_laikas`, `aprasymas`) VALUES
(10, 'Registruotas vartotojas', 1, '2016-12-13 14:23:09', 'Paprastas registruotas vartotojas.'),
(11, 'Moderatorius', 3, '2016-12-13 14:23:27', NULL),
(12, 'Administratorius', 10, '2016-12-13 14:23:54', 'Sistemos administratorius'),
(13, 'Veislyno savininkas', 2, '2016-12-13 14:24:17', NULL);

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `role_teise`
--

CREATE TABLE `role_teise` (
  `roles_id` int(11) NOT NULL,
  `teises_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- Sukurta duomenų kopija lentelei `role_teise`
--

INSERT INTO `role_teise` (`roles_id`, `teises_id`) VALUES
(10, 10),
(10, 11),
(10, 12),
(10, 13),
(10, 14),
(10, 15),
(10, 16),
(10, 17),
(10, 18),
(10, 19),
(10, 20),
(11, 10),
(11, 11),
(11, 12),
(11, 13),
(11, 14),
(11, 15),
(11, 16),
(11, 17),
(11, 18),
(11, 19),
(11, 20),
(11, 21),
(11, 22),
(11, 23),
(12, 10),
(12, 11),
(12, 12),
(12, 13),
(12, 14),
(12, 15),
(12, 16),
(12, 17),
(12, 18),
(12, 19),
(12, 20),
(12, 21),
(12, 22),
(12, 23),
(12, 24),
(12, 25),
(13, 10),
(13, 11),
(13, 12),
(13, 13),
(13, 14),
(13, 15),
(13, 16),
(13, 17),
(13, 18),
(13, 19),
(13, 20),
(13, 26),
(13, 27);

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `roliu_teises`
--

CREATE TABLE `roliu_teises` (
  `id` int(11) NOT NULL,
  `pavadinimas` varchar(100) COLLATE utf8_lithuanian_ci NOT NULL,
  `aprasymas` varchar(500) COLLATE utf8_lithuanian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- Sukurta duomenų kopija lentelei `roliu_teises`
--

INSERT INTO `roliu_teises` (`id`, `pavadinimas`, `aprasymas`) VALUES
(10, 'gyvunoRegistravimas', 'Užregistruoti gyvūną sistemoje'),
(11, 'uzregistruotoGyvunoRedagavimas', 'Užregistruoto gyvūno redagavimas'),
(12, 'veislynoRegistravimas', 'Veislyno registravimas'),
(13, 'asmeninioProfilioPerziuraRedagavimas', 'Asmeninio profilio peržiūra/redagavimas'),
(14, 'asmeniniuZinuciuSiuntimas', 'Asmeninių žinučių siuntimas'),
(15, 'gyvunoPerziura', 'Gyvūno peržiūra'),
(16, 'paieskaPagalRaktazodi', 'Paieška pagal raktažodį'),
(17, 'issamiPaieskaPagalKriterijus', 'Išsami paieška pagal kriterijus'),
(18, 'veislesPuslapioPerziura', 'Veislės puslapio peržiūra'),
(19, 'prenumeratosRegistravimas', 'Prenumeratos registravimas'),
(20, 'prenumeratosPerziura', 'Prenumeratos peržiūra'),
(21, 'veislynoPatvirtinimas', 'Veislyno patvirtinimas'),
(22, 'veislesRegistravimas', 'Veislės registravimas'),
(23, 'registruotosVeislesRedagavimas', 'Registruotos veislės redagavimas'),
(24, 'vartotojuRoliuKeitimas', 'Vartotojų rolių keitimas'),
(25, 'perziuretiAtaskaitas', 'Peržiūrėti ataskaitas'),
(26, 'asmeninioPuslapioRedagavimas', 'Asmeninio veislyno puslapio redagavimas'),
(27, 'naujienuSkelbimas', 'Naujienų skelbimas');

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `telefonai`
--

CREATE TABLE `telefonai` (
  `id` int(11) NOT NULL,
  `veislyno_id` int(11) NOT NULL,
  `telefono_nr` int(11) NOT NULL,
  `data` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rodomas` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- Sukurta duomenų kopija lentelei `telefonai`
--

INSERT INTO `telefonai` (`id`, `veislyno_id`, `telefono_nr`, `data`, `rodomas`) VALUES
(1, 5, 154236879, '2016-10-03 00:00:00', 1),
(2, 9, 154236879, '2016-10-03 00:00:00', 1),
(3, 10, 154236879, '2016-10-03 00:00:00', 1),
(9, 11, 8456456, '2016-12-01 00:00:00', 0),
(10, 11, 54654646, '2016-11-04 00:00:00', 1),
(11, 11, 123456789, '2016-11-04 00:00:00', 1),
(12, 12, 123456789, '2016-12-09 16:26:12', 1);

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `tipas`
--

CREATE TABLE `tipas` (
  `id` int(11) NOT NULL,
  `lytis` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `gyvuno_tipas` varchar(10) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Sukurta duomenų kopija lentelei `tipas`
--

INSERT INTO `tipas` (`id`, `lytis`, `gyvuno_tipas`) VALUES
(1, 'patinas', 'šuo'),
(2, 'patelė', 'šuo'),
(3, 'patelė', 'katinas'),
(4, 'patinas', 'katinas');

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `vartotojai`
--

CREATE TABLE `vartotojai` (
  `id` int(11) NOT NULL,
  `prisijung_id` int(11) DEFAULT NULL,
  `vartotojo_vardas` varchar(100) COLLATE utf8_lithuanian_ci NOT NULL,
  `el_pastas` varchar(100) COLLATE utf8_lithuanian_ci NOT NULL,
  `telefono_nr` varchar(20) COLLATE utf8_lithuanian_ci DEFAULT NULL,
  `gimimo_data` date DEFAULT NULL,
  `vardas` varchar(50) COLLATE utf8_lithuanian_ci DEFAULT NULL,
  `pavarde` varchar(50) COLLATE utf8_lithuanian_ci DEFAULT NULL,
  `registracijos_laikas` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lytis` varchar(50) COLLATE utf8_lithuanian_ci DEFAULT NULL,
  `salis` varchar(30) COLLATE utf8_lithuanian_ci DEFAULT NULL,
  `miestas` varchar(50) COLLATE utf8_lithuanian_ci DEFAULT NULL,
  `roles_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `veisle`
--

CREATE TABLE `veisle` (
  `id` int(11) NOT NULL,
  `redagavimo_data` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `pavadinimas` varchar(100) COLLATE utf8_lithuanian_ci NOT NULL,
  `gyvuno_tipas` varchar(50) COLLATE utf8_lithuanian_ci NOT NULL,
  `dydis` varchar(100) COLLATE utf8_lithuanian_ci NOT NULL,
  `aprasymas` varchar(500) COLLATE utf8_lithuanian_ci NOT NULL,
  `registravimo_data` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `gyvunu_kiekis` int(11) NOT NULL,
  `poveisliu_kiekis` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- Sukurta duomenų kopija lentelei `veisle`
--

INSERT INTO `veisle` (`id`, `redagavimo_data`, `pavadinimas`, `gyvuno_tipas`, `dydis`, `aprasymas`, `registravimo_data`, `gyvunu_kiekis`, `poveisliu_kiekis`) VALUES
(1, '2016-12-11 00:00:00', 'bdfbd', 'šuo', 'xs', 'dbdbd', '2016-12-11 00:00:00', 2, 2),
(2, '2016-12-11 00:00:00', 'Some goofy-ass dog', 'šuo', 'l', 'They eat, shit and don''t really do much else', '2016-12-11 00:00:00', 2, 2);

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `veislynai`
--

CREATE TABLE `veislynai` (
  `id` int(11) NOT NULL,
  `tipo_id` int(11) DEFAULT NULL,
  `vartotojo_id` int(11) DEFAULT NULL,
  `pavadinimas` varchar(50) COLLATE utf8_lithuanian_ci NOT NULL,
  `aprasymas` varchar(500) COLLATE utf8_lithuanian_ci NOT NULL,
  `veiklos_pradzia` varchar(100) COLLATE utf8_lithuanian_ci NOT NULL,
  `registracijos_data` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `paskutinio_aktyvumo_data` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ar_patvirtintas` int(2) NOT NULL DEFAULT '0',
  `ar_istrintas` tinyint(1) DEFAULT NULL,
  `gyvunu_skaicius` int(11) NOT NULL DEFAULT '0',
  `nuotraukos_url` varchar(100) COLLATE utf8_lithuanian_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- Sukurta duomenų kopija lentelei `veislynai`
--

INSERT INTO `veislynai` (`id`, `tipo_id`, `vartotojo_id`, `pavadinimas`, `aprasymas`, `veiklos_pradzia`, `registracijos_data`, `paskutinio_aktyvumo_data`, `ar_patvirtintas`, `ar_istrintas`, `gyvunu_skaicius`, `nuotraukos_url`) VALUES
(1, NULL, NULL, 'xcgbfd', 'gfdhgf', 'hgfh', '2016-11-01 00:00:00', '2016-11-01 00:00:00', 1, 1, 0, 'gjbvn'),
(2, NULL, NULL, 'afsgdfchgvjhj', 'dfjhgkjhk', 'fcjvbknm,.', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, 0, 0, 'https://sgdgfd.com'),
(3, NULL, NULL, 'afsgdfchgvjhj', 'dfjhgkjhk', 'fcjvbknm,.', '2016-10-03 00:00:00', '2016-10-03 00:00:00', 0, 0, 0, 'https://sgdgfd.com'),
(4, NULL, NULL, 'afsgdfchgvjhj', 'dfjhgkjhk', 'fcjvbknm,.', '2016-10-03 00:00:00', '2016-10-03 00:00:00', 0, 0, 0, 'https://sgdgfd.com'),
(5, NULL, NULL, 'afsgdfchgvjhj', 'dfjhgkjhk', 'fcjvbknm,.', '2016-10-03 00:00:00', '2016-10-03 00:00:00', 0, 0, 0, 'https://sgdgfd.com'),
(6, NULL, NULL, 'afsgdfchgvjhj', 'dfjhgkjhk', 'fcjvbknm,.', '2016-10-03 00:00:00', '2016-10-03 00:00:00', 0, 0, 0, 'https://sgdgfd.com'),
(7, NULL, NULL, 'afsgdfchgvjhj', 'dfjhgkjhk', 'fcjvbknm,.', '2016-10-03 00:00:00', '2016-10-03 00:00:00', 0, 0, 0, 'https://sgdgfd.com'),
(8, NULL, NULL, 'afsgdfchgvjhj', 'dfjhgkjhk', 'fcjvbknm,.', '2016-10-03 00:00:00', '2016-10-03 00:00:00', 0, 0, 0, 'https://sgdgfd.com'),
(9, NULL, NULL, 'afsgdfchgvjhj', 'dfjhgkjhk', 'fcjvbknm,.', '2016-10-03 00:00:00', '2016-10-03 00:00:00', 0, 0, 0, 'https://sgdgfd.com'),
(10, NULL, NULL, 'afsgdfchgvjhj', 'dfjhgkjhk', 'fcjvbknm,.', '2016-10-03 00:00:00', '2016-10-03 00:00:00', 0, 0, 0, 'https://sgdgfd.com'),
(11, NULL, NULL, 'dgfhgjhjk', 'dfjhgkjhk', 'fcjvbknm,.', '2016-10-03 00:00:00', '2016-12-13 14:08:37', 1, 0, 0, 'http://tamsoje.lt/wp-content/uploads/2013/07/Katinas_04.jpg'),
(12, 1, NULL, 'adfhfdh', 'dsgdfhgfh', 'sdgfhgf', '2016-12-09 16:26:12', '2016-12-09 16:26:12', 0, 0, 0, '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adresai`
--
ALTER TABLE `adresai`
  ADD PRIMARY KEY (`id`),
  ADD KEY `veislyno_id` (`veislyno_id`);

--
-- Indexes for table `apdovanojimas`
--
ALTER TABLE `apdovanojimas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `asmenines_zinutes`
--
ALTER TABLE `asmenines_zinutes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `adresatas` (`adresatas`),
  ADD KEY `siuntejas` (`siuntejas`);

--
-- Indexes for table `atsiemimo_vieta`
--
ALTER TABLE `atsiemimo_vieta`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gyvunas`
--
ALTER TABLE `gyvunas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `apdovanojimas_id` (`apdovanojimas_id`),
  ADD KEY `pardavimas_id` (`pardavimas_id`),
  ADD KEY `tipas_id` (`tipas_id`),
  ADD KEY `vartotojas_id` (`vartotojas_id`),
  ADD KEY `veislės_id` (`veislės_id`);

--
-- Indexes for table `naujienos`
--
ALTER TABLE `naujienos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `veislyno_id` (`veislyno_id`);

--
-- Indexes for table `nuotrauka`
--
ALTER TABLE `nuotrauka`
  ADD PRIMARY KEY (`id`),
  ADD KEY `veisle` (`veisle`),
  ADD KEY `poveisle` (`poveisle`);

--
-- Indexes for table `pardavimas`
--
ALTER TABLE `pardavimas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `atsiemimo_vieta_id` (`atsiemimo_vieta_id`);

--
-- Indexes for table `pastai`
--
ALTER TABLE `pastai`
  ADD PRIMARY KEY (`id`),
  ADD KEY `veislyno_id` (`veislyno_id`);

--
-- Indexes for table `poveisle`
--
ALTER TABLE `poveisle`
  ADD PRIMARY KEY (`id`),
  ADD KEY `veisle` (`veisle`);

--
-- Indexes for table `prenumerata`
--
ALTER TABLE `prenumerata`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parinktys` (`parinktys`),
  ADD KEY `vartotojas` (`vartotojas`);

--
-- Indexes for table `prenumeratos_parinktys`
--
ALTER TABLE `prenumeratos_parinktys`
  ADD PRIMARY KEY (`id`),
  ADD KEY `veisle` (`veisle`),
  ADD KEY `poveisle` (`poveisle`),
  ADD KEY `tipas` (`tipas`);

--
-- Indexes for table `prisijungimo_duomenys`
--
ALTER TABLE `prisijungimo_duomenys`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role_teise`
--
ALTER TABLE `role_teise`
  ADD PRIMARY KEY (`roles_id`,`teises_id`),
  ADD KEY `teises_id` (`teises_id`);

--
-- Indexes for table `roliu_teises`
--
ALTER TABLE `roliu_teises`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `telefonai`
--
ALTER TABLE `telefonai`
  ADD PRIMARY KEY (`id`),
  ADD KEY `veislyno_id` (`veislyno_id`);

--
-- Indexes for table `tipas`
--
ALTER TABLE `tipas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vartotojai`
--
ALTER TABLE `vartotojai`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vartotojai_ibfk_1` (`prisijung_id`),
  ADD KEY `roles_id` (`roles_id`);

--
-- Indexes for table `veisle`
--
ALTER TABLE `veisle`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `veislynai`
--
ALTER TABLE `veislynai`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tipo_id` (`tipo_id`),
  ADD KEY `vartotojo_id` (`vartotojo_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adresai`
--
ALTER TABLE `adresai`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT for table `apdovanojimas`
--
ALTER TABLE `apdovanojimas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `asmenines_zinutes`
--
ALTER TABLE `asmenines_zinutes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `atsiemimo_vieta`
--
ALTER TABLE `atsiemimo_vieta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `gyvunas`
--
ALTER TABLE `gyvunas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `naujienos`
--
ALTER TABLE `naujienos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT for table `nuotrauka`
--
ALTER TABLE `nuotrauka`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `pardavimas`
--
ALTER TABLE `pardavimas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `pastai`
--
ALTER TABLE `pastai`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `poveisle`
--
ALTER TABLE `poveisle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `prenumerata`
--
ALTER TABLE `prenumerata`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `prenumeratos_parinktys`
--
ALTER TABLE `prenumeratos_parinktys`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `prisijungimo_duomenys`
--
ALTER TABLE `prisijungimo_duomenys`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT for table `roliu_teises`
--
ALTER TABLE `roliu_teises`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT for table `telefonai`
--
ALTER TABLE `telefonai`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `tipas`
--
ALTER TABLE `tipas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `vartotojai`
--
ALTER TABLE `vartotojai`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `veisle`
--
ALTER TABLE `veisle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- Apribojimai eksportuotom lentelėm
--

--
-- Apribojimai lentelei `adresai`
--
ALTER TABLE `adresai`
  ADD CONSTRAINT `adresai_ibfk_1` FOREIGN KEY (`veislyno_id`) REFERENCES `veislynai` (`id`);

--
-- Apribojimai lentelei `asmenines_zinutes`
--
ALTER TABLE `asmenines_zinutes`
  ADD CONSTRAINT `asmenines_zinutes_ibfk_1` FOREIGN KEY (`siuntejas`) REFERENCES `vartotojai` (`id`),
  ADD CONSTRAINT `asmenines_zinutes_ibfk_2` FOREIGN KEY (`adresatas`) REFERENCES `vartotojai` (`id`);

--
-- Apribojimai lentelei `gyvunas`
--
ALTER TABLE `gyvunas`
  ADD CONSTRAINT `gyvunas_apdovanojimas_fk` FOREIGN KEY (`apdovanojimas_id`) REFERENCES `apdovanojimas` (`id`),
  ADD CONSTRAINT `gyvunas_ibfk_1` FOREIGN KEY (`vartotojas_id`) REFERENCES `vartotojai` (`id`),
  ADD CONSTRAINT `gyvunas_ibfk_2` FOREIGN KEY (`veislės_id`) REFERENCES `veisle` (`id`),
  ADD CONSTRAINT `gyvunas_pardavimas_fk` FOREIGN KEY (`pardavimas_id`) REFERENCES `pardavimas` (`id`),
  ADD CONSTRAINT `gyvunas_tipas_fk` FOREIGN KEY (`tipas_id`) REFERENCES `tipas` (`id`);

--
-- Apribojimai lentelei `naujienos`
--
ALTER TABLE `naujienos`
  ADD CONSTRAINT `naujienos_ibfk_1` FOREIGN KEY (`veislyno_id`) REFERENCES `veislynai` (`id`);

--
-- Apribojimai lentelei `nuotrauka`
--
ALTER TABLE `nuotrauka`
  ADD CONSTRAINT `nuotrauka_ibfk_1` FOREIGN KEY (`veisle`) REFERENCES `veisle` (`id`),
  ADD CONSTRAINT `nuotrauka_ibfk_2` FOREIGN KEY (`poveisle`) REFERENCES `poveisle` (`id`);

--
-- Apribojimai lentelei `pardavimas`
--
ALTER TABLE `pardavimas`
  ADD CONSTRAINT `pardavimas_atsiemimo_vieta_fk` FOREIGN KEY (`atsiemimo_vieta_id`) REFERENCES `atsiemimo_vieta` (`id`);

--
-- Apribojimai lentelei `pastai`
--
ALTER TABLE `pastai`
  ADD CONSTRAINT `pastai_ibfk_1` FOREIGN KEY (`veislyno_id`) REFERENCES `veislynai` (`id`);

--
-- Apribojimai lentelei `poveisle`
--
ALTER TABLE `poveisle`
  ADD CONSTRAINT `poveisle_ibfk_1` FOREIGN KEY (`veisle`) REFERENCES `veisle` (`id`);

--
-- Apribojimai lentelei `prenumerata`
--
ALTER TABLE `prenumerata`
  ADD CONSTRAINT `prenumerata_ibfk_1` FOREIGN KEY (`parinktys`) REFERENCES `prenumeratos_parinktys` (`id`),
  ADD CONSTRAINT `prenumerata_ibfk_2` FOREIGN KEY (`vartotojas`) REFERENCES `vartotojai` (`id`);

--
-- Apribojimai lentelei `prenumeratos_parinktys`
--
ALTER TABLE `prenumeratos_parinktys`
  ADD CONSTRAINT `prenumeratos_parinktys_ibfk_1` FOREIGN KEY (`veisle`) REFERENCES `veisle` (`id`),
  ADD CONSTRAINT `prenumeratos_parinktys_ibfk_2` FOREIGN KEY (`poveisle`) REFERENCES `poveisle` (`id`),
  ADD CONSTRAINT `prenumeratos_parinktys_ibfk_3` FOREIGN KEY (`tipas`) REFERENCES `tipas` (`id`);

--
-- Apribojimai lentelei `role_teise`
--
ALTER TABLE `role_teise`
  ADD CONSTRAINT `role_teise_ibfk_1` FOREIGN KEY (`roles_id`) REFERENCES `roles` (`id`),
  ADD CONSTRAINT `role_teise_ibfk_2` FOREIGN KEY (`teises_id`) REFERENCES `roliu_teises` (`id`);

--
-- Apribojimai lentelei `telefonai`
--
ALTER TABLE `telefonai`
  ADD CONSTRAINT `telefonai_ibfk_1` FOREIGN KEY (`veislyno_id`) REFERENCES `veislynai` (`id`);

--
-- Apribojimai lentelei `vartotojai`
--
ALTER TABLE `vartotojai`
  ADD CONSTRAINT `vartotojai_ibfk_1` FOREIGN KEY (`prisijung_id`) REFERENCES `prisijungimo_duomenys` (`id`),
  ADD CONSTRAINT `vartotojai_ibfk_2` FOREIGN KEY (`roles_id`) REFERENCES `roles` (`id`);

--
-- Apribojimai lentelei `veislynai`
--
ALTER TABLE `veislynai`
  ADD CONSTRAINT `veislynai_ibfk_1` FOREIGN KEY (`tipo_id`) REFERENCES `tipas` (`id`),
  ADD CONSTRAINT `veislynai_ibfk_2` FOREIGN KEY (`vartotojo_id`) REFERENCES `vartotojai` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
