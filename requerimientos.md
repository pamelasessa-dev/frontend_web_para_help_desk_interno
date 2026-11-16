# Requerimientos del sistema – Help Desk Interno

## Descripción general

El sistema Help Desk Interno tiene como objetivo gestionar las solicitudes de soporte técnico de una organización mediante una aplicación web.

El proyecto está dividido en dos repositorios independientes:

- **Backend:** API desarrollada con NestJS, TypeScript y Prisma.
- **Frontend:** aplicación SPA desarrollada con React, TypeScript y Vite.

El frontend consumirá los servicios proporcionados por el backend.

## Roles de usuario

El sistema contempla tres roles:

| Rol     |  Responsabilidad                                 |
|---------|--------------------------------------------------|
| ADMIN   | Administración y supervisión general del sistema.|
| AGENTE  | Gestión y atención de tickets de soporte.        |
| EMPLEADO| Creación y seguimiento de sus propios tickets.   |

Los permisos de cada rol deberán respetarse tanto en la navegación como en las operaciones realizadas contra la API.

## Requerimientos funcionales

### Autenticación

- Permitir iniciar sesión mediante usuario y contraseña.
- Autenticar al usuario mediante JWT.
- Mantener la sesión del usuario.
- Proteger las rutas privadas.
- Restringir funcionalidades según el rol.
- Permitir cerrar sesión.

### Gestión de usuarios

- Obtener la información del usuario autenticado.
- Identificar el rol y los permisos correspondientes.
- Utilizar los datos del usuario para personalizar la aplicación.

### Gestión de categorías

- Visualizar las categorías disponibles.
- Crear categorías.
- Modificar categorías.
- Eliminar categorías.
- Restringir las operaciones según los permisos establecidos.

### Gestión de tickets

- Crear tickets de soporte.
- Visualizar los tickets propios.
- Consultar una bandeja general de tickets según los permisos.
- Filtrar tickets por estado y categoría.
- Consultar el detalle de un ticket.
- Asignar tickets a agentes.
- Actualizar el estado de los tickets.

Estados contemplados:

1. Abierto.
2. En Proceso.
3. Resuelto.
4. Cerrado.

### Comentarios

- Mostrar los comentarios asociados a un ticket.
- Permitir agregar comentarios.
- Presentar los comentarios en orden cronológico.
- Identificar al usuario que realizó cada comentario.

### Dashboard y métricas

- Mostrar indicadores generales de tickets.
- Visualizar tickets por estado.
- Presentar información relevante para administradores y agentes.
- Respetar los permisos de acceso a las métricas.

###  Notificaciones

- Informar al usuario sobre acciones importantes.
- Contemplar notificaciones en tiempo real mediante WebSocket, si la integración está disponible.
- Mostrar mensajes claros cuando una operación se complete o falle.

##  Estructura del backend

En el proyecto backend compartido se identificó la siguiente tecnología y organización:

| Elemento   | Comprobación                                |
|------------|---------------------------------------------|
| NestJS     | Proyecto backend identificado.              |
| TypeScript | Utilizado en el backend.                    |
| Prisma     | ORM identificado.                           |
| Prisma Schema | Archivo `prisma/schema.prisma` presente. |
| Migraciones   | Carpeta de migraciones presente.         |
| Auth          | Módulo de autenticación identificado.    |
| Users         | Módulo de usuarios identificado.         |
| Categories    | Módulo de categorías identificado.       |
| Ticket        | Módulo de tickets identificado.          |
| Comments      | Módulo de comentarios identificado.      |
| Notifications | Módulo de notificaciones identificado.   |


- Controladores y servicios.
- DTOs de autenticación.
- Estrategia JWT.
- Guards.
- Decorador de roles.
- Gateway de notificaciones.
- Servicio de Prisma.
- Seed de datos.


## Integración pendiente de verificar

Antes de implementar la conexión definitiva entre frontend y backend verificar:

- URL base y puerto de la API.
- Endpoint de inicio de sesión.
- Formato de las credenciales.
- Estructura de la respuesta JWT.
- Endpoint para obtener el usuario autenticado.
- Endpoints de usuarios y categorías.
- Endpoints de tickets y comentarios.
- Formato de los estados y roles.
- Reglas de autorización.
- Eventos y nombres de canales WebSocket.
- Formatos de errores y respuestas.

No se deben asumir nombres de endpoints ni estructuras de datos hasta revisar los controladores y DTOs correspondientes.

## Requerimientos no funcionales

- Interfaz responsive para computadoras, tablets y móviles.
- Código organizado por responsabilidades.
- Componentes reutilizables.
- Validación de formularios.
- Manejo de errores.
- Indicadores de carga.
- Control de acceso según roles.
- Comunicación centralizada con la API.
- Código tipado con TypeScript.
- Uso de Git y ramas para el trabajo colaborativo.

## Criterios de calidad

Se considerará que una funcionalidad está terminada cuando:

- Cumpla su objetivo funcional.
- Se comunique correctamente con el backend.
- Respete los permisos de usuario.
- Incluya validaciones.
- Maneje errores.
- Se visualice correctamente en distintos tamaños de pantalla.
- Haya sido probada antes de integrarse a la rama principal de desarrollo.

## Organización del trabajo

El equipo trabajará con ramas independientes y Pull Requests.

Ramas principales:

- `main`: versión estable.
- `develop`: integración.
- `feat/auth`: autenticación.
- `feat/tickets`: gestión de tickets.
- `feat/comments`: comentarios.
- `feat/categories`: categorías.
- `feat/dashboard`: dashboard.
- `feat/notifications`: notificaciones.

