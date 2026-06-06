import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface TagProps {
  label: string;
}

export default function Tag({ label }: TagProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.tagBackground, borderColor: colors.tagBorder }]}>
      <Text style={[styles.text, { color: colors.tagText }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e0f2fe',
    borderWidth: 1,
    borderColor: '#bae6fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 12,
    color: '#0369a1',
    fontWeight: '600',
  },
});
