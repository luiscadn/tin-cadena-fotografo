# -----------------------------------------------------------------------------
# Dockerfile Multietapa Optimizado para Tin Cadena Backend (Spring Boot 3 + Java 21)
# -----------------------------------------------------------------------------

# --- ETAPA 1: Compilación y empaquetado (Builder) ---
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /build

# Copiar archivos del wrapper de Maven y el pom.xml para aprovechar el caché de Docker
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Dar permisos de ejecución al script mvnw
RUN chmod +x mvnw

# Descargar dependencias (capa cacheada)
RUN ./mvnw dependency:go-offline -B || true

# Copiar el código fuente
COPY src/ src/

# Compilar y empaquetar el JAR ejecutable omitiendo tests para acelerar el despliegue
RUN ./mvnw clean package -DskipTests -B

# --- ETAPA 2: Entorno de ejecución ligero (Runner) ---
FROM eclipse-temurin:21-jre-alpine AS runner

WORKDIR /app

# Crear usuario sin privilegios root por seguridad
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copiar únicamente el archivo JAR generado desde la etapa de construcción
COPY --from=builder /build/target/tin-cadena-backend-0.0.1-SNAPSHOT.jar app.jar

# Puerto por defecto (8085), pero configurable dinámicamente con la variable $PORT de Render/Railway
ENV PORT=8085
EXPOSE 8085

# Ejecutar Spring Boot escuchando en el puerto asignado dinámicamente por la nube ($PORT)
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
