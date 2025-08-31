import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // No custom fonts, hide splash immediately
    SplashScreen.hideAsync();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'TradePass™',
        }}
      />
      <Stack.Screen
        name="identity"
        options={{
          title: 'Identity Management',
        }}
      />
      <Stack.Screen
        name="biometric"
        options={{
          title: 'Biometric Setup',
        }}
      />
      <Stack.Screen
        name="government"
        options={{
          title: 'Government Verification',
        }}
      />
      <Stack.Screen
        name="credentials"
        options={{
          title: 'Credential Wallet',
        }}
      />
      <Stack.Screen
        name="gps"
        options={{
          title: 'GPS Tracking',
        }}
      />
    </Stack>
  );
} 