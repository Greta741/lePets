-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2016 m. Grd 13 d. 13:52
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

--
-- Indexes for dumped tables
--

--
-- Indexes for table `roliu_teises`
--
ALTER TABLE `roliu_teises`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `roliu_teises`
--
ALTER TABLE `roliu_teises`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
