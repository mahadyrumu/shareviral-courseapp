import React from 'react';
import { render } from '@testing-library/react-native';
import Tag from '../src/components/Tag';

describe('Tag Component', () => {
  it('renders correctly with the provided label', () => {
    const { getByText } = render(<Tag label="React Native" />);
    
    // Check if the text exists
    expect(getByText('React Native')).toBeTruthy();
  });
});
