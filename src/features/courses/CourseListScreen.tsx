import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TextInput, RefreshControl, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import withObservables from '@nozbe/with-observables';
import CourseCard from '../../components/CourseCard';
import OfflineIndicator from '../../components/OfflineIndicator';
import { CourseRepository } from '../../data/CourseRepository';
import Course from '../../data/Course';
import { syncData } from '../../services/sync';
import { RootNavigationProp } from '../../types/navigation';
import { useNavigation } from '@react-navigation/native';
import { useCourseFilterStore } from '../../store/useCourseFilterStore';
import { useTheme } from '../../theme/ThemeContext';

const CourseList = ({ courses }: { courses: Course[] }) => {
  const navigation = useNavigation<RootNavigationProp>();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await syncData();
    } catch (e: any) {
      console.warn('Sync failed', e);
      Alert.alert('Sync Failed', 'Could not sync with the server. Please check your connection.');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const renderItem = useCallback(({ item }: { item: Course }) => (
    <CourseCard 
      course={item} 
      onPress={() => navigation.navigate('CourseDetail', { courseId: item.course_id })} 
    />
  ), [navigation]);

  const { colors } = useTheme();

  if (courses.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No courses found.</Text>
      </View>
    );
  }

  return (
    <FlashList
      data={courses}
      renderItem={renderItem}
      /* @ts-ignore */
      estimatedItemSize={180}
      contentContainerStyle={{ paddingVertical: 8 }}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
    />
  );
};

const EnhancedCourseList = withObservables(
  ['searchTerm', 'filterEnrolled', 'filterPremium', 'sortBy'], 
  ({ searchTerm, filterEnrolled, filterPremium, sortBy }: any) => ({
    courses: CourseRepository.observeCourses(searchTerm, filterEnrolled, filterPremium, sortBy)
  })
)(CourseList);

export default function CourseListScreen() {
  const {
    searchTerm, setSearchTerm,
    filterEnrolled, setFilterEnrolled,
    filterPremium, setFilterPremium,
    sortBy, setSortBy
  } = useCourseFilterStore();
  const { colors } = useTheme();

  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <OfflineIndicator />
      
      <View style={[styles.headerContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TextInput 
          style={[styles.searchInput, { backgroundColor: colors.surfaceVariant, color: colors.text }]}
          placeholder="Search by title, instructor, or tags..."
          placeholderTextColor={colors.textSecondary}
          value={searchTerm}
          onChangeText={setSearchTerm}
          clearButtonMode="while-editing"
        />
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity 
            style={[styles.filterButton, { backgroundColor: filterEnrolled ? colors.primary : colors.surfaceVariant }]} 
            onPress={() => setFilterEnrolled(filterEnrolled ? null : true)}>
            <Text style={[styles.filterText, { color: filterEnrolled ? colors.primaryText : colors.text }]}>Enrolled</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, { backgroundColor: filterPremium ? colors.primary : colors.surfaceVariant }]} 
            onPress={() => setFilterPremium(filterPremium ? null : true)}>
            <Text style={[styles.filterText, { color: filterPremium ? colors.primaryText : colors.text }]}>Premium</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.sortButton, { backgroundColor: sortBy === 'rating' ? colors.success : colors.surface, borderColor: sortBy === 'rating' ? colors.success : colors.border }]} 
            onPress={() => setSortBy(sortBy === 'rating' ? null : 'rating')}>
            <Text style={[styles.sortText, { color: sortBy === 'rating' ? colors.successText : colors.text }]}>⭐ Rating</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.sortButton, { backgroundColor: sortBy === 'price' ? colors.success : colors.surface, borderColor: sortBy === 'price' ? colors.success : colors.border }]} 
            onPress={() => setSortBy(sortBy === 'price' ? null : 'price')}>
            <Text style={[styles.sortText, { color: sortBy === 'price' ? colors.successText : colors.text }]}>💵 Price</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.sortButton, { backgroundColor: sortBy === 'duration' ? colors.success : colors.surface, borderColor: sortBy === 'duration' ? colors.success : colors.border }]} 
            onPress={() => setSortBy(sortBy === 'duration' ? null : 'duration')}>
            <Text style={[styles.sortText, { color: sortBy === 'duration' ? colors.successText : colors.text }]}>⏱ Duration</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <EnhancedCourseList 
        searchTerm={debouncedSearch} 
        filterEnrolled={filterEnrolled} 
        filterPremium={filterPremium} 
        sortBy={sortBy}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  searchInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontWeight: '600',
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  sortText: {
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});
