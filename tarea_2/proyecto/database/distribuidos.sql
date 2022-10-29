-- MySQL dump 10.13  Distrib 8.0.31, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: distribuidos
-- ------------------------------------------------------
-- Server version	5.5.5-10.3.9-MariaDB-1:10.3.9+maria~bionic

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `coordenadas`
--

DROP TABLE IF EXISTS `coordenadas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coordenadas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_patente` int(11) NOT NULL,
  `coordenada_x` int(11) NOT NULL,
  `coordenada_y` int(11) NOT NULL,
  `agente_extranio` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coordenadas`
--

LOCK TABLES `coordenadas` WRITE;
/*!40000 ALTER TABLE `coordenadas` DISABLE KEYS */;
INSERT INTO `coordenadas` VALUES (1,1,20,20,0),(2,2,18,19,0),(3,1,19,20,0),(4,2,19,19,1);
/*!40000 ALTER TABLE `coordenadas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registro_miembro`
--

DROP TABLE IF EXISTS `registro_miembro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registro_miembro` (
  `id_patente` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `rut` varchar(255) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `tipo_registro` varchar(255) NOT NULL,
  PRIMARY KEY (`id_patente`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registro_miembro`
--

LOCK TABLES `registro_miembro` WRITE;
/*!40000 ALTER TABLE `registro_miembro` DISABLE KEYS */;
INSERT INTO `registro_miembro` VALUES (1,'Bastian','Figueroa','15680326-1','bastian@gmail.com','1'),(2,'Jonathan','Frez','20175234-k','jona@udp.cl','0'),(3,'Sebastian','Riquelme','20187123-5','seba@mail.org','1');
/*!40000 ALTER TABLE `registro_miembro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventas`
--

DROP TABLE IF EXISTS `ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_patente` int(11) NOT NULL,
  `cliente` varchar(255) NOT NULL,
  `cantidad_sopaipillas` int(11) NOT NULL,
  `hora` varchar(255) NOT NULL,
  `stock_restante` int(11) NOT NULL,
  `coordenada_x` int(11) NOT NULL,
  `coordenada_y` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas`
--

LOCK TABLES `ventas` WRITE;
/*!40000 ALTER TABLE `ventas` DISABLE KEYS */;
INSERT INTO `ventas` VALUES (1,1,'Juanito',11,'18:37',989,19,20),(2,2,'Keznit',9,'17:40',991,19,19);
/*!40000 ALTER TABLE `ventas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-10-28 20:15:34
