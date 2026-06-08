

# ✦ The Constellation of You

**A gamified birthday experience built for Johnson Saka — June 23rd, 2026**

An interactive space where memories shine as stars, friends transmit birthday wishes in real-time, and the countdown to launch never sleeps.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-0EA5E9?style=flat-square&logo=tailwindcss&logoColor=white)



---

## Features

| Module | Description |
| --- | --- |
| **Galaxy Dashboard** | Interactive star map — click anywhere in the void to ignite a memory |
| **Birthday Countdown** | Live countdown to June 23rd, then triggers a launch sequence and celebration |
| **Comms Log** | Real-time birthday wishes from anyone with the link, powered by Supabase |
| **Alliance Roster** | Live list of allies (shoutouts) — add and remove, persisted in Supabase |
| **Sound Log** | Top 10 Spotify tracks via PKCE OAuth, cached and shown to all visitors |
| **Affirmation Signal** | Personal affirmations delivered on demand |
| **Motivational Ticker** | Scrolling quote bar at the bottom of the screen |

---

## Stack

- **Frontend** — React 18 + TypeScript + Vite
- **Styling** — Tailwind CSS + Framer Motion
- **Database** — Supabase (Postgres + Realtime)
- **Music** — Spotify Web API (Authorization Code with PKCE)

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Spotify Developer](https://developer.spotify.com) app

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
```

### 3. Set up Supabase tables

Run the following in your Supabase **SQL Editor**:

```sql
-- Birthday wishes (Comms Log)
create table wishes (
  id bigint primary key generated always as identity,
  sender text not null,
  text text not null,
  created_at timestamptz default now()
);
alter table wishes enable row level security;
create policy "read" on wishes for select to anon using (true);
create policy "insert" on wishes for insert to anon with check (true);

-- Alliance Roster
create table allies (
  id bigint primary key generated always as identity,
  name text not null
);
alter table allies enable row level security;
create policy "read" on allies for select to anon using (true);
create policy "insert" on allies for insert to anon with check (true);
create policy "delete" on allies for delete to anon using (true);

-- Spotify top tracks
create table spotify_tracks (
  id bigint primary key generated always as identity,
  spotify_id text unique not null,
  name text not null,
  artist text not null,
  album text not null,
  album_art text not null,
  preview_url text,
  spotify_url text not null,
  rank int not null,
  updated_at timestamptz default now()
);
alter table spotify_tracks enable row level security;
create policy "read" on spotify_tracks for select to anon using (true);
create policy "insert" on spotify_tracks for insert to anon with check (true);
create policy "update" on spotify_tracks for update to anon using (true);
```

### 4. Configure Spotify redirect URI

In your Spotify Developer app settings, add your app URL as a Redirect URI:

- Local: `http://localhost:5173`
- Production: `https://your-deployed-url.com`

### 5. Run the app

```bash
npm run dev
```

---

## Syncing Spotify

Open the app → click **Sounds** → click **Sync** → log in with your Spotify account. Your top 10 tracks (past 6 months) are fetched and cached in Supabase. All visitors see them without needing to authenticate. Click **Sync** again any time to refresh.

---

## Customisation

All personal data lives in [`utils.ts`](./utils.ts):

| Export | Purpose |
| --- | --- |
| `BIRTHDAY` | Your date of birth (used to calculate age/XP) |
| `TARGET_DATE` | The birthday to count down to |
| `NAME` | Your name, displayed throughout the app |
| `QUOTES` | Motivational ticker quotes |
| `AFFIRMATIONS` | Personal affirmations for the signal button |
| `INITIAL_STARS` | Pre-loaded memory stars on the galaxy map |

---

Built with intention for **Johnson Saka** · June 23rd, 2026 ✦
