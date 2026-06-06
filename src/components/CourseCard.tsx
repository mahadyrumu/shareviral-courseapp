import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import withObservables from '@nozbe/with-observables';
import Course from '../data/Course';
import Tag from './Tag';
import { useTheme } from '../theme/ThemeContext';

interface CourseCardProps {
  course: Course;
  onPress: () => void;
}

const CourseCard = ({ course, onPress }: CourseCardProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.text }]} 
      onPress={onPress} 
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {course.title}
        </Text>
      </View>
      
      <View style={styles.instructorContainer}>
        <Text style={styles.instructorLabel}>By </Text>
        <Text style={[styles.instructorName, { color: colors.primary }]}>{course.instructor_name}</Text>
      </View>

      <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
        {course.description_short}
      </Text>

      {course.tags && course.tags.length > 0 && (
        <View style={styles.tagContainer}>
          {course.tags.slice(0, 3).map((tag: string, index: number) => (
            <Tag key={index} label={tag} />
          ))}
        </View>
      )}

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <View style={styles.statContainer}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={[styles.statText, { color: colors.textSecondary }]}>{course.rating.toFixed(1)}</Text>
        </View>
        <View style={styles.statContainer}>
          <Text style={styles.statIcon}>⏱</Text>
          <Text style={[styles.statText, { color: colors.textSecondary }]}>{course.duration_weeks}w</Text>
        </View>
        
        {course.is_enrolled && (
          <View style={[styles.badge, { backgroundColor: colors.success }]}>
            <Text style={[styles.badgeText, { color: colors.successText }]}>Enrolled</Text>
          </View>
        )}

        <View style={styles.priceContainer}>
          <Text style={[styles.priceText, { color: colors.primary }]}>
            ${course.price_usd.toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default withObservables(['course'], ({ course }: { course: Course }) => ({
  course: course.observe(),
}))(CourseCard);

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  instructorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructorLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  instructorName: {
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
    paddingTop: 12,
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  statText: {
    fontSize: 14,
    fontWeight: '500',
  },
  priceContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
