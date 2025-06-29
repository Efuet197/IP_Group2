import { AppContextProvider } from '@/context/AppContext';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const router=useRouter()
  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }
  return (
    <AppContextProvider>
        <Stack initialRouteName='index'>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          {/* <Stack.Screen name="splash" options={{ headerShown: false }} /> */}
          {/* <Stack.Screen name="welcome" options={{ headerShown: false }} /> */}
        </Stack>
        <StatusBar style="auto" />
    </AppContextProvider>
  );
}
