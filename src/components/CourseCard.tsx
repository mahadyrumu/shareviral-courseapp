import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import withObservables from '@nozbe/with-observables';
import Course from '../data/Course';
import Tag from './Tag';

interface CourseCardProps {
  course: Course;
  onPress: () => void;
}

const CourseCard = ({ course, onPress }: CourseCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={1}>{course.title}</Text>
        <Text style={styles.price}>${course.price_usd}</Text>
      </View>
      
      <Text style={styles.instructor}>by {course.instructor_name}</Text>
      <Text style={styles.description} numberOfLines={2}>{course.description_short}</Text>
      
      <View style={styles.tagContainer}>
        {course.tags.slice(0, 3).map((tag: string, index: number) => (
          <Tag key={index} label={tag} />
        ))}
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.rating}>⭐ {course.rating.toFixed(1)}</Text>
        <Text style={styles.duration}>⏱ {course.duration_weeks} weeks</Text>
        {course.is_enrolled && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Enrolled</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Decorate the component to observe changes to the course automatically
export default withObservables(['course'], ({ course }: { course: Course }) => ({
  course: course.observe(),
}))(CourseCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    flex: 1,
    marginRight: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0d6efd',
  },
  instructor: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 12,
    lineHeight: 20,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 13,
    color: '#495057',
    marginRight: 16,
  },
  duration: {
    fontSize: 13,
    color: '#495057',
    flex: 1,
  },
  badge: {
    backgroundColor: '#198754',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
