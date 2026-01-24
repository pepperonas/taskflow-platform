FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build

# Copy everything needed for build
COPY . .

# Build
WORKDIR /build
RUN mvn clean package -DskipTests -pl task-service -am

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /build/task-service/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
