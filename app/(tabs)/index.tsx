import CarOwnerHome from '@/components/screens/CarOwnerHom';
import SignUp from '@/components/screens/SignUp';
import SplashScreen from '@/components/screens/splash';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
    const [currentScreen, setCurrentScreen] = useState('CarOwnerDashboard'); // Initial screen
    const [routeParams, setRouteParams] = useState({});
    const router=useRouter()
    const navigateTo = (screenName:string, params = {}) => {
        setRouteParams(params);
        setCurrentScreen(screenName);
    };
    useEffect(()=>{
      if(currentScreen==='Splash'){
        router.push('/splash')
      }
    },[])
    const renderScreen = () => {
        switch (currentScreen) {
          case 'Splash':
            return <SplashScreen navigateTo={() => navigateTo('LoginSignUp')} />;
          case 'LoginSignUp':
            return <SignUp navigateTo={navigateTo} />;
          case 'CarOwnerDashboard':
            return <CarOwnerHome navigateTo={navigateTo} />;
          case 'ScanLight':
            // return <ScanLightScreen onNavigate={navigateTo} />;
          case 'RecordSound':
            // return <RecordSoundScreen onNavigate={navigateTo} />;
          case 'History':
            // return <HistoryScreen onNavigate={navigateTo} />;
          case 'DiagnosisResult':
            // return <DiagnosisResultScreen onNavigate={navigateTo} route={{ params: routeParams }} />;
          case 'DiagnosisResult2':
            // return <DiagnosisResultScreen2 onNavigate={navigateTo} />; 
          case 'FindMechanic':
            // return <FindMechanicScreen onNavigate={navigateTo} />;
          case 'MechanicDashboard':
            // return <MechanicDashboard onNavigate={navigateTo} />;
          case 'MechanicProfileForm':
            // return <MechanicProfileForm onNavigate={navigateTo} />;
          default:
            return <ThemedText>Screen Not Found</ThemedText>;
        }
      };
    
      return <ThemedView style={styles.appContainer}>{renderScreen()}</ThemedView>;
}

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: Colors.appColors.lightGray,
    },
});
