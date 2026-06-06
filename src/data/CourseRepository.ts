import { Q } from '@nozbe/watermelondb';
import { database } from './database';
import Course from './Course';

export const CourseRepository = {
  // Get observable list of courses (reacts to DB changes)
  observeCourses: (
    searchTerm: string = '', 
    filterEnrolled: boolean | null = null, 
    filterPremium: boolean | null = null,
    sortBy: 'rating' | 'price' | 'duration' | null = null
  ) => {
    const coursesCollection = database.get<Course>('courses');
    
    let conditions: Q.Clause[] = [];
    
    if (searchTerm) {
      const sanitized = Q.sanitizeLikeString(searchTerm);
      conditions.push(
        Q.or(
          Q.where('title', Q.like(`%${sanitized}%`)),
          Q.where('instructor_name', Q.like(`%${sanitized}%`)),
          Q.where('tags', Q.like(`%${sanitized}%`))
        )
      );
    }
    
    if (filterEnrolled !== null) {
      conditions.push(Q.where('is_enrolled', filterEnrolled));
    }
    
    if (filterPremium !== null) {
      conditions.push(Q.where('is_premium', filterPremium));
    }

    if (sortBy) {
      // Sort in descending order for rating, ascending for price/duration
      const order = sortBy === 'rating' ? Q.desc : Q.asc;
      let columnName: string = sortBy;
      if (sortBy === 'duration') columnName = 'duration_weeks';
      if (sortBy === 'price') columnName = 'price_usd';
      
      conditions.push(Q.sortBy(columnName, order));
    }
    
    return coursesCollection.query(...conditions).observeWithColumns(['is_enrolled']);
  },
  
  // Get single course observable
  observeCourse: (id: string) => {
    return database.get<Course>('courses').findAndObserve(id);
  },

  // Toggle enrollment locally
  toggleEnrollment: async (courseId: string) => {
    await database.write(async () => {
      const course = await database.get<Course>('courses').find(courseId);
      await course.update(c => {
        c.is_enrolled = !c.is_enrolled;
      });
    });
  }
};
