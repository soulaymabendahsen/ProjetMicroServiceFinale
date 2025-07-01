FROM openjdk:17
EXPOSE 8085
ADD target/bookstore-0.0.1-SNAPSHOT.jar Payment.jar
ENTRYPOINT ["java","-jar","Payment.jar"]