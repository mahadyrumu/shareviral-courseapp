import { CourseRepository } from '../src/data/CourseRepository';
import { database } from '../src/data/database';

jest.mock('../src/data/database', () => {
  return {
    database: {
      get: jest.fn().mockReturnValue({
        query: jest.fn().mockReturnValue({
          observeWithColumns: jest.fn().mockReturnValue('OBSERVABLE_COURSES'),
        }),
        findAndObserve: jest.fn().mockReturnValue('OBSERVABLE_COURSE_123'),
      }),
      write: jest.fn(),
    }
  };
});

describe('CourseRepository', () => {
  it('observeCourses should return the observable chain', () => {
    const observable = CourseRepository.observeCourses('React', true, true);
    expect(observable).toBe('OBSERVABLE_COURSES');
    
    // Verify database.get was called for 'courses'
    expect(database.get).toHaveBeenCalledWith('courses');
  });

  it('observeCourse should return the single course observable', () => {
    const observable = CourseRepository.observeCourse('123');
    expect(observable).toBe('OBSERVABLE_COURSE_123');
    
    const collectionMock = database.get('courses');
    expect(collectionMock.findAndObserve).toHaveBeenCalledWith('123');
  });
});
