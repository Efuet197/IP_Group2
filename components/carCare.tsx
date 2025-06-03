import React, { useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // For handling safe areas on different devices
import Icon from 'react-native-vector-icons/FontAwesome'; // Assuming react-native-vector-icons is installed

// --- Color Palette ---
const Colors = {
  primary: '#008080', // A vibrant blue, similar to the design
  secondary: '#FFFFFF', // White
  textPrimary: '#FFFFFF', // White text on primary background
  textSecondary: '#333333', // Dark text on white background
  accent: '#FFD700', // Gold/Yellow for accents like engine light
  gray: '#CCCCCC',
  lightGray: '#F5F5F5',
};

// --- Reusable Components ---

const Card = ({ children, style }:{ children:any, style:any }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const Button = ({ title, onPress, iconName, style, textStyle, iconSize = 24 }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    {iconName && <Icon name={iconName} size={iconSize} color={Colors.textPrimary} style={styles.buttonIcon} />}
    <Text style={[styles.buttonText, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

const IconButton = ({ iconName, title, onPress, iconSize = 40, color = Colors.primary, textColor = Colors.textSecondary, style }) => (
  <TouchableOpacity style={[styles.iconButton, style]} onPress={onPress}>
    <Icon name={iconName} size={iconSize} color={color} />
    {title && <Text style={[styles.iconButtonText, { color: textColor }]}>{title}</Text>}
  </TouchableOpacity>
);

const Header = ({ title, onBackPress }) => (
  <View style={styles.header}>
    {onBackPress && (
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Icon name="chevron-left" size={24} color={Colors.textPrimary} />
      </TouchableOpacity>
    )}
    <Text style={styles.headerTitle}>{title}</Text>
  </View>
);

// --- Screens ---

const SplashScreen = ({ onFinishLoading }) => {
  // Simulate loading or initial animation
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onFinishLoading();
    }, 4000); // Show splash for 2 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.splashContainer}>
      <Image
        source={{ uri: 'https://placehold.co/150x150/2196F3/FFFFFF?text=CarCare' }} // Placeholder for CarCare logo
        style={styles.splashLogo}
      />
      <Text style={styles.splashText}>CarCare</Text>
    </View>
  );
};

const LoginSignUpScreen = ({ onSelectRole }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginSignUpHeader}>
        <Text style={styles.loginSignUpTitle}>CarCare</Text>
      </View>
      <View style={styles.loginSignUpContent}>
        <Button
          title="I'm a Car Owner"
          onPress={() => onSelectRole('carOwner')}
          style={styles.roleButton}
          textStyle={styles.roleButtonText}
        />
        <Button
          title="I'm a Mechanic"
          onPress={() => onSelectRole('mechanic')}
          style={styles.roleButton}
          textStyle={styles.roleButtonText}
        />
      </View>
    </SafeAreaView>
  );
};

const CarOwnerDashboard = ({ onNavigate }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="CarCare" />
      <View style={styles.dashboardGrid}>
        <IconButton
          iconName="camera"
          title="Scan Light"
          onPress={() => onNavigate('ScanLight')}
          color={Colors.primary}
          textColor={Colors.textSecondary}
          style={styles.dashboardButton}
        />
        <IconButton
          iconName="microphone"
          title="Record Sound"
          onPress={() => onNavigate('RecordSound')}
          color={Colors.primary}
          textColor={Colors.textSecondary}
          style={styles.dashboardButton}
        />
        <IconButton
          iconName="history"
          title="View History"
          onPress={() => onNavigate('History')}
          color={Colors.primary}
          textColor={Colors.textSecondary}
          style={styles.dashboardButton}
        />
        <IconButton
          iconName="wrench"
          title="Find Mechanic"
          onPress={() => onNavigate('FindMechanic')}
          color={Colors.primary}
          textColor={Colors.textSecondary}
          style={styles.dashboardButton}
        />
      </View>
    </SafeAreaView>
  );
};

const ScanLightScreen = ({ onNavigate }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Scan Light" onBackPress={() => onNavigate('CarOwnerDashboard')} />
      <View style={styles.cameraPreview}>
        {/* Placeholder for camera view */}
        <View style={styles.cameraFrame}>
          <Icon name="camera" size={80} color={Colors.accent} />
          <Text style={styles.cameraText}>Camera Preview</Text>
        </View>
      </View>
      <View style={styles.scanControls}>
        <TouchableOpacity style={styles.scanButton} onPress={() => onNavigate('DiagnosisResult2')}>
          <View style={styles.scanButtonInner} />
        </TouchableOpacity>
        <Button
          title="Cancel"
          onPress={() => onNavigate('CarOwnerDashboard')}
          style={styles.cancelButton}
          textStyle={styles.cancelButtonText}
        />
      </View>
    </SafeAreaView>
  );
};

