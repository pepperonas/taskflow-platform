FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy parent pom
COPY ../pom.xml ./pom.xml

# Copy shared module
COPY ../shared ./shared

# Copy notification-service
COPY ./pom.xml ./notification-service/pom.xml
COPY ./src ./notification-service/src

# Build
WORKDIR /app/notification-service
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /app/notification-service/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
