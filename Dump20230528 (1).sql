-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: xarxa_social
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `emote`
--

DROP TABLE IF EXISTS `emote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emote` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image_path` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emote`
--

LOCK TABLES `emote` WRITE;
/*!40000 ALTER TABLE `emote` DISABLE KEYS */;
INSERT INTO `emote` VALUES (1,'emote/1685293791063_d6faa405e976db1ed5953e250dd737a5.gif','dance',_binary ''),(2,'emote/1685294735871_a84b904583b6e9d5e0dda46d4c04fd10.gif','congratulations',_binary ''),(3,'emote/1685294754164_ac678ec28b1ce3194ce88b0f3337d1b7.png','sleep',_binary ''),(4,'emote/1685294805585_4c0ba792fdb24b276e198d05c6f243d1.gif','clap',_binary ''),(5,'emote/1685294847806_8aaef86ff0183d99996155fa4fd78b92.png','thumb up',_binary '');
/*!40000 ALTER TABLE `emote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friend`
--

DROP TABLE IF EXISTS `friend`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friend` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `pending` bit(1) NOT NULL,
  `receiver_id` bigint DEFAULT NULL,
  `sender_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9p0yivdt1s5e2rw79s4v7yqrs` (`receiver_id`),
  KEY `FKtcr731kmjsfutgvbo9pkhptbu` (`sender_id`),
  CONSTRAINT `FK9p0yivdt1s5e2rw79s4v7yqrs` FOREIGN KEY (`receiver_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKtcr731kmjsfutgvbo9pkhptbu` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friend`
--

LOCK TABLES `friend` WRITE;
/*!40000 ALTER TABLE `friend` DISABLE KEYS */;
INSERT INTO `friend` VALUES (1,_binary '\0',2,3),(2,_binary '',2,4);
/*!40000 ALTER TABLE `friend` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job`
--

DROP TABLE IF EXISTS `job`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job`
--

LOCK TABLES `job` WRITE;
/*!40000 ALTER TABLE `job` DISABLE KEYS */;
INSERT INTO `job` VALUES (1,'job/1685295022171_Astrologian.png','Astrologian','HEALER',_binary ''),(2,'job/1685295039925_Bard.png','Bard','DPS',_binary ''),(3,'job/1685295055360_DarkKnight.png','Dark Knight','TANK',_binary ''),(4,'job/1685295064728_Warrior.png','Warrior','TANK',_binary ''),(5,'job/1685295073573_Machinist.png','Machinist','DPS',_binary ''),(6,'job/1685295096339_Monk.png','Monk','DPS',_binary ''),(7,'job/1685295113967_RedMage.png','Red mage','DPS',_binary ''),(8,'job/1685295125726_Sage.png','Sage','HEALER',_binary '');
/*!40000 ALTER TABLE `job` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fk_jobs` bigint DEFAULT NULL,
  `fk_user` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKb5i0c6dwtfis2l5ry6bnel6wd` (`fk_jobs`),
  KEY `FK8qjxfoi7asedt3yx873pgg3pe` (`fk_user`),
  CONSTRAINT `FK8qjxfoi7asedt3yx873pgg3pe` FOREIGN KEY (`fk_user`) REFERENCES `user` (`id`),
  CONSTRAINT `FKb5i0c6dwtfis2l5ry6bnel6wd` FOREIGN KEY (`fk_jobs`) REFERENCES `job` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,8,4),(2,3,2);
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `sent_date_time` datetime(6) NOT NULL,
  `emote_id` bigint DEFAULT NULL,
  `recipient_id` bigint NOT NULL,
  `sender_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKn16225tg1t07swtpy34yeb22l` (`emote_id`),
  KEY `FKiup8wew331d92o7u3k8d918o3` (`recipient_id`),
  KEY `FKcnj2qaf5yc36v2f90jw2ipl9b` (`sender_id`),
  CONSTRAINT `FKcnj2qaf5yc36v2f90jw2ipl9b` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKiup8wew331d92o7u3k8d918o3` FOREIGN KEY (`recipient_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKn16225tg1t07swtpy34yeb22l` FOREIGN KEY (`emote_id`) REFERENCES `emote` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` VALUES (1,'dance','2023-05-28 10:11:39.828311',1,3,2),(2,'Hi','2023-05-28 10:16:59.311832',NULL,3,2),(3,'clap','2023-05-28 10:27:47.408219',4,3,2);
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `party`
--

DROP TABLE IF EXISTS `party`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `party` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `creation_date` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `member1_fk` bigint DEFAULT NULL,
  `member2_fk` bigint DEFAULT NULL,
  `member3_fk` bigint DEFAULT NULL,
  `member4_fk` bigint DEFAULT NULL,
  `member5_fk` bigint DEFAULT NULL,
  `member6_fk` bigint DEFAULT NULL,
  `member7_fk` bigint DEFAULT NULL,
  `member8_fk` bigint DEFAULT NULL,
  `fk_raid` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKrl0jb80si0ih4xuk20snn1q2o` (`member1_fk`),
  KEY `FKc6y3vv8mlf447lq69s9y3mhb1` (`member2_fk`),
  KEY `FK6ko6pr8r1am8xci5ennacvfuu` (`member3_fk`),
  KEY `FK2ilgy1yqe5yd326a2hnxhtgvj` (`member4_fk`),
  KEY `FK6sfuvnhdd5gxxas3ft3q37jb3` (`member5_fk`),
  KEY `FK7w88n8b0m80ax6evembxjxx87` (`member6_fk`),
  KEY `FK3c1nond6ycd3syxpavybxxkyy` (`member7_fk`),
  KEY `FK8rurmoq0r1mlnyml8mgs5kroh` (`member8_fk`),
  KEY `FK7vxnvmipir2eokaku7xn3lwb2` (`fk_raid`),
  CONSTRAINT `FK2ilgy1yqe5yd326a2hnxhtgvj` FOREIGN KEY (`member4_fk`) REFERENCES `member` (`id`),
  CONSTRAINT `FK3c1nond6ycd3syxpavybxxkyy` FOREIGN KEY (`member7_fk`) REFERENCES `member` (`id`),
  CONSTRAINT `FK6ko6pr8r1am8xci5ennacvfuu` FOREIGN KEY (`member3_fk`) REFERENCES `member` (`id`),
  CONSTRAINT `FK6sfuvnhdd5gxxas3ft3q37jb3` FOREIGN KEY (`member5_fk`) REFERENCES `member` (`id`),
  CONSTRAINT `FK7vxnvmipir2eokaku7xn3lwb2` FOREIGN KEY (`fk_raid`) REFERENCES `raid` (`id`),
  CONSTRAINT `FK7w88n8b0m80ax6evembxjxx87` FOREIGN KEY (`member6_fk`) REFERENCES `member` (`id`),
  CONSTRAINT `FK8rurmoq0r1mlnyml8mgs5kroh` FOREIGN KEY (`member8_fk`) REFERENCES `member` (`id`),
  CONSTRAINT `FKc6y3vv8mlf447lq69s9y3mhb1` FOREIGN KEY (`member2_fk`) REFERENCES `member` (`id`),
  CONSTRAINT `FKrl0jb80si0ih4xuk20snn1q2o` FOREIGN KEY (`member1_fk`) REFERENCES `member` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `party`
--

LOCK TABLES `party` WRITE;
/*!40000 ALTER TABLE `party` DISABLE KEYS */;
INSERT INTO `party` VALUES (1,'2023-05-28 10:55:07.972065','Farm party alexander','Party - [object Object]',2,NULL,1,NULL,NULL,NULL,NULL,NULL,1);
/*!40000 ALTER TABLE `party` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `party_message`
--

DROP TABLE IF EXISTS `party_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `party_message` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `creation_date` datetime(6) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `party_member_nickname` varchar(255) DEFAULT NULL,
  `fk_emote` bigint DEFAULT NULL,
  `fk_party` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK14yqg6rcrjkm3abk3kilm5tjf` (`fk_emote`),
  KEY `FKaceh2lu2tcie2wk7wsklsehim` (`fk_party`),
  CONSTRAINT `FK14yqg6rcrjkm3abk3kilm5tjf` FOREIGN KEY (`fk_emote`) REFERENCES `emote` (`id`),
  CONSTRAINT `FKaceh2lu2tcie2wk7wsklsehim` FOREIGN KEY (`fk_party`) REFERENCES `party` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `party_message`
--

LOCK TABLES `party_message` WRITE;
/*!40000 ALTER TABLE `party_message` DISABLE KEYS */;
INSERT INTO `party_message` VALUES (1,'2023-05-28 10:55:22.766827','','notmi',1,1),(2,'2023-05-28 11:19:39.010453','sick pfp','maiol',NULL,1),(3,'2023-05-28 11:19:44.032533','','maiol',4,1),(4,'2023-05-28 11:20:35.508191','thanks you to ','notmi',NULL,1),(5,'2023-05-28 11:20:39.800008','','notmi',5,1);
/*!40000 ALTER TABLE `party_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `raid`
--

DROP TABLE IF EXISTS `raid`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `raid` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image` varchar(255) DEFAULT NULL,
  `lvl` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `raid`
--

LOCK TABLES `raid` WRITE;
/*!40000 ALTER TABLE `raid` DISABLE KEYS */;
INSERT INTO `raid` VALUES (1,'raid/1685297928008_artworks-zmkclXZUNzixn6UO-7RDtKA-t500x500.jpg',60,'Alexander - The Burden of the Son (Savage)',_binary ''),(2,'raid/1685297696544_The_Second_Coil_of_Bahamut_-_Turn_4.png',60,'The Second Coil of Bahamut',_binary ''),(3,'raid/1685295722951_Alexander_-_The_Soul_of_the_Creator_(Savage) (1).png',60,'Alexander - The Soul of the Creator (Savage)',_binary '');
/*!40000 ALTER TABLE `raid` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `avatar_path` varchar(255) DEFAULT NULL,
  `email` varchar(60) NOT NULL,
  `nickname` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` varchar(100) NOT NULL,
  `username` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_ob8kqyqqgmefl0aco34akdtpe` (`email`),
  UNIQUE KEY `UK_sb8bbouer5wak8vyiiy4pf2bx` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,NULL,'admin@admin.com','admin','21232f297a57a5a743894a0e4a801fc3','standar','admin'),(2,'uploads/1685293846061_ccfde834b75cd9fbc4af8f7eea464d4f.png','maiol@maiol.com','maiol','5f0ad77b699eac25ce0d04e3a4ae4271','standar','maiol'),(3,NULL,'eloi@eloi.com','eloi','3d43405a2720862f368745afa50793b4','standar','eloi'),(4,'uploads/1685296413629_5cefa3040a557252ee1da26fe4ab3fb8.png','notmi@notmi.com','notmi','ea7bbd520580f7d2c2c707ca35931bc5','standar','notmi');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-28 11:33:42
