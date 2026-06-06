import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import CourseListScreen from '../features/courses/CourseListScreen';
import CourseDetailScreen from '../features/courses/CourseDetailScreen';
import { useTheme } from '../theme/ThemeContext';
import { TouchableOpacity, Text } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="CourseList"
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: 'bold' },
        contentStyle: { backgroundColor: colors.background }
      }}
    >
      <Stack.Screen 
        name="CourseList" 
        component={CourseListScreen} 
        options={{ 
          title: 'Available Courses',
          headerRight: () => (
            <TouchableOpacity onPress={toggleTheme} style={{ padding: 8 }}>
              <Text style={{ fontSize: 20 }}>{isDark ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>
          )
        }} 
      />
      <Stack.Screen 
        name="CourseDetail" 
        component={CourseDetailScreen} 
        options={{ title: 'Course Details' }} 
      />
    </Stack.Navigator>
  );
}