const RecordSoundScreen = ({ onNavigate }) => {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, start/stop audio recording here
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Record Sound" onBackPress={() => onNavigate('CarOwnerDashboard')} />
      <View style={styles.recordContainer}>
        <View style={styles.waveformPlaceholder}>
          <Icon name="signal" size={100} color={Colors.gray} />
          <Text style={styles.waveformText}>Audio Waveform</Text>
        </View>
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recordButtonActive]}
          onPress={toggleRecording}
        >
          <Icon name="circle" size={60} color={isRecording ? 'red' : Colors.secondary} />
        </TouchableOpacity>
        <Text style={styles.recordingStatus}>{isRecording ? 'Recording...' : 'Tap to Record'}</Text>
      </View>
    </SafeAreaView>
  );
};

const HistoryScreen = ({ onNavigate }) => {
  const historyData = [
    {
      id: '1',
      date: 'Apr 12, 2024',
      issue: 'Crankshaft Position Sensor Malfunction',
      severity: 'HIGH',
      status: 'HIGH',
      suggestions: 'Stop the car immediately and contact a mechanic.',
    },
    {
      id: '2',
      date: 'Mar 6, 2024',
      issue: 'Crankshaft Position Sensor Malfunction',
      severity: 'LOW',
      status: 'LOW',
      suggestions: 'Monitor engine performance closely.',
    },
    {
      id: '3',
      date: 'Mar 1, 2024',
      issue: 'No issues detected',
      severity: 'LOW',
      status: 'LOW',
      suggestions: 'Regular maintenance is recommended.',
    },
  ];

  const renderHistoryItem = ({ item }) => (
    <Card style={styles.historyCard}>
      <Text style={styles.historyDate}>{item.date}</Text>
      <Text style={styles.historyIssue}>{item.issue}</Text>
      <View style={styles.historySeverityContainer}>
        <Text style={styles.historySeverityLabel}>Severity:</Text>
        <Text style={[styles.historySeverity, item.severity === 'HIGH' && styles.historySeverityHigh]}>
          {item.severity}
        </Text>
        <Text style={[styles.historyStatus, item.status === 'HIGH' && styles.historyStatusHigh]}>
          {item.status}
        </Text>
      </View>
      {item.suggestions && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Suggestions</Text>
          <Text style={styles.suggestionsText}>{item.suggestions}</Text>
        </View>
      )}
      {item.issue !== 'No issues detected' && (
        <View style={styles.historyActions}>
          <Button title="View Details" onPress={() => onNavigate('DiagnosisResult', { diagnosis: item })} style={styles.historyActionButton} textStyle={styles.historyActionButtonText} />
        </View>
      )}
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="History" onBackPress={() => onNavigate('CarOwnerDashboard')} />
      <FlatList
        data={historyData}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.historyList}
      />
    </SafeAreaView>
  );
};

