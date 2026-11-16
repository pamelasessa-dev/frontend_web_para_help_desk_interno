# Help Desk Interno – Frontend

Aplicación web para la gestión de solicitudes de soporte técnico interno. Este repositorio contiene el frontend desarrollado con React, TypeScript y Vite.

## Tecnologías

- React
- TypeScript
- Vite
- React Router DOM
- Axios
- React Hook Form
- Zod
- Recharts
- Lucide React

## Requisitos previos

Antes de instalar el proyecto, necesitás tener:

- Node.js instalado (versión LTS recomendada).
- npm.
- Git.
- Visual Studio Code (recomendado).

Podés comprobar las instalaciones con:

```bash
node -v
npm -v
git --version
```

## Instalación

1. Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

2. Entrar en la carpeta del proyecto:

```bash
cd frontend_web_para_help_desk_interno
```

3. Instalar las dependencias:

```bash
npm install
```

4. Crear el archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000
```

**Importante:** la URL y el puerto deben coincidir con la configuración real del backend.

5. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

6. Abrir en el navegador la dirección que indique Vite en la terminal, normalmente:

```text
http://localhost:5173
```

## Estructura del proyecto

```text
src/
├── assets/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── tickets/
│   └── categories/
├── context/
├── hooks/
├── layouts/
├── pages/
│   ├── auth/
│   ├── dashboard/
│   ├── tickets/
│   ├── categories/
│   └── users/
├── routes/
├── services/
├── types/
└── utils/
```

## Configuración del backend

El frontend se comunica con una API independiente desarrollada con NestJS.

La dirección de conexión se configura mediante la variable:

```env
VITE_API_URL=
```

No subir archivos `.env` con información privada al repositorio. Para compartir la configuración, utilizar un archivo `.env.example` sin credenciales ni secretos.

## Trabajo en equipo

Para mantener el código organizado:

- `main`: versión estable.
- `develop`: integración del trabajo del equipo.
- `feat/nombre-funcionalidad`: nuevas funcionalidades.

Realizar los cambios en ramas propias y enviar Pull Requests hacia `develop`.

No trabajar directamente sobre `main`.

## Comandos disponibles

```bash
npm run dev       # Iniciar desarrollo
npm run build     # Compilar el proyecto
npm run preview   # Previsualizar la compilación
```

## Equipo

Proyecto académico colaborativo – Help Desk Interno.
