# Tin Cadena Backend — Servidor de Galeria y Marketplace Fine Art

Servidor de servicios RESTful, persistencia de datos y mensajeria en tiempo real para la plataforma del artista y fotografo profesional Alvaro Cadena, radicado en Miami.

---

## Descripcion General

Plataforma especializada en la gestion y comercializacion de obras fotograficas exclusivas de Alvaro Cadena. Provee autenticacion basada en tokens JWT, configuracion dinamica de acabados museum-grade [TruLife Acrylic y ChromaLuxe Metal], control transaccional de ediciones limitadas para evitar sobreventas, generacion de certificados de autenticidad en formato PDF con seriales unicos y despacho de notificaciones via WebSockets STOMP.

---

## Pila Tecnologica

- Framework: Spring Boot 3.5.13
- Lenguaje: Java 17
- Seguridad: Spring Security 6 y JWT [io.jsonwebtoken jjwt 0.12.3]
- Persistencia y ORM: Spring Data JPA con Hibernate
- Motor de Base de Datos: PostgreSQL
- Mapeo de Entidades: MapStruct
- Generacion de Documentos: OpenPDF 2.0.2
- Mensajeria en Tiempo Real: Spring WebSocket con broker STOMP y SockJS
- Documentacion API: SpringDoc OpenAPI Swagger

---

## Arquitectura de Entidades y Logica de Negocio

1. Autenticacion y Roles:
   - Administrador: Gestion global de inventario, usuarios y roles.
   - Fotografo: Gestion y publicacion de sus piezas fotograficas.
   - Comprador: Visualizacion, seleccion de formatos y ordenes de compra.

2. Gestion de Catalogo Fine Art:
   - Entidad Photograph con metadatos tecnicos: camara, objetivo, apertura f-stop, velocidad de obturacion, sensibilidad ISO, ubicacion y descripcion historica de la captura.

3. Configurador de Variantes y Precios:
   - Materiales: TruLife Acrylic, ChromaLuxe Metal.
   - Medidas: Classic, Statement, Collector.
   - Calculo de costos de acabado sobre el precio base de la fotografia.

4. Control Transaccional de Copias:
   - Contador de ediciones limitadas administrado a nivel de servicio para garantizar consistencia transaccional. Al alcanzar el limite de la tirada, la obra queda marcada como Sold Out y el sistema rechaza compras adicionales arrojando PhotographAlreadySoldException.

5. Certificados de Autenticidad:
   - Generacion de certificados descargables mediante PdfService, sellados con el nombre del artista Alvaro Cadena y el identificador de venta.

6. WebSockets:
   - Publicacion instantanea en el canal /topic/sales al completarse una orden, permitiendo sincronizar el inventario visual de todos los compradores conectados.

---

## Configuracion de Base de Datos

El sistema se conecta a PostgreSQL mediante src/main/resources/application.properties:

- URL: jdbc:postgresql://localhost:5432/photo_market
- Usuario: postgres
- Contraseña: postgres
- Puerto del Servidor: 8081

---

## Instrucciones de Compilacion y Ejecucion

Ubicarse en el directorio del backend:
```bash
cd tin-cadena-backend
```

Para iniciar el servidor en modo desarrollo:
```bash
./mvnw spring-boot:run
```

Para compilar el proyecto:
```bash
./mvnw compile -DskipTests
```

Para ejecutar las pruebas automatizadas con JUnit 5 y Mockito:
```bash
./mvnw test
```

Para generar el reporte de cobertura de pruebas JaCoCo:
```bash
./mvnw jacoco:report
```

---

## Guia de Endpoints REST

La API expone sus servicios en el puerto 8081 con prefijo /api:

| Modulo | Endpoint | Metodos HTTP |
| :--- | :--- | :--- |
| Autenticacion | /api/auth/login | POST |
| Autenticacion | /api/auth/register | POST |
| Fotografias | /api/photographs | GET, POST |
| Fotografias | /api/photographs/{id} | GET, PUT, DELETE |
| Ventas | /api/sales | GET, POST |
| Usuarios | /api/users | GET, POST |
| Usuarios | /api/users/{id} | GET, PUT, DELETE |
| Roles | /api/roles | GET, POST |
| Permisos | /api/permissions | GET, POST |
| Certificados | /api/sales/{id}/certificate | GET |

---

## Creditos de Desarrollo Original

Proyecto academico original de Computacion en Internet II [Universidad Icesi]:
- Juan Esteban Cuellar
- Fabio Felipe Murillo Rivas
- Luis Felipe Cadena Cortés
