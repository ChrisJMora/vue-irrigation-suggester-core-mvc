# Frontend para Sugerencia de Cronogramas de Riego con Vue.js

Este proyecto es el frontend para un sistema de sugerencias de cronogramas de riego, desarrollado con **Vue.js**. La aplicación permite gestionar cultivos, consultar pronósticos de lluvia, revisar sensores de humedad, y acceder a cronogramas sugeridos para optimizar el riego.

## Instalación

1. Clona el repositorio:
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    ```

2. Navega al directorio del proyecto:
    ```bash
    cd <NOMBRE_DEL_PROYECTO>
    ```

3. Instala las dependencias:
    ```bash
    npm install
    ```

4. Ejecuta la aplicación localmente:
    ```bash
    npm run dev
    ```

## Dependencias

Este proyecto utiliza las siguientes dependencias principales:
- **Vue.js 3**: Framework principal para la interfaz de usuario.
- **Vue Router**: Manejo de rutas en la aplicación.
- **Axios**: Realización de peticiones HTTP hacia el backend.

## Estructura de Vistas

La aplicación incluye las siguientes vistas principales:

- **CropsView**: Administración de cultivos.
- **ForecastsView**: Consulta de pronósticos de lluvia.
- **SchedulesView**: Gestor de cronogramas.
- **SensorsView**: Monitoreo de sensores de humedad.
- **SuggestedSchedulesView**: Revisión de cronogramas sugeridos basados en los datos de sensores y pronósticos.

Además, incluye una pantalla de **login** para los roles de **Administrador** y **Supervisor**.

### Credenciales de Acceso

- **Usuario**: admin1
- **Contraseña**: password1

## Backend

El backend para este proyecto está desarrollado con **Spring Framework** y está disponible en el siguiente repositorio:

- **Repositorio del Backend**: [https://github.com/ChrisJMora/spring-irrigation-suggester-mini-core-mvc.git](https://github.com/ChrisJMora/spring-irrigation-suggester-mini-core-mvc.git)

## Enlace de la Aplicación

El frontend está desplegado en Netlify y puede ser accedido desde el siguiente enlace:

- **Frontend**: [https://irrigation-suggester-mini-core.netlify.app/login](https://irrigation-suggester-mini-core.netlify.app/login)

## Funcionalidades

La aplicación incluye las siguientes funcionalidades principales:

- **Inicio de sesión**: Acceso para Administradores y Supervisores.
- **Administración de cultivos**: Crear, editar y eliminar información de cultivos.
- **Consulta de pronósticos**: Visualización de datos climáticos relevantes.
- **Gestor de sensores**: Revisar y monitorear el porcentaje de humedad en tiempo real.
- **Cronogramas sugeridos**: Generar y visualizar sugerencias óptimas para el riego según los datos disponibles.

---
