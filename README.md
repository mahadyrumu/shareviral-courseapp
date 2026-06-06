# ShareViral Courses (Offline-First React Native App)

This is a complete React Native application built to satisfy the ShareViral Task Assessment requirements. It is an offline-first course browsing app that utilizes Supabase for the backend and WatermelonDB for high-performance offline SQLite syncing.

## Setup Instructions

### 1. Clone the Repository
Clone the project to your local machine and navigate into the directory:
```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build and Run the App
**Important:** Because this app uses WatermelonDB with custom native SQLite bindings for ultra-fast performance, it **cannot** be run inside the standard "Expo Go" app. You must compile the native Android/iOS project.

**For Android (Requires Android Studio/Emulator or connected physical device):**
```bash
npx expo run:android
```

**For iOS (Requires Mac & Xcode):**
```bash
npx expo run:ios
```

## Supabase Setup Details

### Supabase Project Setup Notes
To run this project, you must create a new Supabase project and database. Once created, you will need to provision the database with our specific table schema and link your project's API keys to the React Native app.

### Public Anon Key Setup through Environment Configuration
**Do not hardcode secrets directly in source code.** 
To securely link the app to your Supabase project, create a `.env` file in the root directory of the application:
```
EXPO_PUBLIC_SUPABASE_URL=your_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Any Assumptions or Row Level Security Policy Details
**Assumption:** We assume this table allows anonymous `SELECT` operations for the purpose of this assessment. If Row Level Security (RLS) is enabled on your Supabase project, you must add an explicit policy allowing `SELECT` for anonymous roles:
```sql
CREATE POLICY "Enable read access for all users" ON "public"."courses" AS PERMISSIVE FOR SELECT TO public USING (true);
```

### Table Schema
Run the following SQL in your Supabase SQL Editor to create the required table:
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

## Tech Stack Used
- **Framework:** React Native / Expo (SDK 56)
- **Language:** TypeScript (Strict)
- **Backend:** Supabase (PostgreSQL)
- **Offline Database:** WatermelonDB (SQLite)
- **State/Data Observables:** `@nozbe/with-observables` & Zustand
- **Navigation:** React Navigation (Native Stack)
- **Performance:** `@shopify/flash-list`

## Architecture Explanation
The app uses a **Feature-Based Clean Architecture** to ensure separation of concerns and maintainability:
- `src/components`: Dumb reusable UI components (`CourseCard`, `Tag`, `OfflineIndicator`).
- `src/data`: WatermelonDB models, repository layer, and SQLite configuration. 
- `src/features`: Grouped feature screens (`CourseListScreen`, `CourseDetailScreen`).
- `src/services`: Supabase connectivity and our custom `sync.ts` background engine.

*(Note: Features such as Supabase Auth, Deep Linking, Skeleton Loading, and CI Workflows were intentionally scoped out to prioritize a bulletproof offline-first architecture, robust performance optimization, and clean data-layer abstractions within the suggested timeframe).*

## Offline-First Strategy
The app is built with a true offline-first approach. It reads purely from local SQLite via `CourseRepository`. 
- When the app loads or pull-to-refresh is triggered, the `syncData()` function fetches newer courses from Supabase and merges them into WatermelonDB.
- `is_enrolled` is treated strictly as a *local-only field* in WatermelonDB. It is omitted from the remote sync process, ensuring the user's enrollment status is never overwritten by a background fetch.
- If the network fails, the app continues to function flawlessly using the cached local database.

## State Management Decision
**Zustand** is utilized as a lightweight global store (`useCourseFilterStore`) to manage UI state, specifically the advanced search, filtering (premium/enrolled), and sorting criteria. This neatly decouples the UI interaction state from the React component tree and database queries.

Because WatermelonDB emits observable streams, UI components automatically react to database changes without needing complex Redux logic. Tapping "Enroll" instantly commits to the local database and immediately updates the UI with zero network latency.

## Testing Instructions
The app includes Jest tests verifying our components and Data Repository mock logic. To run the tests, execute:
```bash
npm test
```

## Known Limitations
- **Background Syncing:** Background Sync requires the app to be active. For full headless background sync while the app is closed, native background tasks (`expo-background-fetch`) would need to be added.

***

## AI Disclosure
In compliance with the assessment guidelines, please note that this project was developed using a pair-programming methodology alongside **Antigravity AI** (a Google DeepMind coding assistant). 

The AI was utilized strictly as a collaborative tool (similar to GitHub Copilot or ChatGPT) to bootstrap boilerplate code, generate the initial UI scaffolding, and assist in debugging React Native environment issues. **All core architectural decisions (such as selecting WatermelonDB for the offline-first strategy), data schema designs, and logic implementations reflect my own engineering intent and understanding of scalable mobile application development.**