const DiagnosisResultScreen = ({ onNavigate, route }) => {
  const { diagnosis } = route.params || {
    diagnosis: {
      issue: 'ENGINE ISSUE DETECTED',
      severity: 'HIGH',
      details: 'Crankshaft Position Sensor Malfunction',
      suggestions: 'Stop the car immediately and contact a mechanic about accessing the drive.',
    },
  }; // Default for testing

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Diagnosis Result" onBackPress={() => onNavigate('History')} />
      <ScrollView contentContainerStyle={styles.diagnosisResultContent}>
        <Card style={styles.diagnosisCard}>
          <View style={styles.diagnosisHeaderIcon}>
            <Icon name="car" size={80} color={Colors.accent} />
          </View>
          <Text style={styles.diagnosisIssueTitle}>{diagnosis.issue}</Text>
          <Text style={styles.diagnosisSeverity}>Severity: {diagnosis.severity}</Text>
          <Text style={styles.diagnosisDetails}>{diagnosis.details}</Text>
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Suggestions</Text>
            <Text style={styles.suggestionsText}>{diagnosis.suggestions}</Text>
          </View>
        </Card>
        <View style={styles.diagnosisActions}>
          <Button title="Save" onPress={() => console.log('Save diagnosis')} style={styles.actionButton} />
          <Button title="Share" onPress={() => console.log('Share diagnosis')} style={styles.actionButton} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const DiagnosisResultScreen2 = ({ onNavigate }) => {
  const { diagnosis } = {
    diagnosis: {
      issue: 'ENGINE ISSUE DETECTED',
      severity: 'HIGH',
      details: 'Crankshaft Position Sensor Malfunction',
      suggestions: 'Stop the car immediately and contact a mechanic about accessing the drive.',
    },
  }; // Default for testing

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Diagnosis Result" onBackPress={() => onNavigate('History')} />
      <ScrollView contentContainerStyle={styles.diagnosisResultContent}>
        <Card style={styles.diagnosisCard}>
          <View style={styles.diagnosisHeaderIcon}>
            <Icon name="car" size={80} color={Colors.accent} />
          </View>
          <Text style={styles.diagnosisIssueTitle}>{diagnosis.issue}</Text>
          <Text style={styles.diagnosisSeverity}>Severity: {diagnosis.severity}</Text>
          <Text style={styles.diagnosisDetails}>{diagnosis.details}</Text>
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Suggestions</Text>
            <Text style={styles.suggestionsText}>{diagnosis.suggestions}</Text>
          </View>
        </Card>
        <View style={styles.diagnosisActions}>
          <Button title="Save" onPress={() => console.log('Save diagnosis')} style={styles.actionButton} />
          <Button title="Share" onPress={() => console.log('Share diagnosis')} style={styles.actionButton} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const FindMechanicScreen = ({ onNavigate }) => {
  const mechanics = [
    { id: '1', name: "John's Auto Repair", distance: '0.5 mi', rating: 4.5 },
    { id: '2', name: "Quick Lube & Tune", distance: '1.2 mi', rating: 4.0 },
    { id: '3', name: "City Auto Service", distance: '2.0 mi', rating: 4.8 },
  ];

  const renderMechanicItem = ({ item }) => (
    <Card style={styles.mechanicCard}>
      <Text style={styles.mechanicName}>{item.name}</Text>
      <View style={styles.mechanicDetails}>
        <Icon name="star" size={16} color={Colors.accent} />
        <Text style={styles.mechanicRating}>{item.rating}</Text>
        <Text style={styles.mechanicDistance}>{item.distance}</Text>
      </View>
      <Button title="View Profile" onPress={() => console.log('View mechanic profile')} style={styles.viewProfileButton} />
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Find Mechanic" onBackPress={() => onNavigate('CarOwnerDashboard')} />
      <View style={styles.mapPlaceholder}>
        {/* Placeholder for map view */}
        <Icon name="map-marker" size={80} color={Colors.gray} />
        <Text style={styles.mapText}>Map View</Text>
      </View>
      <FlatList
        data={mechanics}
        renderItem={renderMechanicItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.mechanicList}
      />
    </SafeAreaView>
  );
};

const MechanicDashboard = ({ onNavigate }:{onNavigate:(screenName: string, params?: {}) => void}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Mechanic Dashboard" />
      <View style={styles.mechanicDashboardContent}>
        <Button
          title="Add/Update Profile"
          onPress={() => onNavigate('MechanicProfileForm')}
          style={styles.mechanicDashboardButton}
        />
        <Button
          title="Logout"
          onPress={() => onNavigate('LoginSignUp')} // Or back to Splash
          style={[styles.mechanicDashboardButton, styles.logoutButton]}
        />
      </View>
    </SafeAreaView>
  );
};

const MechanicProfileForm = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [garageLocation, setGarageLocation] = useState('');

  const handleUpdateProfile = () => {
    console.log('Updating profile:', { name, contactInfo, garageLocation });
    onNavigate('MechanicDashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Mechanic Profile Form" onBackPress={() => onNavigate('MechanicDashboard')} />
      <ScrollView contentContainerStyle={styles.profileFormContent}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={Colors.gray}
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Info"
          value={contactInfo}
          onChangeText={setContactInfo}
          placeholderTextColor={Colors.gray}
        />
        <TextInput
          style={styles.input}
          placeholder="Garage Location"
          value={garageLocation}
          onChangeText={setGarageLocation}
          placeholderTextColor={Colors.gray}
        />
        <Button title="Update" onPress={handleUpdateProfile} style={styles.updateProfileButton} />
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Main App Component ---
const Car = () => {
  const [currentScreen, setCurrentScreen] = useState('Splash'); // Initial screen
  const [routeParams, setRouteParams] = useState({});

  const navigateTo = (screenName:string, params = {}) => {
    setRouteParams(params);
    setCurrentScreen(screenName);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Splash':
        return <SplashScreen onFinishLoading={() => navigateTo('LoginSignUp')} />;
      case 'LoginSignUp':
        return <LoginSignUpScreen onSelectRole={(role:'mechanic'|'carOwner') => navigateTo(role === 'carOwner' ? 'CarOwnerDashboard' : 'MechanicDashboard')} />;
      case 'CarOwnerDashboard':
        return <CarOwnerDashboard onNavigate={navigateTo} />;
      case 'ScanLight':
        return <ScanLightScreen onNavigate={navigateTo} />;
      case 'RecordSound':
        return <RecordSoundScreen onNavigate={navigateTo} />;
      case 'History':
        return <HistoryScreen onNavigate={navigateTo} />;
      case 'DiagnosisResult':
        return <DiagnosisResultScreen onNavigate={navigateTo} route={{ params: routeParams }} />;
      case 'DiagnosisResult2':
        return <DiagnosisResultScreen2 onNavigate={navigateTo} />; 
      case 'FindMechanic':
        return <FindMechanicScreen onNavigate={navigateTo} />;
      case 'MechanicDashboard':
        return <MechanicDashboard onNavigate={navigateTo} />;
      case 'MechanicProfileForm':
        return <MechanicProfileForm onNavigate={navigateTo} />;
      default:
        return <Text>Screen Not Found</Text>;
    }
  };

  return <View style={styles.appContainer}>{renderScreen()}</View>;
};

// --- Styles ---
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Card styles
  card: {
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  // Button styles
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 10,
  },
  // Icon Button (Dashboard) styles
  iconButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%', // Adjust for grid layout
    aspectRatio: 1, // Make it square
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  iconButtonText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Splash Screen
  splashContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  splashText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },

  // Login/Sign Up Screen
  loginSignUpHeader: {
    backgroundColor: Colors.primary,
    paddingVertical: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 30,
  },
  loginSignUpTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  loginSignUpContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  roleButton: {
    width: '80%',
    marginBottom: 20,
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
  roleButtonText: {
    fontSize: 18,
  },

  // Car Owner Dashboard
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex:1,
    alignContent:'center',
    justifyContent: 'space-around',
    padding: 10,
    marginTop: 20,
  },
  dashboardButton: {
    marginBottom: 20,
  },

  // Scan Light Screen
  cameraPreview: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden', // Ensures content stays within rounded borders
  },
  cameraFrame: {
    width: '90%',
    height: '90%',
    borderWidth: 3,
    borderColor: Colors.accent,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  cameraText: {
    color: Colors.gray,
    marginTop: 10,
    fontSize: 16,
  },
  scanControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 30,
  },
  scanButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: Colors.lightGray,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  scanButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.secondary,
  },
  cancelButton: {
    backgroundColor: Colors.gray,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: Colors.textSecondary,
  },

  // Record Sound Screen
  recordContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  waveformPlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: Colors.secondary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  waveformText: {
    color: Colors.gray,
    marginTop: 10,
    fontSize: 16,
  },
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: Colors.lightGray,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  recordButtonActive: {
    backgroundColor: 'red',
  },
  recordingStatus: {
    marginTop: 20,
    fontSize: 18,
    color: Colors.textSecondary,
    fontWeight: 'bold',
  },

  // History Screen
  historyList: {
    paddingVertical: 10,
  },
  historyCard: {
    marginBottom: 10,
  },
  historyDate: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 5,
  },
  historyIssue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    marginBottom: 5,
  },
  historySeverityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  historySeverityLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 5,
  },
  historySeverity: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'green', // Default for LOW/No issues
  },
  historySeverityHigh: {
    color: 'red',
  },
  historyStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 'auto', // Pushes to the right
    color: 'green',
  },
  historyStatusHigh: {
    color: 'red',
  },
  suggestionsContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    paddingTop: 10,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    marginBottom: 5,
  },
  suggestionsText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  historyActions: {
    marginTop: 15,
    alignItems: 'flex-end',
  },
  historyActionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  historyActionButtonText: {
    fontSize: 14,
  },

  // Diagnosis Result Screen
  diagnosisResultContent: {
    paddingVertical: 20,
  },
  diagnosisCard: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  diagnosisHeaderIcon: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    padding: 20,
    marginBottom: 20,
  },
  diagnosisIssueTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    marginBottom: 10,
    textAlign: 'center',
  },
  diagnosisSeverity: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  diagnosisDetails: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  diagnosisActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 15,
  },
  actionButton: {
    width: '45%',
    borderRadius: 10,
  },

  // Find Mechanic Screen
  mapPlaceholder: {
    height: 200,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  mapText: {
    color: Colors.gray,
    marginTop: 10,
    fontSize: 16,
  },
  mechanicList: {
    paddingVertical: 10,
  },
  mechanicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mechanicName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    flex: 1,
  },
  mechanicDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mechanicRating: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 5,
    marginRight: 10,
  },
  mechanicDistance: {
    fontSize: 14,
    color: Colors.gray,
  },
  viewProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },

  // Mechanic Dashboard
  mechanicDashboardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mechanicDashboardButton: {
    width: '80%',
    marginBottom: 20,
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
  logoutButton: {
    backgroundColor: 'red',
  },

  // Mechanic Profile Form
  profileFormContent: {
    padding: 20,
  },
  input: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
    color: Colors.textSecondary,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  updateProfileButton: {
    marginTop: 20,
    width: '100%',
    borderRadius: 10,
  },
});

export default Car;
