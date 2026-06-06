import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';

export const LAST_SYNCED_KEY = '@last_synced_time';

export default function OfflineIndicator() {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const { colors } = useTheme();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    const fetchLastSynced = async () => {
      try {
        const time = await AsyncStorage.getItem(LAST_SYNCED_KEY);
        if (time) {
          const date = new Date(time);
          setLastSynced(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      } catch (e) {
        // ignore
      }
    };

    fetchLastSynced();
    const interval = setInterval(fetchLastSynced, 10000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  if (isConnected === false) {
    return (
      <View style={[styles.offlineBanner, { backgroundColor: colors.danger }]}>
        <Text style={[styles.offlineText, { color: colors.dangerText }]}>You are currently offline.</Text>
      </View>
    );
  }

  if (lastSynced) {
    return (
      <View style={[styles.syncedBanner, { backgroundColor: colors.surfaceVariant }]}>
        <Text style={[styles.syncedText, { color: colors.textSecondary }]}>Last synced: {lastSynced}</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  offlineBanner: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncedBanner: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineText: {
    fontSize: 12,
    fontWeight: '600',
  },
  syncedText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
