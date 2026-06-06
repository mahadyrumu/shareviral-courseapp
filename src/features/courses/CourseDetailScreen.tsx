import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import withObservables from '@nozbe/with-observables';
import { CourseRepository } from '../../data/CourseRepository';
import Course from '../../data/Course';
import Tag from '../../components/Tag';
import { useTheme } from '../../theme/ThemeContext';
import { useRoute } from '@react-navigation/native';
import { CourseDetailRouteProp } from '../../types/navigation';

const CourseDetail = ({ course }: { course: Course }) => {
  const { colors } = useTheme();
  
  const handleEnrollToggle = async () => {
    try {
      await CourseRepository.toggleEnrollment(course.id);
    } catch (e) {
      Alert.alert('Error', 'Failed to update enrollment status.');
    }
  };

  if (!course) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.text }]}>{course.title}</Text>
      
      <View style={styles.metaContainer}>
        <Text style={[styles.metaText, { color: colors.textSecondary }]}>⭐ {course.rating.toFixed(1)}</Text>
        <Text style={[styles.metaText, { color: colors.textSecondary }]}>⏱ {course.duration_weeks} weeks</Text>
        <Text style={[styles.metaText, { color: course.is_premium ? colors.primary : colors.success }]}>
          {course.is_premium ? `$${course.price_usd}` : 'Free'}
        </Text>
      </View>

      <View style={styles.tagContainer}>
        {course.tags.map((tag, i) => (
          <Tag key={i} label={tag} />
        ))}
      </View>

      <View style={[styles.instructorContainer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.instructorTitle, { color: colors.textSecondary }]}>Instructor</Text>
        <Text style={[styles.instructorName, { color: colors.text }]}>{course.instructor_name}</Text>
        {course.instructor_expertise_level && (
          <Text style={[styles.instructorExp, { color: colors.textSecondary }]}>{course.instructor_expertise_level}</Text>
        )}
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>About this course</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>{course.description_short}</Text>
      </View>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: course.is_enrolled ? colors.danger : colors.primary }]} 
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
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  metaText: {
    fontSize: 15,
    fontWeight: '500',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  instructorContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  instructorTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  instructorName: {
    fontSize: 18,
    fontWeight: '600',
  },
  instructorExp: {
    fontSize: 14,
    marginTop: 2,
  },
  descriptionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
