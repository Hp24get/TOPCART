# Stage 1: Build the React Frontend
FROM node:20 AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Spring Boot Backend
FROM maven:3.9.6-eclipse-temurin-21 AS build-backend
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Copy the built React app into the static resources directory of Spring Boot
COPY --from=build-frontend /app/src/main/resources/static /app/src/main/resources/static
RUN mvn clean package -DskipTests

# Stage 3: Provide Runtime Environment
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Copy the packaged jar from the backend build stage
COPY --from=build-backend /app/target/topcart-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
