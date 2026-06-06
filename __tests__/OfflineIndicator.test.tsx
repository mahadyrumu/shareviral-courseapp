import React from 'react';
import { render } from '@testing-library/react-native';
import OfflineIndicator from '../src/components/OfflineIndicator';
import NetInfo from '@react-native-community/netinfo';

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('OfflineIndicator Component', () => {
  let addEventListenerMock: jest.Mock;

  beforeEach(() => {
    addEventListenerMock = NetInfo.addEventListener as jest.Mock;
    addEventListenerMock.mockClear();
  });

  it('renders the offline banner when isConnected is false', () => {
    // Make the addEventListener call its callback immediately with offline status
    addEventListenerMock.mockImplementation((callback) => {
      callback({ isConnected: false });
      return jest.fn(); // return unsubscribe function
    });

    const { getByText } = render(<OfflineIndicator />);
    
    expect(getByText('You are currently offline.')).toBeTruthy();
  });

  it('renders nothing when isConnected is true', () => {
    // Make the addEventListener call its callback immediately with online status
    addEventListenerMock.mockImplementation((callback) => {
      callback({ isConnected: true });
      return jest.fn();
    });

    const { queryByText } = render(<OfflineIndicator />);
    
    expect(queryByText('You are currently offline.')).toBeNull();
  });
});
