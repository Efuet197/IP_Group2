// import CustomTabBar from '@/components/CustomTabBar';
import CarOwnerHome from '@/components/screens/CarOwnerHom';
import { DiagnosisResult } from '@/components/screens/diagnosticResult';
import { RecordSound } from '@/components/screens/recordSound';
import ScanDashboard from '@/components/screens/scanDashboard';
import History, { diag } from '@/components/screens/viewHistory';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
    const [currentScreen, setCurrentScreen] = useState('CarOwnerDashboard'); // Initial screen
    const [routeParams, setRouteParams] = useState<{ diagnosis: diag|null }>({diagnosis:null});
    const [activeTab, setActiveTab] = useState('Home');

    const router=useRouter()
    const navigateTo = (screenName:string, params? :any) => {
        // params && setRouteParams(params.diagnosis);
        setCurrentScreen(screenName);
    };
    const renderScreen = () => {
        switch (currentScreen) {
          case 'CarOwnerDashboard':
            return <CarOwnerHome navigateTo={navigateTo} />;
          case 'RecordSound':
            return <RecordSound navigateTo={navigateTo} />;
          case 'ScanLight':
            return <ScanDashboard navigateTo={navigateTo} />;
          case 'History':
            return <History navigateTo={navigateTo} setRouteParams={setRouteParams} />;
          case 'DiagnosisResult':
            return <DiagnosisResult navigateTo={navigateTo} diagnosis={routeParams.diagnosis} />;
          case 'DiagnosisResult2':
            // return <DiagnosisResultScreen2 onNavigate={navigateTo} />; 
          case 'FindMechanic':
            // return <FindMechanicScreen onNavigate={navigateTo} />;
          case 'MechanicDashboard':
            // return <MechanicDashboard onNavigate={navigateTo} />;
          case 'MechanicProfileForm':
            // return <MechanicProfileForm onNavigate={navigateTo} />;
          default:
            return <Text>Screen Not Found</Text>;
        }
      };
    
      return (
      <View style={styles.appContainer}>
        {renderScreen()}
      </View>
      );
}

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: Colors.appColors.lightGray,
    },
});
