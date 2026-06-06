import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';
import Course from './Course';

const adapter = new SQLiteAdapter({
  schema,
  jsi: true, // Requires JSI for performance
  onSetUpError: error => {
    // Database failed to load
    console.error('WatermelonDB setup error', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [Course],
});
