# Documentacion de Ejecucion y Pruebas — Tin Cadena Backend

Este documento describe como configurar, ejecutar y probar la aplicacion backend [Spring Boot y PostgreSQL], tanto en entorno local como en pruebas automatizadas.

---

## Requisitos

- Java 17
- Maven 3.8+ [o utilizar ./mvnw incluido]
- PostgreSQL 14+ [recomendado version 16]

---

## Configuracion de Base de Datos

La aplicacion se conecta a PostgreSQL. La configuracion se encuentra en:

- src/main/resources/application.properties

Propiedades relevantes:

- spring.datasource.url
- spring.datasource.username
- spring.datasource.password

### Ejecucion con PostgreSQL Local

1. Asegurate de tener el servicio de PostgreSQL en ejecucion.
2. Crear la base de datos:

```sql
CREATE DATABASE photo_market;
```

3. Ajustar el archivo application.properties para usar tu instancia local. Ejemplo:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/photo_market
spring.datasource.username=postgres
spring.datasource.password=postgres
```

---

## Inicializacion Automatica de Datos

Al iniciar, la aplicacion ejecuta scripts SQL desde src/main/resources/:

- schema.sql
- data.sql

Estos scripts crean o actualizan tablas y cargan el catalogo inicial de obras fotograficas de Alvaro Cadena.

---

## Ejecucion del Proyecto

Desde el directorio tin-cadena-backend:

```bash
./mvnw spring-boot:run
```

El servidor quedara disponible en:
http://localhost:8085

---

## Usuarios de Prueba Disponibles

Administrador por defecto:
- Usuario: admin
- Contraseña: admin

Otros perfiles de prueba [cargados por data.sql]:
- Fotografo: ansel.duarte / password
- Comprador: maria.gonzalez / password

---

## Endpoints API REST

La aplicacion expone los servicios REST en el puerto 8085 bajo el prefijo /api:

### Autenticacion
- POST /api/auth/login [Generar Token JWT]
- POST /api/auth/register [Registro de nuevos compradores]

### Catalogo y Ventas
- GET, POST /api/photographs [Listar y registrar fotografias de Alvaro Cadena]
- GET, PUT, DELETE /api/photographs/{id} [Detalle, actualizacion y borrado de obras]
- GET, POST /api/sales [Historial de ordenes y procesamiento transaccional]
- GET /api/sales/{id}/certificate [Descarga de certificado PDF con firma del artista]

### Modulo de Usuarios, Roles y Permisos
- GET, POST /api/users [Listado y alta de usuarios]
- GET, PUT, DELETE /api/users/{id} [Mantenimiento por identificador]
- GET, POST /api/roles [Gestion de roles del sistema]
- GET, POST /api/permissions [Catalogo de permisos de acceso]

---

## Pruebas de API con Postman

Se incluye la coleccion oficial para importacion:
- Archivo: PhotoMarket_REST_API.postman_collection.json

Flujo sugerido:
1. Ejecutar la peticion de autenticacion Login [Get JWT] con credenciales admin / admin.
2. Utilizar el token retornado en las cabeceras Authorization de las peticiones subsiguientes.

---

## Pruebas Tecnicas Automatizadas

### Ejecutar Pruebas Unitarias
```bash
./mvnw test
```

### Reporte de Cobertura JaCoCo
```bash
./mvnw jacoco:report
```
Ubicacion del reporte generado: target/site/jacoco/index.html

---

## Solucion de Problemas

### Puerto 8085 en Uso
Si el puerto 8085 esta ocupado por otra instancia, se puede liberar en macOS o Linux con:
```bash
lsof -ti:8085 | xargs kill -9
```

### Problemas de Conexion a Base de Datos
- Verificar que el servicio PostgreSQL este activo y que la base de datos photo_market haya sido creada.
- Revisar que usuario y contraseña en application.properties coincidan con los de tu entorno local.
