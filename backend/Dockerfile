FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /workspace

COPY pom.xml .
RUN mvn -B -DskipTests dependency:go-offline

COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

RUN addgroup -S smartworkspace \
    && adduser -S smartworkspace -G smartworkspace \
    && mkdir -p /app/uploads/products \
    && mkdir -p /app/logs \
    && chown -R smartworkspace:smartworkspace /app

COPY --from=build /workspace/target/*.jar /app/app.jar

USER smartworkspace

ENV JAVA_OPTS=""
ENV PRODUCT_IMAGE_UPLOAD_DIR=/app/uploads/products

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
