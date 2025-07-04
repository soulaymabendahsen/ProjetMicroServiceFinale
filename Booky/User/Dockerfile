FROM openjdk:17

# Expose le port du microservice
EXPOSE 8081

# Copie et renomme le JAR final
ADD target/User-1.0-SNAPSHOT.jar user-service.jar

# Lance l'application
ENTRYPOINT ["java", "-jar", "user-service.jar"]
