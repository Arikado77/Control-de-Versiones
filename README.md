# Sistema de Gestión de Tareas

Aplicación web para administrar las tareas de un equipo de trabajo: registrar, consultar, modificar, eliminar, asignar responsable, y manejar estado y prioridad.

## Tabla de contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Stack](#stack)
- [Requisitos](#requisitos)
- [Puesta en marcha](#puesta-en-marcha)
- [Uso](#uso)
- [API](#api)
- [Datos](#datos)
- [Estructura](#estructura)
- [Contribución](#contribución)
- [Equipo](#equipo)

## Descripción

El equipo registra su trabajo en un tablero. Cada tarea tiene título, descripción, estado, prioridad y, cuando corresponde, un responsable.

La interfaz está hecha con React. Las peticiones pasan por una API en Express y los datos viven en Supabase (PostgreSQL). En desarrollo, Vite reenvía `/api` a `http://localhost:3000`.

## Características

- Alta de tareas con título, descripción, estado y prioridad.
- Listado ordenado de la más reciente a la más antigua.
- Filtro por estado, por responsable o por ambos.
- Edición de título, descripción, estado y prioridad.
- Eliminación desde el listado.
- Consulta de responsables para el filtro.
- Asignación de responsable por API con `responsable_id`.

**Estados:** `Pendiente` · `En proceso` · `Terminada`. Valor inicial: `Pendiente`.

**Prioridades:** `Baja` · `Media` · `Alta`. Valor inicial: `Media`.

## Stack

| Capa | Tecnología |
| --- | --- |
| Interfaz | React 19, React Router, Vite |
| API | Node.js, Express 5 |
| Datos | Supabase (PostgreSQL) |
| Versiones | Git, GitHub, Git Flow |

## Requisitos

- Node.js 20 o superior
- npm
- Git
- Proyecto de Supabase con las tablas `tareas` y `usuarios`

Las credenciales no van al repositorio. Cada integrante las guarda en `backend/.env`.

## Puesta en marcha

Se usan dos terminales. La API tiene que estar en ejecución para que la interfaz cargue y guarde tareas.

### 1. Clonar

```bash
git clone https://github.com/Arikado77/Control-de-Versiones.git
cd Control-de-Versiones
git checkout develop
```

### 2. Configurar el backend

```bash
cd backend
npm install
```

Copia `backend/.env.example` a `backend/.env` y completa los valores:

```env
PORT=3000
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_KEY=tu_service_role_key
```

| Variable | Uso |
| --- | --- |
| `PORT` | Puerto de la API. Si falta, usa `3000`. |
| `SUPABASE_URL` | URL del proyecto en Supabase. |
| `SUPABASE_SERVICE_KEY` | Llave con la que la API lee y escribe. |

### 3. Levantar la API

```bash
npm run dev
```

Disponible en `http://localhost:3000/api`. `npm run dev` recarga al cambiar el código. `npm start` arranca sin esa recarga.

### 4. Levantar la interfaz

En otra terminal, desde la raíz del proyecto:

```bash
cd frontend
npm install
npm run dev
```

Disponible en `http://localhost:5173`.

| Comando | Resultado |
| --- | --- |
| `npm run build` | Genera la versión de producción en `frontend/dist` |
| `npm run preview` | Sirve esa versión |
| `npm run lint` | Revisa el código con ESLint |

## Uso

| Ruta | Pantalla |
| --- | --- |
| `/` | Listado, filtros, modificar y eliminar |
| `/nueva` | Registro de una tarea |
| `/editar/:id` | Edición de una tarea existente |

## API

Base: `http://localhost:3000/api`

### Tareas

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/tasks` | Lista las tareas. Acepta `estado` y `responsable_id` |
| `POST` | `/tasks` | Crea una tarea. `titulo` es obligatorio |
| `GET` | `/tasks/:id` | Devuelve una tarea |
| `PUT` | `/tasks/:id` | Actualiza los campos enviados |
| `DELETE` | `/tasks/:id` | Elimina una tarea |

Crear:

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Revisar el informe del viernes",
    "descripcion": "Validar cifras antes de la junta",
    "estado": "Pendiente",
    "prioridad": "Alta",
    "responsable_id": 1
  }'
```

Filtrar:

```bash
curl "http://localhost:3000/api/tasks?estado=En%20proceso&responsable_id=1"
```

`PUT /tasks/:id` acepta `titulo`, `descripcion`, `estado`, `prioridad` y `responsable_id`. Un estado o una prioridad fuera de la lista se rechaza. Un `responsable_id` que no exista en `usuarios` también.

### Usuarios

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/users` | Responsables (`id`, `nombre`), ordenados por nombre |

## Datos

**usuarios:** `id`, `nombre`, `correo`.

**tareas:** `id`, `titulo`, `descripcion`, `estado`, `prioridad`, `responsable_id`, `creado_en`.

`responsable_id` referencia a `usuarios.id` y puede ir vacío. El listado muestra el nombre del responsable cuando la tarea tiene uno.

## Estructura

```text
Control-de-Versiones/
├── backend/
│   ├── src/
│   │   ├── config/         Cliente de Supabase
│   │   ├── controllers/    Tareas y usuarios
│   │   ├── domain/         Estado y prioridad permitidos
│   │   ├── routes/         /api/tasks y /api/users
│   │   ├── app.js          Express, CORS y JSON
│   │   └── server.js       Arranque del servidor
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/            Cliente HTTP
│   │   ├── components/     Filtros, estado y prioridad
│   │   ├── constants/      Valores de la interfaz
│   │   ├── pages/          Consulta, alta y edición
│   │   └── App.jsx         Navegación y rutas
│   └── package.json
├── docs/                   Capturas
└── .github/                Plantilla de Pull Request
```

Quedan fuera del repositorio `node_modules/`, `dist/` y los archivos `.env`.

## Contribución

Git Flow.

| Rama | Uso |
| --- | --- |
| `main` | Versión estable |
| `develop` | Integración |
| `feature/*` | Una funcionalidad, creada desde `develop` |

El cambio entra por Pull Request y lo revisa otro integrante. La plantilla pide qué cambia, cómo probarlo y el issue (`closes #`).

```bash
git checkout develop
git pull
git checkout -b feature/nombre-de-la-funcionalidad
```

## Equipo

- Jose Christian Sanchez Arguello
- Alonso Yahir Molina Cota
- Carlos Eduardo Arikado Marquez
- Axel Noe Nunez Vargas
- Alonso Alfredo Vazques Beltran
