import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { syncData } from './src/services/sync';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

function AppContent() {
  const { isDark } = useTheme();
  
  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    // Initial sync on app load
    const performInitialSync = async () => {
      try {
        console.log('Starting initial sync...');
        await syncData();
        console.log('Initial sync complete.');
      } catch (error) {
        console.log('Initial sync failed (offline expected):', error);
      } finally {
        setIsSyncing(false);
      }
    };
    performInitialSync();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
