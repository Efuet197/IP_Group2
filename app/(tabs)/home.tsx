import CarOwnerHome from '@/components/screens/CarOwnerHom';
import { DiagnosisResult } from '@/components/screens/diagnosticResult';
import { RecordSound } from '@/components/screens/recordSound';
import ScanDashboard from '@/components/screens/scanDashboard';
import SignUp from '@/components/screens/SignUp';
import SplashScreen from '@/components/screens/splash';
import History from '@/components/screens/viewHistory';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
    const [currentScreen, setCurrentScreen] = useState('CarOwnerDashboard'); // Initial screen
    const [routeParams, setRouteParams] = useState({});
    const router=useRouter()
    const { isSignedIn,isLoading } = useAuth();
    const navigateTo = (screenName:string, params = {}) => {
      console.log("Helllo")
        setRouteParams(params);
        setCurrentScreen(screenName);
    };
    useEffect(()=>{
      if(isLoading || !isSignedIn){
        // router.push('/splash')
        // console.log("Not auth")
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
          case 'RecordSound':
            return <RecordSound navigateTo={navigateTo} />;
          case 'ScanLight':
            return <ScanDashboard navigateTo={navigateTo} />;
          case 'History':
            return <History navigateTo={navigateTo} />;
          case 'DiagnosisResult':
            return <DiagnosisResult navigateTo={navigateTo} />;
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
