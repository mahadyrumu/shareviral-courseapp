import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LAST_SYNCED_KEY = '@last_synced_time';

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(state.isConnected === false);
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
    // Refresh the sync time every 10 seconds just in case it changes
    const interval = setInterval(fetchLastSynced, 10000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={[styles.container, isOffline ? styles.offlineBg : styles.onlineBg]}>
      {isOffline && <Text style={styles.textOffline}>You are currently offline.</Text>}
      {lastSynced && <Text style={isOffline ? styles.textOffline : styles.textOnline}>Last synced: {lastSynced}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  offlineBg: {
    backgroundColor: '#dc3545',
  },
  onlineBg: {
    backgroundColor: '#e9ecef',
  },
  textOffline: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  textOnline: {
    color: '#6c757d',
    fontSize: 12,
    fontWeight: '500',
  },
});
