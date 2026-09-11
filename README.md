# Tin Cadena Fotografo — Fine Art Photography Platform

Plataforma integral de galeria, comercio electronico de arte fino y gestion de catalogo para el artista y fotografo profesional Alvaro "Tin" Cadena, radicado en Miami.

---

## Estructura del Monorepo

```text
TinCadenaFotografo/
├── .gitignore                  — Exclusion de archivos temporales, node_modules y target —
├── README.md                   — Documentacion general de la plataforma —
├── tin-cadena-backend/         — Servidor API REST, Seguridad JWT, WebSockets y PDF con Spring Boot —
└── tin-cadena-frontend/        — Aplicacion Web SPA con React 19, TypeScript, Vite y TailwindCSS —
```

---

## Puesta en Marcha Rapida

### 1. Backend [Spring Boot]
Requisitos: Java 17+, PostgreSQL [base de datos: photo_market, usuario: postgres, clave: postgres].

Para compilar y ejecutar el servidor:
```bash
cd tin-cadena-backend
./mvnw spring-boot:run
```
El servidor estara disponible en el puerto 8085:
http://localhost:8085/api

Para correr pruebas unitarias:
```bash
cd tin-cadena-backend
./mvnw test
```

### 2. Frontend [React + Vite]
Requisitos: Node.js 18+

Para instalar dependencias y levantar el entorno de desarrollo:
```bash
cd tin-cadena-frontend
npm install
npm run dev
```
La aplicacion estara disponible en el puerto 5173:
http://localhost:5173

Para validar tipos y generar el paquete de produccion:
```bash
cd tin-cadena-frontend
npm run type-check
npm run build
```

---

## Caracteristicas y Logica de Negocio

- Autenticacion Multi-Rol: JWT con Spring Security para Administrador, Fotografo y Compradores.
- Catalogo de Fotografia Fine Art: Metadatos tecnicos detallados [camara, lente, velocidad de obturacion, apertura, ISO, historia y coordenadas geograficas].
- Configurador de Variantes Dinamicas: Opciones de materiales museum-grade [TruLife Acrylic, ChromaLuxe Metal] y tamanos [Classic, Statement, Collector] con recalculo de precios en tiempo real.
- Control de Ediciones Limitadas: Contador atomico de copias y bloqueo automatico Sold Out una vez alcanzado el cupo.
- Visualizador Inmersivo Room View: Previsualizacion interactiva de las obras a escala en ambientes prediseñados [Living Room, Lobby].
- Certificados de Autenticidad: Generacion automatica de certificados PDF con numero de serie unico por cada copia vendida.
- Comunicacion en Tiempo Real: Notificaciones STOMP via WebSockets para avisos de inventario y compras en caliente.

---

## Variables de Entorno en Frontend

El cliente web cuenta con configuracion dinamica mediante variables de entorno en tin-cadena-frontend/.env:

- VITE_API_BASE_URL: URL del API REST [por defecto http://localhost:8085/api]
- VITE_WS_URL: URL del canal WebSocket [por defecto http://localhost:8085/ws]
- VITE_BASE_PATH: Prefijo de rutas [por defecto /]

---

## Vinculacion con Repositorio Remoto

Para vincular este monorepo a tu cuenta de GitHub:

```bash
git add .
git commit -m "feat: inicializar monorepo TinCadenaFotografo con backend y frontend limpios"
git remote add origin git@github.com:<tu-usuario>/TinCadenaFotografo.git
git branch -M main
git push -u origin main
```
