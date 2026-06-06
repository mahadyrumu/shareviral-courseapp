import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import withObservables from '@nozbe/with-observables';
import { CourseRepository } from '../../data/CourseRepository';
import Course from '../../data/Course';
import Tag from '../../components/Tag';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CourseDetailRouteProp, RootNavigationProp } from '../../types/navigation';

const CourseDetail = ({ course }: { course: Course }) => {
  const handleEnrollToggle = async () => {
    try {
      await CourseRepository.toggleEnrollment(course.id);
    } catch (e) {
      Alert.alert('Error', 'Failed to update enrollment status.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{course.title}</Text>
      
      <View style={styles.metaContainer}>
        <Text style={styles.metaText}>⭐ {course.rating.toFixed(1)}</Text>
        <Text style={styles.metaText}>⏱ {course.duration_weeks} weeks</Text>
        <Text style={styles.metaText}>💵 {course.is_premium ? `$${course.price_usd}` : 'Free'}</Text>
      </View>

      <View style={styles.tagContainer}>
        {course.tags.map((tag, i) => (
          <Tag key={i} label={tag} />
        ))}
      </View>

      <View style={styles.instructorContainer}>
        <Text style={styles.instructorTitle}>Instructor</Text>
        <Text style={styles.instructorName}>{course.instructor_name}</Text>
        {course.instructor_expertise_level && (
          <Text style={styles.instructorExp}>{course.instructor_expertise_level}</Text>
        )}
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.sectionTitle}>About this course</Text>
        <Text style={styles.description}>{course.description_short}</Text>
      </View>

      <TouchableOpacity 
        style={[styles.button, course.is_enrolled ? styles.buttonUnenroll : styles.buttonEnroll]} 
        onPress={handleEnrollToggle}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {course.is_enrolled ? 'Remove Enrollment' : 'Mark as Enrolled'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// HOC for observables
const EnhancedCourseDetail = withObservables(['courseId'], ({ courseId }: { courseId: string }) => ({
  course: CourseRepository.observeCourse(courseId)
}))(CourseDetail);

export default function CourseDetailScreen() {
  const route = useRoute<CourseDetailRouteProp>();
  
  return <EnhancedCourseDetail courseId={route.params.courseId} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  metaText: {
    fontSize: 15,
    color: '#495057',
    fontWeight: '500',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  instructorContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  instructorTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#6c757d',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  instructorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
  },
  instructorExp: {
    fontSize: 14,
    color: '#495057',
    marginTop: 2,
  },
  descriptionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonEnroll: {
    backgroundColor: '#0d6efd',
  },
  buttonUnenroll: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
