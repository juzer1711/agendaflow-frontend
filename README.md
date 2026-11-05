# AgendaFlow · Panel web

Interfaz de administración para gestionar citas de una barbería. Forma parte del proyecto personal de aprendizaje [AgendaFlow](https://github.com/juzer1711/agendaflow) y consume su [backend](https://github.com/juzer1711/agendaflow-backend), también utilizado por la [skill de Alexa](https://github.com/juzer1711/agenda-flow-alexa).

> Proyecto educativo sin terminar. Puede contener errores y flujos incompletos. Requiere la API y una base de datos Oracle preparada para utilizar sus funciones.

## Tecnologías

React 18, JavaScript (JSX), Vite 6, Tailwind CSS 3, PostCSS, Autoprefixer, React Router 6, Axios y Lucide React. La autenticación y las notificaciones utilizan Context de React.

## Funcionalidades

| Vista | Operaciones |
| --- | --- |
| Acceso | Iniciar/cerrar sesión, proteger rutas y avisar de expiración tras un `401` |
| Citas | Consultar listados, citas del día y próximas; crear y cancelar |
| Servicios | Crear, editar y desactivar servicios con precio y duración |
| Clientes | Consultar y registrar datos personales, contacto y notas |
| Horarios | Consultar, crear y eliminar horarios semanales; consultar y crear excepciones |

Las excepciones incluyen días libres, vacaciones, bloqueos y horarios especiales. El formulario de citas calcula la hora final con la duración del servicio y envía `source: "ADMIN"`.

## Ejecutar localmente

Se recomienda Node.js 22 LTS y npm. Primero configura e inicia el backend; los scripts Oracle necesarios no están incluidos en estos repositorios.

```bash
npm install
```

Opcionalmente, crea `.env` en la raíz de este módulo:

```dotenv
VITE_API_BASE_URL=http://localhost:3000
```

La URL apunta a la raíz del backend, sin `/api`. Si se omite, se usa `http://localhost:3000`. Este módulo no incluye `.env.example`.

Configura `CORS_ORIGIN=http://localhost:5173` en el backend y ejecuta:

```bash
npm run dev
```

Abre `http://localhost:5173` e inicia sesión con un usuario existente. No hay pantalla de registro; se puede crear un barbero mediante `POST /api/auth/register` del backend si Oracle tiene el package correspondiente.

| Comando | Función |
| --- | --- |
| `npm run dev` | Desarrollo con Vite |
| `npm run build` | Generar archivos estáticos en `dist` |
| `npm run preview` | Previsualizar el build localmente |

Al alojar el build, configura la URL de la API antes de compilar y la reescritura de rutas hacia `index.html` para la navegación con `BrowserRouter`.

## Código

- [src/api](./src/api/): cliente Axios y llamadas por recurso; adjunta el JWT y maneja respuestas `401`.
- [src/context](./src/context/): sesión y notificaciones.
- [src/pages](./src/pages/): acceso, citas, servicios, clientes y horarios.
- [src/components](./src/components/): navegación, layout, modales y formularios.
- [src/utils/datetime.js](./src/utils/datetime.js): construcción y formato de fechas para la API.

## Pendientes y límites

- No hay pantallas de registro ni edición del perfil, aunque la API tiene esas operaciones.
- No se editan ni eliminan clientes; las citas solo se crean, consultan y cancelan. Las excepciones no se editan ni eliminan.
- La eliminación de servicios los desactiva en el backend; el panel oculta los `INACTIVE`.
- Varios listados solo solicitan la primera página de hasta 100 registros. «Próximas» filtra citas futuras `PENDING` o `CONFIRMED` de esa página en el navegador y puede omitir registros posteriores.
- Token y usuario se guardan en `localStorage`, sin renovación automática del JWT.
- Los horarios usan fechas ISO completas ancladas a una fecha fija. El panel interpreta lunes = 1 y domingo = 7; esa convención debe coincidir con Oracle.
- No hay un script de pruebas automatizadas en este módulo. Compilar no valida todos los flujos ni la integración con Oracle.
