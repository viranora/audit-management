# Build aşaması
FROM gradle:8.7-jdk21-alpine AS builder
WORKDIR /app
COPY . .
RUN gradle build --no-daemon

# Production aşaması
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]