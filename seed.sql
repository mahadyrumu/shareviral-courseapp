-- Dummy data to seed the courses table in Supabase
INSERT INTO courses (course_id, title, description_short, instructor_id, instructor_name, instructor_expertise_level, duration_weeks, price_usd, is_premium, tags, rating, last_updated)
VALUES
  (
    'c1', 
    'Mastering React Native', 
    'Learn to build truly native iOS and Android apps using React and Javascript. We will cover animations, navigation, and performance optimization.',
    'i1',
    'Jane Doe',
    'Senior Engineer',
    8,
    49.99,
    true,
    ARRAY['React Native', 'Mobile', 'Javascript'],
    4.8,
    now()
  ),
  (
    'c2', 
    'Introduction to Supabase', 
    'Build backend services rapidly with Supabase. Learn authentication, real-time databases, and Row Level Security.',
    'i2',
    'John Smith',
    'Backend Architect',
    4,
    0.00,
    false,
    ARRAY['Supabase', 'Backend', 'SQL'],
    4.5,
    now()
  ),
  (
    'c3', 
    'Advanced WatermelonDB', 
    'Master offline-first applications. Discover how to sync thousands of records instantly using WatermelonDB and SQLite.',
    'i1',
    'Jane Doe',
    'Senior Engineer',
    6,
    29.99,
    true,
    ARRAY['Offline-First', 'SQLite', 'Performance'],
    4.9,
    now()
  ),
  (
    'c4', 
    'TypeScript for Beginners', 
    'A gentle introduction to strong typing in JavaScript. Stop relying on console.log and let the compiler catch your errors.',
    'i3',
    'Alice Johnson',
    'Frontend Developer',
    3,
    0.00,
    false,
    ARRAY['TypeScript', 'Web', 'Beginner'],
    4.2,
    now()
  ),
  (
    'c5', 
    'UI/UX for Mobile Devs', 
    'Design beautiful, responsive, and accessible user interfaces for mobile applications.',
    'i4',
    'Robert Chen',
    'Product Designer',
    5,
    19.99,
    true,
    ARRAY['Design', 'UI/UX', 'Mobile'],
    4.7,
    now()
  );
