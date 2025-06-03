import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet } from 'react-native';

const SplashScreen = ({navigateTo}:{navigateTo?:(screenName: string, params?: {}) => void}) => {
  // Simulate loading or initial animation
  const { isSignedIn, isLoading } = useAuth();
  const router=useRouter()
  React.useEffect(() => {
      const timer = setTimeout(() => {
        // router.push('/signup')
      }, 4000); // Show splash for 2 seconds
      return () => clearTimeout(timer);
  }, []);

  return (
    <ThemedView style={styles.splashContainer}>
      <Image
        source={require('@/assets/images/logo.png')} // Placeholder for CarCare logo
        style={styles.splashLogo}
      />
      <ThemedText style={styles.splashText2}>Diagnose</ThemedText>
      <ThemedText style={styles.splashText2}>Understand</ThemedText>
      <ThemedText style={styles.splashText2}>Repair</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: Colors.appColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
  splashText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: Colors.appColors.textPrimary,
    marginBottom: 30,
  },
  splashText2: {
    marginBottom: 10,
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.appColors.textPrimary,
  },
})
export default SplashScreen