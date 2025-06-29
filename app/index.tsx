import { Colors } from '@/constants/Colors';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

const SplashScreen = ({navigateTo}:{navigateTo?:(screenName: string, params?: {}) => void}) => {
  const { isSignedIn} = useAppContext();
  const router=useRouter()
  React.useEffect(() => {
    const timer = setTimeout(() => {
      isSignedIn?router.push('/(tabs)/home'):router.push('/login')
    }, 4000);
    return () => clearTimeout(timer);
  }, []);
  // React.useEffect(() => {
  //   isSignedIn && router.push('/(tabs)/home')
  // }, [isSignedIn]);

  const handleScreenTouch=(e:any)=>{
    e.preventDefault()
      router.push('/signup')
  }
  return (
      // <SafeAreaView style={styles.container} >
    <ImageBackground
      source={require('@/assets/images/car-bg-2.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
        <TouchableOpacity onPress={handleScreenTouch} style={{flex:1}} activeOpacity={1}>
          <StatusBar style="light" />
          <View style={styles.splashContainer}>
            <Image
              source={require('@/assets/images/logo.png')} // Placeholder for CarCare logo
              style={styles.splashLogo}
            />
            <Text style={styles.splashText2}>Diagnose</Text>
            <Text style={styles.splashText2}>Understand</Text>
            <Text style={styles.splashText2}>Repair</Text>
          </View>
        </TouchableOpacity>
    </ImageBackground>
      // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContainer: {
    flex: 1,
    backgroundColor:'rgba(26,103,113,0.45)',
    backdropFilter:'blur(6px)',
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
    textAlign:'center',
    marginBottom: 5,
    paddingVertical: 3,
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.appColors.textPrimary,
  },
})
export default SplashScreen