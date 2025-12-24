# 🌍 Earthquake Early Warning - Server

Backend API untuk aplikasi Earthquake Early Warning menggunakan **Supabase** sebagai database.

## 📋 Prerequisites

- Node.js (v18 atau lebih tinggi)
- Akun Supabase (gratis di [supabase.com](https://supabase.com))

## 🚀 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase

1. Buat project baru di [Supabase Dashboard](https://app.supabase.com)
2. Buka SQL Editor dan jalankan script dari `supabase-setup.sql`
3. Copy URL dan Anon Key dari Project Settings > API

### 3. Environment Variables

Buat file `.env` di root folder server:

```env
# Supabase Configuration (REQUIRED)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Server Configuration (OPTIONAL)
PORT=3000
FETCH_INTERVAL=5
```

**Catatan**: Server akan error jika `SUPABASE_URL` dan `SUPABASE_ANON_KEY` tidak diset!

## 🏃 Running

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## 📊 API Endpoints

### Base URL

```
http://localhost:3000
```

### Endpoints

| Method | Endpoint                  | Description                                     |
| ------ | ------------------------- | ----------------------------------------------- |
| GET    | `/`                       | API information                                 |
| GET    | `/api/earthquakes`        | Get all earthquakes (with pagination & filters) |
| GET    | `/api/earthquakes/latest` | Get latest earthquake                           |
| GET    | `/api/earthquakes/nearby` | Get earthquakes near coordinates                |
| GET    | `/api/earthquakes/stats`  | Get earthquake statistics                       |
| GET    | `/api/earthquakes/:id`    | Get specific earthquake by ID                   |

### Query Parameters

#### `/api/earthquakes`

- `limit` - Number of results (default: 50)
- `offset` - Offset for pagination (default: 0)
- `minMagnitude` - Minimum magnitude filter
- `maxMagnitude` - Maximum magnitude filter

#### `/api/earthquakes/nearby`

- `lat` - Latitude (required)
- `lng` - Longitude (required)
- `radius` - Radius in km (default: 100)

## 🔄 Data Fetching

Server otomatis mengambil data dari BMKG setiap 5 menit (configurable via `FETCH_INTERVAL`).

Data sources:

- **autogempa.json** - Latest earthquake
- **gempaterkini.json** - M5.0+ earthquakes
- **gempadirasakan.json** - Felt earthquakes

## 💾 Database

Menggunakan **Supabase (PostgreSQL)** dengan tabel:

### `earthquakes`

- `id` (TEXT, PRIMARY KEY)
- `datetime` (TEXT)
- `timestamp` (BIGINT)
- `magnitude` (REAL)
- `depth` (REAL)
- `latitude` (REAL)
- `longitude` (REAL)
- `region` (TEXT)
- `tsunami_potential` (TEXT)
- `felt_status` (TEXT)
- `shakemap_url` (TEXT)
- `created_at` (BIGINT)

## 🔧 Tech Stack

- **Express.js** - Web framework
- **Supabase** - Database (PostgreSQL)
- **Axios** - HTTP client
- **Node-cron** - Scheduled tasks
- **TypeScript** - Type safety

## 📝 Migration Notes

✅ **Migrated from SQLite to Supabase**

- Removed `better-sqlite3` dependency
- Removed `db.ts` and `schema.ts` (SQLite files)
- All database operations now use Supabase client
- Async/await pattern for all database queries
- Better error handling with Supabase error codes

## 🚨 Important

Server akan **exit** jika Supabase credentials tidak dikonfigurasi dengan benar. Pastikan `.env` file sudah diset dengan benar sebelum menjalankan server.

## 📄 License

MIT
