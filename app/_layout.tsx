import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';

// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  // const rootNavigationState=useRootNavigationState()
  // const navigatorReady=rootNavigationState?.key !=null
  const { isSignedIn, isLoading } = useAuth();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const router=useRouter()
  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }
  // useEffect(() => {
  //   if (loaded && navigatorReady) {
  //     SplashScreen.hideAsync();
  //     router.push('/welcome')
  //   }
  //   // if (!isLoading) {
  //   //   // Hide the splash screen once we know the auth state
  //   //   SplashScreen.hideAsync();
  //   // }
  // }, [isLoading]);
  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme !== 'dark' ? DarkTheme : DefaultTheme}>
        <Stack initialRouteName='splash'>
          {/* {!isLoading && !isSignedIn?
            <Stack.Screen name="index" options={{ headerShown: false }} />
            : */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* } */}
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="splash" options={{ headerShown: false }} />
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
