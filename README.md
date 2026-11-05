# AgendaFlow · Panel de administración

Frontend en React + Vite + Tailwind para gestionar tu sistema de citas
(AgendaFlow) sin depender de Postman ni copiar tokens JWT a mano.

## Puesta en marcha

```bash
npm install
cp .env.example .env   # ajusta VITE_API_BASE_URL si tu backend no corre en :3000
npm run dev
```

La app queda en `http://localhost:5173`. Tu backend ya trae `CORS_ORIGIN=http://localhost:5173`
en su `.env`, así que no necesitas tocar nada ahí.

## Estructura

```
src/
  api/             Wrappers de axios por recurso (auth, appointments, services, schedules, customers)
  api/client.js     Cliente axios: interceptor de JWT, manejo global de 401, unwrap({success,data}), getErrorMessage
  utils/datetime.js Helpers para construir/formatear los datetimes ISO que exige el backend (Zod)
  context/          AuthContext (sesión/token/usuario) y ToastContext (notificaciones)
  components/       Layout, Sidebar, modales, formularios reutilizables
  pages/            Una página por módulo (Login, Appointments, Services, Schedules, Customers)
```

## Contrato real del backend (ajustado desde el código fuente)

Todas las respuestas del backend van envueltas:
- Éxito: `{ success: true, data: ... }`
- Error: `{ success: false, error: { code, message, details? } }` (los `details` de
  validación de Zod se anexan al mensaje del toast cuando aplica).

### Auth
- `POST /api/auth/login` → `{ data: { token, user: { userId, barberId, role, email } } }`
- `GET /api/auth/me` y `POST /api/auth/register` existen en el backend pero no se usan
  todavía desde este panel (login es el único flujo implementado en la UI).

### Citas (`/api/appointments`)
- `GET /`, `GET /today`, `GET /next` — **no existe `/upcoming`**. La pestaña "Próximas"
  se arma pidiendo `GET /?page=1&limit=100` y filtrando en el cliente por
  `status ∈ {PENDING, CONFIRMED}` y `startAt` futuro.
- `POST /` — body `{ customerId, serviceId, startAt, endAt, source, notes? }`, donde
  `startAt`/`endAt` son datetimes ISO completos (no `date`+`time` sueltos). El formulario
  calcula `endAt` automáticamente sumando la duración del servicio a la hora de inicio, y
  siempre manda `source: "ADMIN"`.
- **No hay `PUT` ni `DELETE`** para citas — solo `PATCH /:id/cancel` (204, sin body). Por
  eso la UI solo permite crear y cancelar, no editar.
- Las filas que regresa el backend ya traen `customer` y `service` como texto (nombre
  completo / nombre del servicio), no como IDs — así que no hace falta cruzar con las
  listas de clientes/servicios para mostrarlas.

### Servicios (`/api/services`)
- CRUD completo, pero **`DELETE` en realidad desactiva** el servicio (`status = 'INACTIVE'`)
  en vez de borrarlo, y el listado no filtra por estado. La UI filtra los `INACTIVE`
  para que no sigan apareciendo tras "eliminarlos".
- Campos: `serviceId` (no `id`), `name`, `description` (opcional), `price`,
  `durationMinutes`.

### Clientes (`/api/customers`)
- **Solo `GET` y `POST`** — no hay `PUT` ni `DELETE` todavía, así que la UI no ofrece
  editar/eliminar (se muestra un aviso explicándolo).
- Campos: `customerId` (no `id`), `firstName`, `lastName`, `phone`, `whatsappPhone`
  (aparte del teléfono), `email`, `notes`.

### Horarios y excepciones (`/api/schedules`)
- `GET /`, `POST /`, `DELETE /:id` para horarios semanales.
- `GET /exceptions`, `POST /exceptions` para excepciones — **sin `DELETE`** todavía.
- `dayOfWeek` es un número **1–7**. Asumí convención ISO-8601 (1 = Lunes … 7 = Domingo);
  si tu procedimiento `PKG_SCHEDULE` usa otra numeración (p. ej. 0 = Domingo), dime y
  ajusto el mapeo en `src/components/ScheduleForm.jsx`.
- `startTime`/`endTime` deben ser datetimes ISO completos aunque solo representen una
  hora del día. Los construimos anclando a una fecha fija (`2000-01-01`) más la hora
  elegida — ver `src/utils/datetime.js`.
- Excepciones: `type` es `DAY_OFF | VACATION | BLOCK | SPECIAL_HOURS`. Para `BLOCK` y
  `SPECIAL_HOURS` la UI muestra un rango horario opcional; el resto asume día completo.

### Barbero / perfil (`/api/barber/profile`)
- `GET`/`PUT` existen en el backend pero **aún no tienen pantalla en este panel**. Si
  quieres, agrego una vista de "Mi perfil" para editar nombre, teléfono, bio, etc.

## Pendientes conocidos (limitaciones del backend actual, no del frontend)

1. No se pueden editar ni eliminar clientes — faltan `PUT`/`DELETE /api/customers/:id`.
2. No se pueden editar citas ni eliminarlas de verdad — solo cancelar.
3. No se pueden eliminar excepciones de horario.
4. "Eliminar" un servicio en realidad lo desactiva; si necesitas un borrado real habría
   que agregarlo en `PKG_SERVICE`.

Si agregas alguno de estos endpoints, avísame y actualizo la UI correspondiente (los
componentes ya están hechos para que sea un cambio pequeño: solo hay que exponer la
llamada en `src/api/*.js` y volver a mostrar el botón de editar/eliminar).
