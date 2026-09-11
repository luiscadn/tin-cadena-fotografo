# Tin Cadena Frontend — Aplicacion Web SPA

Cliente web para la plataforma de fotografia fine art del fotografo profesional Alvaro Cadena, desarrollada con React 19, TypeScript, Vite, TailwindCSS y Redux Toolkit.

---

## Descripcion de la Aplicacion

Interfaz de usuario interactiva y responsiva disenada para exhibir y comercializar las piezas fotograficas de Alvaro Cadena. Provee configuracion de acabados a medida, simulador visual de obras a escala sobre paredes reales, gestion de favoritos, carrito de compras, pasarela mock de pago con generacion de certificados y recepcion en tiempo real de notificaciones via WebSockets STOMP.

---

## Pila Tecnologica

- Framework Web: React 19.2.6
- Empaquetador y Servidor Dev: Vite 8.0.14
- Lenguaje: TypeScript 6.0
- Enrutamiento: React Router 7.16
- Administrador de Estado Global: Redux Toolkit 2.12 y Redux Persist
- Estilos y Diseno: TailwindCSS 3.4 y DaisyUI 4.12
- Cliente HTTP: Axios 1.16
- Conexion en Tiempo Real: STOMPjs 7.3 y SockJS Client 1.6
- Documentos: jsPDF 4.2

---

## Estructura de Componentes Principales

- src/components/RoomView.tsx: Simulador inmersivo que escala la obra dentro de escenarios como Sala de estar o Lobby para evaluar proporciones antes de comprar.
- src/components/VariantConfigurator.tsx: Selector dinamico de materiales museum-grade [TruLife Acrylic, ChromaLuxe Metal] y tamanos [Classic, Statement, Collector] con ajuste automatico del precio total.
- src/components/PhotographForm.tsx: Formulario administrativo para alta y edicion de fotografias con metadatos tecnicos de captura.
- src/components/SidebarLayout.tsx: Estructura general de navegacion con barra lateral y panel de usuario.
- src/pages/Explore.tsx: Galeria publica con filtros avanzados por categorias y busqueda.
- src/pages/Checkout.tsx: Flujo de finalizacion de ordenes de compra.
- src/pages/Purchases.tsx: Historial de pedidos y acceso a certificados de autenticidad.
- src/pages/AdminDashboard.tsx: Panel centralizado de administracion para gestion del catalogo de Alvaro Cadena.

---

## Variables de Entorno

La configuracion se administra a traves del archivo .env en la raiz de tin-cadena-frontend:

```env
# URL de la API REST del backend
VITE_API_BASE_URL=http://localhost:8085/api

# URL del endpoint de WebSocket STOMP
VITE_WS_URL=http://localhost:8085/ws

# Ruta base de la aplicacion
VITE_BASE_PATH=/
```

---

## Instrucciones de Ejecucion

Ubicarse en la carpeta del frontend:
```bash
cd tin-cadena-frontend
```

Instalar dependencias:
```bash
npm install
```

Iniciar servidor de desarrollo en http://localhost:5173:
```bash
npm run dev
```

Validar tipos con TypeScript:
```bash
npm run type-check
```

Compilar para produccion en directorio dist/:
```bash
npm run build
```

Ejecutar analisis de linter:
```bash
npm run lint
```
