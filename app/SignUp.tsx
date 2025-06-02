import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignUp({navigateTo}:{navigateTo:(screenName: string, params?: {}) => void}) {
    const [name, setName] = useState<string>('');
    const [role, setRole] = useState<'mechanic'|'carOwner'>('carOwner');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [garageLocation, setGarageLocation] = useState('');
    const router=useRouter()
    const handleUpdateProfile = () => {
      console.log('Updating profile:', { name, password,garageLocation });
      router.push('/(tabs)/index')
      // navigateTo('CarOwnerDashboard');
    };
    return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.profileFormContent}>
            <ThemedView style={styles.loginSignUpHeader}>
              <Image
                source={require('@/assets/images/logo.png')}
                style={styles.appLogo}
              />
            <ThemedText style={styles.loginSignUpTitle}>Sign Up</ThemedText>
            </ThemedView>
            <ThemedView style={styles.loginSignUpContent}>
            <TouchableOpacity style={[styles.button, styles.roleButton,role==='carOwner' && styles.roleBg]} onPress={()=>setRole('carOwner')}>
                {/* <Icon name={iconName} size={iconSize} color={Colors.appColors.textPrimary} style={styles.buttonIcon} /> */}
                <ThemedText style={[styles.buttonText, styles.roleButtonText,role==='carOwner' && styles.roleBg]}>I'm a Car Owner</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.roleButton,role==='mechanic' && styles.roleBg]} onPress={()=>setRole('mechanic')}>
                {/* <Icon name={iconName} size={iconSize} color={Colors.appColors.textPrimary} style={styles.buttonIcon} /> */}
                <ThemedText style={[styles.buttonText, styles.roleButtonText,role==='mechanic' && styles.roleBg]}>I'm a Mechanic</ThemedText>
            </TouchableOpacity>
            </ThemedView>
            <TextInput
              style={styles.input}
              placeholder="Phone number"
              value={name}
              onChangeText={setName}
              placeholderTextColor={Colors.appColors.gray}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              placeholderTextColor={Colors.appColors.gray}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor={Colors.appColors.gray}
            />
            {role==='mechanic' &&
             <TextInput
              style={styles.input}
              placeholder="Garage Location"
              value={garageLocation}
              onChangeText={setGarageLocation}
              placeholderTextColor={Colors.appColors.gray}
            />
            }
            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleUpdateProfile}>
                {/* <Icon name={iconName} size={iconSize} color={Colors.appColors.textPrimary} style={styles.buttonIcon} /> */}
                <ThemedText style={[,styles.submitButtonText]}>Submit</ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.bottomText} >Already have an account? <ThemedText style={styles.loginText} >Login</ThemedText> </ThemedText>
          </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal:10,
    backgroundColor: Colors.appColors.primary,
  },
  appLogo: {
    height: 78,
    width: 120,
    marginBottom:20
  },
  loginSignUpHeader: {
    backgroundColor: Colors.appColors.primary,
    paddingVertical: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  loginSignUpTitle: {
    fontSize: 32,
    fontWeight: 'semibold',
    color: Colors.appColors.textPrimary,
  },
  loginSignUpContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.appColors.primary,
    marginBottom: 30,
  },
  button: {
      backgroundColor: Colors.appColors.textPrimary,
      borderColor:Colors.dark.text,
      borderWidth:2,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
  },
  buttonText: {
      color: Colors.dark.text,
      fontSize: 16,
      fontWeight: 'bold',
  },
  buttonIcon: {
      marginRight: 10,
  },
  roleButton: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: Colors.appColors.primary,
    borderRadius: 10,
  },
  roleBg:{
    backgroundColor:Colors.appColors.accent,
    color:'black'
  },
  roleButtonText: {
    fontSize: 18,
  },
  submitButton:{
    backgroundColor:'white',
    marginTop: 15,
    marginBottom: 15,
    color:Colors.appColors.primary
  },
  submitButtonText:{
    color:Colors.appColors.textSecondary,
    fontWeight:'semibold',
    fontSize:20
  },
  profileFormContent: {
    padding: 20,
  },
  input: {
    backgroundColor: '#3a7373',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
    borderColor:Colors.appColors.gray,
    borderWidth:2,
    color: Colors.appColors.gray,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  bottomText:{
    textAlign:'center'
  },
  loginText:{
    fontWeight:'bold'
  }
});
