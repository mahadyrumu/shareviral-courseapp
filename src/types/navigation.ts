import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  CourseList: undefined;
  CourseDetail: { courseId: string };
};

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type CourseDetailRouteProp = RouteProp<RootStackParamList, 'CourseDetail'>;
