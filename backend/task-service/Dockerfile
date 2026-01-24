FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy parent pom
COPY ../pom.xml ./pom.xml

# Copy shared module
COPY ../shared ./shared

# Copy task-service
COPY ./pom.xml ./task-service/pom.xml
COPY ./src ./task-service/src

# Build
WORKDIR /app/task-service
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /app/task-service/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
