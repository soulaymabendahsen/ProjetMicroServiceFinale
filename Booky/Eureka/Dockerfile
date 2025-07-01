FROM openjdk:17

# Expose the Eureka port
EXPOSE 8761

# Copy the correct jar file and rename it inside the image
ADD target/Eureka-0.0.1-SNAPSHOT.jar Eureka.jar

# Run the jar file
ENTRYPOINT ["java", "-jar", "Eureka.jar"]
