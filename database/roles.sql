-- phpMyAdmin SQL Dump
-- version 4.4.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Dec 13, 2016 at 01:24 PM
-- Server version: 5.6.25
-- PHP Version: 5.6.11

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
-- Table structure for table `roles`
--

CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) NOT NULL,
  `pavadinimas` varchar(50) COLLATE utf8_lithuanian_ci NOT NULL,
  `lygis` int(11) NOT NULL,
  `priskyrimo_laikas` datetime DEFAULT CURRENT_TIMESTAMP,
  `aprasymas` varchar(200) COLLATE utf8_lithuanian_ci DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `pavadinimas`, `lygis`, `priskyrimo_laikas`, `aprasymas`) VALUES
(10, 'Registruotas vartotojas', 1, '2016-12-13 14:23:09', 'Paprastas registruotas vartotojas.'),
(11, 'Moderatorius', 3, '2016-12-13 14:23:27', NULL),
(12, 'Administratorius', 10, '2016-12-13 14:23:54', 'Sistemos administratorius'),
(13, 'Veislyno savininkas', 2, '2016-12-13 14:24:17', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=14;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
