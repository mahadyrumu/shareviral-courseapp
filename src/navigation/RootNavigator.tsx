import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import CourseListScreen from '../features/courses/CourseListScreen';
import CourseDetailScreen from '../features/courses/CourseDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="CourseList"
      screenOptions={{
        headerStyle: { backgroundColor: '#f8f9fa' },
        headerTitleStyle: { fontWeight: 'bold' },
        headerTintColor: '#333',
      }}
    >
      <Stack.Screen 
        name="CourseList" 
        component={CourseListScreen} 
        options={{ title: 'ShareViral Courses' }} 
      />
      <Stack.Screen 
        name="CourseDetail" 
        component={CourseDetailScreen} 
        options={{ title: 'Course Details' }} 
      />
    </Stack.Navigator>
  );
}
