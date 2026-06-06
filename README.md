# ShareViral Courses (Offline-First React Native App)

This is a complete React Native application built to satisfy the ShareViral Task Assessment requirements. It is an offline-first course browsing app that utilizes Supabase for the backend and WatermelonDB for high-performance offline SQLite syncing.

## Tech Stack
- **Framework:** React Native / Expo (SDK 56)
- **Language:** TypeScript (Strict)
- **Backend:** Supabase (PostgreSQL)
- **Offline Database:** WatermelonDB (SQLite)
- **State/Data Observables:** `@nozbe/with-observables` & Zustand
- **Navigation:** React Navigation (Native Stack)
- **Performance:** `@shopify/flash-list`

## Architecture & Decisions
The app uses a **Feature-Based Clean Architecture**:
- `src/components`: Dumb reusable UI components (`CourseCard`, `Tag`, `OfflineIndicator`).
- `src/data`: WatermelonDB models, repository layer, and SQLite configuration. 
- `src/features`: Grouped feature screens (`CourseListScreen`, `CourseDetailScreen`).
- `src/services`: Supabase connectivity and our custom `sync.ts` background engine.

### Offline-First Strategy
The app reads purely from local SQLite via `CourseRepository`. When the app loads or pulls-to-refresh, the `syncData()` function fetches newer courses from Supabase and merges them into WatermelonDB.

### State Management
Because WatermelonDB emits observable streams, UI components automatically react to database changes without complex Redux logic. `is_enrolled` is specifically treated as a *local-only field* in WatermelonDB; it is omitted from the remote sync, ensuring the user's enrollment status is never overwritten by a background fetch.

**Zustand** is utilized as a lightweight global store (`useCourseFilterStore`) to manage UI state, specifically the advanced search, filtering (premium/enrolled), and sorting criteria. This neatly decouples the UI interaction state from the React component tree and database queries.

## Supabase Setup

### Table Schema
Run the following SQL in your Supabase SQL Editor:
```sql
create table courses (
  course_id text primary key,
  title text not null,
  description_short text not null,
  instructor_id text,
  instructor_name text not null,
  instructor_expertise_level text,
  duration_weeks int not null,
  price_usd numeric not null,
  is_premium boolean not null,
  tags text[] not null,
  rating numeric not null,
  last_updated timestamptz not null
);
```

### Environment Configuration
Do NOT hardcode your API keys. Create a `.env` file in the root directory:
```
EXPO_PUBLIC_SUPABASE_URL=your_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Row Level Security (RLS) Assumptions
We assume this table allows anonymous `SELECT` operations for the purpose of the assessment. If RLS is enabled, you must add an explicit policy allowing SELECT for anon roles:
```sql
CREATE POLICY "Enable read access for all users" ON "public"."courses" AS PERMISSIVE FOR SELECT TO public USING (true);
```

## Running the App

1. Install dependencies:
```bash
npm install
```
2. Start the Expo server:
```bash
npm start
```
3. Run on a device (press `a` for Android or `i` for iOS).

## Testing
The app includes Jest tests verifying our components and Data Repository mock logic. To run the tests:
```bash
npm test
```

## Known Limitations
- Background Sync requires the app to be open. For full headless background sync, packages like `expo-background-fetch` would need to be added.
- The app uses Expo Go for quick compilation. To use native WatermelonDB SQLite bindings efficiently in production, a prebuild workflow (`npx expo run:ios`) is recommended.
