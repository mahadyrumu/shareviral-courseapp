import { synchronize } from '@nozbe/watermelondb/sync';
import { database } from '../data/database';
import { supabase } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LAST_SYNCED_KEY } from '../components/OfflineIndicator';

export async function syncData() {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      // Build the query to fetch courses updated since last sync
      let query = supabase.from('courses').select('*');
      
      if (lastPulledAt) {
        const lastPulledDate = new Date(lastPulledAt).toISOString();
        query = query.gt('last_updated', lastPulledDate);
      }

      const { data, error } = await query;

      if (error) {
        console.log('Supabase fetch error (offline expected):', error.message);
        throw new Error(error.message);
      }

      if (!data) {
        return { changes: {}, timestamp: Date.now() };
      }

      const existingCourses = await database.get('courses').query().fetch();
      const existingIds = new Set(existingCourses.map(c => c.id));

      const created: any[] = [];
      const updated: any[] = [];

      data.forEach((course: any) => {
        const courseData = {
          id: course.course_id, // WatermelonDB expects 'id' as primary key string
          course_id: course.course_id,
          title: course.title,
          description_short: course.description_short,
          instructor_id: course.instructor_id,
          instructor_name: course.instructor_name,
          instructor_expertise_level: course.instructor_expertise_level,
          duration_weeks: course.duration_weeks,
          price_usd: course.price_usd,
          is_premium: course.is_premium,
          tags: JSON.stringify(course.tags || []),
          rating: course.rating,
          last_updated: new Date(course.last_updated).getTime(),
          // Note: is_enrolled is purposely omitted to prevent overwriting local state
        };

        if (existingIds.has(courseData.id)) {
          updated.push(courseData);
        } else {
          created.push(courseData);
        }
      });

      return {
        changes: {
          courses: {
            created,
            updated,
            deleted: [], // For this assessment, we assume no hard deletes from backend
          },
        },
        timestamp: Date.now(),
      };
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      // In this assessment, the app is read-only from Supabase except for local enrollment.
      // Enrollment state is local-only, so we do not push anything back to Supabase.
      return;
    },
  });

  // Save the successful sync time
  await AsyncStorage.setItem(LAST_SYNCED_KEY, new Date().toISOString());
}
