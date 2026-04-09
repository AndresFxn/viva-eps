# Sistema de Triage y Priorización de Atención

Sistema para centros de salud que clasifica pacientes según nivel de gravedad, gestiona una cola dinámica de prioridad y permite redistribuir atención en tiempo real.

## Stack tecnológico

- **Backend:** Laravel 12 (PHP 8.2) + Laravel Sanctum (autenticación API)
- **Frontend:** React 19 + Vite + TailwindCSS + TanStack Query + Zustand
- **Base de datos:** PostgreSQL
- **Despliegue:** Railway (backend) + Vercel (frontend)

## Estructura del proyecto

```
triage-system/
├── backend/    # API Laravel
└── frontend/   # React + Vite
```

## Tablas de la base de datos

| Tabla | Descripción |
|-------|-------------|
| `users` | Médicos, enfermeros y administradores |
| `patients` | Datos de los pacientes |
| `triage_records` | Registro de clasificación al ingresar |
| `consultations` | Asignación a consultorio y médico |
| `rooms` | Salas y consultorios con disponibilidad |
| `triage_history` | Historial de reclasificaciones |

## Roles

- `admin` — gestión completa
- `doctor` — ver cola, atender, reportes
- `nurse` — registrar triage, reclasificar

## Instalación local

### Requisitos
- PHP 8.2+
- Composer
- Node.js 18+
- PostgreSQL

### Backend

```bash
cd backend
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

El backend corre en `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend corre en `http://localhost:5173`

## Usuarios de prueba (seeder)

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@triage.com | password | admin |
| doctor1@triage.com | password | doctor |
| doctor2@triage.com | password | doctor |
| nurse1@triage.com | password | nurse |

## Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/login` | Autenticación |
| GET | `/api/dashboard` | Estado en tiempo real |
| GET | `/api/triage` | Cola de prioridad |
| POST | `/api/triage` | Registrar triage |
| PATCH | `/api/triage/{id}/reclassify` | Reclasificar paciente |
| POST | `/api/consultations` | Asignar consulta |
| PATCH | `/api/consultations/{id}/finish` | Finalizar consulta |
| GET | `/api/reports/summary` | Reporte agregado por período |

## Despliegue

### Railway (backend)
1. Crear proyecto en [railway.app](https://railway.app)
2. Agregar servicio PostgreSQL
3. Conectar repositorio GitHub
4. Configurar variables de entorno del `.env`
5. Agregar comando de inicio: `php artisan migrate --seed && php artisan serve --host=0.0.0.0 --port=$PORT`

### Vercel (frontend)
1. Conectar repositorio en [vercel.com](https://vercel.com)
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Agregar variable de entorno `VITE_API_URL` con la URL del backend en Railway
