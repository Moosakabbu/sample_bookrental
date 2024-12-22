-- MySQL dump 10.13  Distrib 8.0.40, for macos14 (arm64)
--
-- Host: localhost    Database: book_ordering
-- ------------------------------------------------------
-- Server version	9.1.0

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
-- Table structure for table `Books`
--

DROP TABLE IF EXISTS `Books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Books` (
  `bookID` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `genre` varchar(50) DEFAULT NULL,
  `rentalPrice` double DEFAULT NULL,
  `availability` tinyint(1) DEFAULT NULL,
  `imagePath` varchar(255) DEFAULT NULL,
  `categoryID` int DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`bookID`),
  KEY `FK_Books_Categories` (`categoryID`),
  CONSTRAINT `FK_Books_Categories` FOREIGN KEY (`categoryID`) REFERENCES `Categories` (`categoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Books`
--

LOCK TABLES `Books` WRITE;
/*!40000 ALTER TABLE `Books` DISABLE KEYS */;
INSERT INTO `Books` VALUES (1,'The Hobbits','J.R.R. Tolkien','Fantasy',3.99,1,'/images/the-hobbit.jpg',1,0),(2,'Harry Potter and the Sorcerer\'s Stone','J.K. Rowling','Fantasy',4.98,1,'/images/harry-potter.jpg',1,0),(3,'1984','George Orwell','Science Fiction',2.99,1,'/images/1984.jpg',5,0),(4,'The Great Gatsby','F. Scott Fitzgerald','Literature',2.49,1,'/images/great-gatsby.jpg',1,0),(5,'To Kill a Mockingbird','Harper Lee','Fiction',3.49,1,'/images/mockingbird.jpg',1,0),(6,'Pride and Prejudice','Jane Austen','Romance',3.99,1,'/images/pride-prejudice.jpg',3,0),(7,'The Hunger Games','Suzanne Collins','Young Adult',4.48,1,'/images/hunger-games.jpg',6,0),(8,'The Alchemist','Paulo Coelho','Literature',3.99,1,'/images/alchemist.jpg',1,0),(9,'LOL','me','Romance',20,1,'/images/hunger-games.jpg',1,1);
/*!40000 ALTER TABLE `Books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Cart`
--

DROP TABLE IF EXISTS `Cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Cart` (
  `cartID` int NOT NULL AUTO_INCREMENT,
  `userID` int DEFAULT NULL,
  `bookID` int NOT NULL,
  `quantity` int DEFAULT '1',
  `addedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cartID`),
  KEY `bookID` (`bookID`),
  KEY `cart_ibfk_1` (`userID`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `Users` (`userID`),
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`bookID`) REFERENCES `Books` (`bookID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Cart`
--

LOCK TABLES `Cart` WRITE;
/*!40000 ALTER TABLE `Cart` DISABLE KEYS */;
INSERT INTO `Cart` VALUES (11,NULL,8,1,'2024-12-22 08:54:10');
/*!40000 ALTER TABLE `Cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Categories`
--

DROP TABLE IF EXISTS `Categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Categories` (
  `categoryID` int NOT NULL AUTO_INCREMENT,
  `categoryName` varchar(100) NOT NULL,
  PRIMARY KEY (`categoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Categories`
--

LOCK TABLES `Categories` WRITE;
/*!40000 ALTER TABLE `Categories` DISABLE KEYS */;
INSERT INTO `Categories` VALUES (1,'Fiction'),(2,'Non-Fiction'),(3,'Romance'),(4,'Mystery'),(5,'Science Fiction'),(6,'Young Adult');
/*!40000 ALTER TABLE `Categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Deliveries`
--

DROP TABLE IF EXISTS `Deliveries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Deliveries` (
  `deliveryID` int NOT NULL AUTO_INCREMENT,
  `orderID` int NOT NULL,
  `courierService` varchar(255) DEFAULT NULL,
  `trackingNumber` varchar(255) DEFAULT NULL,
  `deliveryStatus` varchar(50) DEFAULT NULL,
  `estimatedDeliveryDate` date DEFAULT NULL,
  PRIMARY KEY (`deliveryID`),
  KEY `orderID` (`orderID`),
  CONSTRAINT `deliveries_ibfk_1` FOREIGN KEY (`orderID`) REFERENCES `Orders` (`orderID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Deliveries`
--

LOCK TABLES `Deliveries` WRITE;
/*!40000 ALTER TABLE `Deliveries` DISABLE KEYS */;
/*!40000 ALTER TABLE `Deliveries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Favorites`
--

DROP TABLE IF EXISTS `Favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Favorites` (
  `favoriteID` int NOT NULL AUTO_INCREMENT,
  `userID` int NOT NULL,
  `bookID` int NOT NULL,
  `addedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`favoriteID`),
  KEY `userID` (`userID`),
  KEY `bookID` (`bookID`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `Users` (`userID`),
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`bookID`) REFERENCES `Books` (`bookID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Favorites`
--

LOCK TABLES `Favorites` WRITE;
/*!40000 ALTER TABLE `Favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `Favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Orders`
--

DROP TABLE IF EXISTS `Orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Orders` (
  `orderID` int NOT NULL AUTO_INCREMENT,
  `userID` int DEFAULT NULL,
  `bookID` int NOT NULL,
  `orderDate` date DEFAULT NULL,
  `rentalPeriod` int DEFAULT NULL,
  `paymentStatus` varchar(50) DEFAULT NULL,
  `deliveryStatus` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`orderID`),
  KEY `bookID` (`bookID`),
  KEY `orders_ibfk_1` (`userID`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `Users` (`userID`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`bookID`) REFERENCES `Books` (`bookID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Orders`
--

LOCK TABLES `Orders` WRITE;
/*!40000 ALTER TABLE `Orders` DISABLE KEYS */;
INSERT INTO `Orders` VALUES (1,NULL,3,'2024-12-22',NULL,'PENDING','PENDING'),(2,NULL,8,'2024-12-22',NULL,'PENDING','PENDING'),(4,NULL,8,'2024-12-22',NULL,'PENDING','PENDING'),(5,NULL,7,'2024-12-22',NULL,'PENDING','PENDING');
/*!40000 ALTER TABLE `Orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Payments`
--

DROP TABLE IF EXISTS `Payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Payments` (
  `paymentID` int NOT NULL AUTO_INCREMENT,
  `orderID` int NOT NULL,
  `paymentAmount` float DEFAULT NULL,
  `paymentMethod` varchar(50) DEFAULT NULL,
  `paymentStatus` varchar(50) DEFAULT NULL,
  `transactionDate` date DEFAULT NULL,
  PRIMARY KEY (`paymentID`),
  KEY `orderID` (`orderID`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`orderID`) REFERENCES `Orders` (`orderID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Payments`
--

LOCK TABLES `Payments` WRITE;
/*!40000 ALTER TABLE `Payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `Payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `deliveryAddress` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-22 14:08:35
