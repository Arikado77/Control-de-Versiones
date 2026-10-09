# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Requisitos
- Node.js 20 o superior
- Git
- Credenciales de Supabase (las proporciona el equipo; **no se suben al repositorio**)

## Cómo ejecutar el proyecto

### 1. Clonar el repositorio
```bash
git clone https://github.com/Arikado77/Control-de-Versiones.git
cd Control-de-Versiones
git checkout develop
```

### 2. Backend
```bash
cd backend
npm install
```
Crea el archivo `backend/.env` a partir de `.env.example` y llena las variables:
```
PORT=3000
SUPABASE_URL=<url del proyecto>
SUPABASE_SERVICE_KEY=<service role key>
```
Inicia el servidor:
```bash
npm run dev
```
La API queda en `http://localhost:3000/api`.

### 3. Frontend
En otra terminal:
```bash
cd frontend
npm install
npm run dev
```
La aplicación queda en `http://localhost:5173`.

## Estructura del proyecto
```
backend/    API con Node.js y Express
frontend/   Interfaz con React y Vite
database/   Esquema SQL de Supabase
```

## Flujo de trabajo
Se utiliza **Git Flow**: `main` (versiones estables), `develop` (integración) y ramas `feature/*` por funcionalidad. Todo cambio entra mediante Pull Request revisado por otro integrante. Las reglas completas se documentarán en este repositorio.