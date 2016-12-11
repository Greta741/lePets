-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2016 m. Grd 11 d. 20:22
-- Server version: 10.1.13-MariaDB
-- PHP Version: 5.6.21

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
  `data` date NOT NULL,
  `rodomas` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- Sukurta duomenų kopija lentelei `adresai`
--

INSERT INTO `adresai` (`id`, `veislyno_id`, `salis`, `miestas`, `adresas`, `data`, `rodomas`) VALUES
(1, 4, 'sdgd', 'dfgdfg', 'dsgdfg', '2016-10-03', 1),
(2, 9, 'sdgd', 'dfgdfg', 'dsgdfg', '2016-10-03', 1),
(14, 11, 'adcg', 'dhvh', 'gfjhg', '2016-12-01', 1),
(15, 11, 'safdgfhgjg', 'sfdhgjhkjk', 'gjfhkjk', '2016-11-04', 1);

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `gyvunas`
--

CREATE TABLE `gyvunas` (
  `id` int(10) NOT NULL,
  `apdovanojimas_id` int(10) NOT NULL,
  `pardavimas_id` int(10) NOT NULL,
  `tipas_id` int(10) NOT NULL,
  `veislynas_id` int(10) NOT NULL,
  `vartotojas_id` int(10) NOT NULL,
  `veislės_id` int(10) NOT NULL,
  `vardas` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `gimimo_data` date NOT NULL,
  `nuotrauka` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  `tevas` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `motina` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `spalva` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Sukurta duomenų kopija lentelei `gyvunas`
--

INSERT INTO `gyvunas` (`id`, `apdovanojimas_id`, `pardavimas_id`, `tipas_id`, `veislynas_id`, `vartotojas_id`, `veislės_id`, `vardas`, `gimimo_data`, `nuotrauka`, `tevas`, `motina`, `spalva`) VALUES
(1, 1, 1, 1, 1, 1, 1, 'greagrag', '2016-12-14', 'http://laikas.tv3.lt/assets/data/media/images/kate(1).jpg', 'rthrth', 'rthrhr', 'rthrthr'),
(2, 2, 2, 2, 2, 2, 2, 'agdfsgf', '2016-12-06', 'http://g4.dcdn.lt/images/pix/kate-paniurele-67169470.jpg', 'dfgdg', 'dfgdfg', 'dfgdgdg');

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `naujienos`
--

CREATE TABLE `naujienos` (
  `id` int(11) NOT NULL,
  `veislyno_id` int(11) NOT NULL,
  `data` date NOT NULL,
  `antraste` varchar(50) COLLATE utf8_lithuanian_ci NOT NULL,
  `tekstas` varchar(500) COLLATE utf8_lithuanian_ci NOT NULL,
  `nuotraukos_url` varchar(100) COLLATE utf8_lithuanian_ci DEFAULT NULL,
  `ar_svarbus` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- Sukurta duomenų kopija lentelei `naujienos`
--

INSERT INTO `naujienos` (`id`, `veislyno_id`, `data`, `antraste`, `tekstas`, `nuotraukos_url`, `ar_svarbus`) VALUES
(1, 11, '2016-12-02', 'sdg', 'dgfdgdfg', '', 0),
(2, 11, '2016-12-01', 'dsgdg', 'dsgfdg', NULL, 1),
(3, 11, '2016-12-01', 'sagfdg', 'sdgdfjhg', 'http://webneel.com/daily/sites/default/files/images/daily/02-2014/25-evil-cat-drawing.preview.jpg', 1);

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `pastai`
--

CREATE TABLE `pastai` (
  `id` int(11) NOT NULL,
  `veislyno_id` int(11) NOT NULL,
  `pasto_adresas` varchar(100) COLLATE utf8_lithuanian_ci NOT NULL,
  `data` date NOT NULL,
  `rodomas` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- Sukurta duomenų kopija lentelei `pastai`
--

INSERT INTO `pastai` (`id`, `veislyno_id`, `pasto_adresas`, `data`, `rodomas`) VALUES
(1, 5, 'sdgfd@mail.com', '2016-10-03', 1),
(2, 9, 'sdgfd@mail.com', '2016-10-03', 1),
(3, 10, 'sdgfd@mail.com', '2016-10-03', 1),
(8, 11, 'fshgfhgf', '2016-12-01', 1),
(9, 11, 'sddsdg@sdgdfg', '2016-11-04', 1);

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `telefonai`
--

CREATE TABLE `telefonai` (
  `id` int(11) NOT NULL,
  `veislyno_id` int(11) NOT NULL,
  `telefono_nr` int(11) NOT NULL,
  `data` date NOT NULL,
  `rodomas` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- Sukurta duomenų kopija lentelei `telefonai`
--

INSERT INTO `telefonai` (`id`, `veislyno_id`, `telefono_nr`, `data`, `rodomas`) VALUES
(1, 5, 154236879, '2016-10-03', 1),
(2, 9, 154236879, '2016-10-03', 1),
(3, 10, 154236879, '2016-10-03', 1),
(9, 11, 8456456, '2016-12-01', 1),
(10, 11, 54654646, '2016-11-04', 1),
(11, 11, 123456789, '2016-11-04', 1);

-- --------------------------------------------------------

--
-- Sukurta duomenų struktūra lentelei `tipas`
--

CREATE TABLE `tipas` (
  `id` int(11) NOT NULL,
  `gyvuno_tipas` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `lytis` varchar(10) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Sukurta duomenų kopija lentelei `tipas`
--

INSERT INTO `tipas` (`id`, `gyvuno_tipas`, `lytis`) VALUES
(1, 'šuo', 'patinas'),
(2, 'šuo', 'patelė'),
(3, 'katė', 'patelė'),
(4, 'katinas', 'patinas');

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
  `registracijos_data` date NOT NULL,
  `paskutinio_aktyvumo_data` date NOT NULL,
  `ar_patvirtintas` tinyint(1) NOT NULL,
  `ar_istrintas` tinyint(1) NOT NULL,
  `gyvunu_skaicius` int(11) NOT NULL,
  `nuotraukos_url` varchar(100) COLLATE utf8_lithuanian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- Sukurta duomenų kopija lentelei `veislynai`
--

INSERT INTO `veislynai` (`id`, `tipo_id`, `vartotojo_id`, `pavadinimas`, `aprasymas`, `veiklos_pradzia`, `registracijos_data`, `paskutinio_aktyvumo_data`, `ar_patvirtintas`, `ar_istrintas`, `gyvunu_skaicius`, `nuotraukos_url`) VALUES
(1, NULL, NULL, 'xcgbfd', 'gfdhgf', 'hgfh', '2016-11-01', '2016-11-01', 1, 1, 0, 'gjbvn'),
(2, NULL, NULL, 'afsgdfchgvjhj', 'dfjhgkjhk', 'fcjvbknm,.', '0000-00-00', '0000-00-00', 0, 0, 0, 'https://sgdgfd.com'),
(3, NULL, NULL, 'afsgdfchgvjhj', 'dfjhgkjhk', 'fcjvbknm,.', '2016-10-03', '2016-10-03', 0, 0, 0, 'https://sgdgfd.com'),
(4, NULL, NULL, 'afsgdfchgvjhj', 'dfjhgkjhk', 'fcjvbknm,.', '2016-10-03', '2016-10-03', 0, 0, 0, 'https://sgdgfd.com'),
(5, NULL, NULL, 'afsgdfchgvjhj', 'dfjhgkjhk', 'fcjvbknm,.', '2016-10-03', '2016-10-03', 0, 0, 0, 'https://sgdgfd.com'),
(6, NULL, NULL, 'afsgdfchgvjhj', 'dfjhgkjhk', 'fcjvbknm,.', '2016-10-03', '2016-10-03', 0, 0, 0, 'https://sgdgfd.com'),
(7, NULL, NULL, 'afsgdfchgvjhj', 'dfjhgkjhk', 'fcjvbknm,.', '2016-10-03', '2016-10-03', 0, 0, 0, 'https://sgdgfd.com'),
(8, NULL, NULL, 'afsgdfchgvjhj', 'dfjhgkjhk', 'fcjvbknm,.', '2016-10-03', '2016-10-03', 0, 0, 0, 'https://sgdgfd.com'),
(9, NULL, NULL, 'afsgdfchgvjhj', 'dfjhgkjhk', 'fcjvbknm,.', '2016-10-03', '2016-10-03', 0, 0, 0, 'https://sgdgfd.com'),
(10, NULL, NULL, 'afsgdfchgvjhj', 'dfjhgkjhk', 'fcjvbknm,.', '2016-10-03', '2016-10-03', 0, 0, 0, 'https://sgdgfd.com'),
(11, NULL, NULL, 'dgfhgjhjk', 'dfjhgkjhk', 'fcjvbknm,.', '2016-10-03', '2016-12-11', 0, 0, 0, 'http://tamsoje.lt/wp-content/uploads/2013/07/Katinas_04.jpg');

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
-- Indexes for table `gyvunas`
--
ALTER TABLE `gyvunas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `naujienos`
--
ALTER TABLE `naujienos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `veislyno_id` (`veislyno_id`);

--
-- Indexes for table `pastai`
--
ALTER TABLE `pastai`
  ADD PRIMARY KEY (`id`),
  ADD KEY `veislyno_id` (`veislyno_id`);

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
-- Indexes for table `veislynai`
--
ALTER TABLE `veislynai`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adresai`
--
ALTER TABLE `adresai`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT for table `gyvunas`
--
ALTER TABLE `gyvunas`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `naujienos`
--
ALTER TABLE `naujienos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `pastai`
--
ALTER TABLE `pastai`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `telefonai`
--
ALTER TABLE `telefonai`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `tipas`
--
ALTER TABLE `tipas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- Apribojimai eksportuotom lentelėm
--

--
-- Apribojimai lentelei `adresai`
--
ALTER TABLE `adresai`
  ADD CONSTRAINT `adresai_ibfk_1` FOREIGN KEY (`veislyno_id`) REFERENCES `veislynai` (`id`);

--
-- Apribojimai lentelei `naujienos`
--
ALTER TABLE `naujienos`
  ADD CONSTRAINT `naujienos_ibfk_1` FOREIGN KEY (`veislyno_id`) REFERENCES `veislynai` (`id`);

--
-- Apribojimai lentelei `pastai`
--
ALTER TABLE `pastai`
  ADD CONSTRAINT `pastai_ibfk_1` FOREIGN KEY (`veislyno_id`) REFERENCES `veislynai` (`id`);

--
-- Apribojimai lentelei `telefonai`
--
ALTER TABLE `telefonai`
  ADD CONSTRAINT `telefonai_ibfk_1` FOREIGN KEY (`veislyno_id`) REFERENCES `veislynai` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
