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

  if (courses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No courses found.</Text>
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

  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  return (
    <View style={styles.container}>
      <OfflineIndicator />
      
      <View style={styles.headerContainer}>
        <TextInput 
          style={styles.searchInput}
          placeholder="Search courses..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          clearButtonMode="while-editing"
        />
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity 
            style={[styles.filterButton, filterEnrolled && styles.filterActive]} 
            onPress={() => setFilterEnrolled(filterEnrolled ? null : true)}>
            <Text style={[styles.filterText, filterEnrolled && styles.filterTextActive]}>Enrolled</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, filterPremium && styles.filterActive]} 
            onPress={() => setFilterPremium(filterPremium ? null : true)}>
            <Text style={[styles.filterText, filterPremium && styles.filterTextActive]}>Premium</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.sortButton, sortBy === 'rating' && styles.sortButtonActive]} 
            onPress={() => setSortBy(sortBy === 'rating' ? null : 'rating')}>
            <Text style={[styles.sortText, sortBy === 'rating' && styles.sortTextActive]}>⭐ Rating</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.sortButton, sortBy === 'price' && styles.sortButtonActive]} 
            onPress={() => setSortBy(sortBy === 'price' ? null : 'price')}>
            <Text style={[styles.sortText, sortBy === 'price' && styles.sortTextActive]}>💵 Price</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.sortButton, sortBy === 'duration' && styles.sortButtonActive]} 
            onPress={() => setSortBy(sortBy === 'duration' ? null : 'duration')}>
            <Text style={[styles.sortText, sortBy === 'duration' && styles.sortTextActive]}>⏱ Duration</Text>
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
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  searchInput: {
    backgroundColor: '#f1f3f5',
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
    backgroundColor: '#e9ecef',
    marginRight: 8,
  },
  filterActive: {
    backgroundColor: '#0d6efd',
  },
  filterText: {
    color: '#495057',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    marginRight: 8,
  },
  sortButtonActive: {
    backgroundColor: '#198754',
    borderColor: '#198754',
  },
  sortText: {
    color: '#212529',
    fontWeight: '600',
  },
  sortTextActive: {
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
  },
});
