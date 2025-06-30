FROM openjdk:17

# Expose the application port
EXPOSE 8095

# Copy and rename the actual JAR file
ADD target/GestionLivres-0.0.1-SNAPSHOT.jar GestionLivres.jar

# Run the application
ENTRYPOINT ["java", "-jar", "GestionLivres.jar"]
