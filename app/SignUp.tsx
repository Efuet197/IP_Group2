import { Colors } from '@/constants/Colors';
import { useAppContext } from '@/context/AppContext';
import { registerUser } from '@/utils/authApi';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, Dimensions, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenH=Dimensions.get('window').height
const screenW=Dimensions.get('window').width

export default function SignUp({navigateTo}:{navigateTo:(screenName: string, params?: {}) => void}) {
    const [name, setName] = useState<string>('');
    const [role, setRole] = useState<'mechanic'|'carOwner'>('carOwner');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [garageLocation, setGarageLocation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [signupMethod, setSignupMethod] = useState<'email' | 'phone'>('email');
    const router = useRouter()
    const { setUser } = useAppContext();
    const handleSignUp = async () => {
      setError(null);
      // Validation
      if (!name || !password || !confirmPassword) {
        setError('Full name and password are required.');
        return;
      }
      if (signupMethod === 'email') {
        if (!email) {
          setError('Email is required.');
          return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          setError('Please enter a valid email address.');
          return;
        }
      } else {
        if (!phoneNumber) {
          setError('Phone number is required.');
          return;
        }
        if (!/^\d{7,}$/.test(phoneNumber)) {
          setError('Please enter a valid phone number.');
          return;
        }
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (role === 'mechanic' && !garageLocation) {
        setError('Garage location is required for mechanics.');
        return;
      }
      setLoading(true);
      try {
        const user = await registerUser({
          fullName: name,
          email: signupMethod === 'email' ? email : undefined,
          password,
          phoneNumber: signupMethod === 'phone' ? phoneNumber : undefined,
          role,
          workshopLocation: role === 'mechanic' ? garageLocation : undefined,
        });
        setUser(user);
        router.push('/(tabs)/home');
      } catch(err) {
        setError('Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    return (
      <SafeAreaView style={styles.safeArea} >
        <ImageBackground
          source={require('@/assets/images/car-bg-2.jpg')}
          style={styles.background}
          resizeMode="cover"
        >  
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.secondContainer}>
              <StatusBar style="light" />
                <View style={styles.profileFormContent}>
                  <View style={styles.loginSignUpHeader}>
                    {/* <Image
                      source={require('@/assets/images/logo.png')}
                      style={styles.appLogo}
                    /> */}
                  <Text style={styles.loginSignUpTitle}>Sign Up</Text>
                  </View>
                  <View style={styles.loginSignUpContent}>
                    <TouchableOpacity style={[styles.button, styles.roleButton,role==='carOwner' && styles.roleBg]} onPress={()=>setRole('carOwner')}>
                        {/* <Icon name={iconName} size={iconSize} color={Colors.appColors.textPrimary} style={styles.buttonIcon} /> */}
                        <Text style={[styles.buttonText, styles.roleButtonText,role==='carOwner' && styles.roleBg]}>I'm a Car Owner</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.roleButton,role==='mechanic' && styles.roleBg]} onPress={()=>setRole('mechanic')}>
                        {/* <Icon name={iconName} size={iconSize} color={Colors.appColors.textPrimary} style={styles.buttonIcon} /> */}
                        <Text style={[styles.buttonText, styles.roleButtonText,role==='mechanic' && styles.roleBg]}>I'm a Mechanic</Text>
                    </TouchableOpacity>
                  </View>
                  <KeyboardAvoidingView behavior={Platform.OS==='ios'?"padding":"height"} >

                    <TextInput
                      style={styles.input}
                      placeholder="Full Name"
                      value={name}
                      onChangeText={setName}
                      placeholderTextColor={Colors.dark.text}
                    />
                    <View style={{width:'100%',gap:8, flexDirection: 'row', justifyContent: 'center', marginBottom: 15 }}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: signupMethod === 'email' ? Colors.appColors.accent : 'white',
                          padding: 8,
                          borderRadius: 6,
                          flex:1
                        }}
                        onPress={() => setSignupMethod('email')}
                      >
                        <Text style={{textAlign:'center' ,color: signupMethod === 'email' ? 'black' : Colors.appColors.primary, fontWeight: 'bold' }}>Use Email</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          backgroundColor: signupMethod === 'phone' ? Colors.appColors.accent : 'white',
                          padding: 8,
                          borderRadius: 6,
                          flex:1
                        }}
                        onPress={() => setSignupMethod('phone')}
                      >
                        <Text style={{textAlign:'center'  ,color: signupMethod === 'phone' ? 'black' : Colors.appColors.primary, fontWeight: 'bold' }}>Use Phone number</Text>
                      </TouchableOpacity>
                    </View>
                    {signupMethod === 'email' ? (
                      <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholderTextColor={Colors.dark.text}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    ) : (
                      <TextInput
                        style={styles.input}
                        placeholder="Phone number"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholderTextColor={Colors.dark.text}
                        keyboardType="phone-pad"
                      />
                    )}
                    <View style={styles.inputGroup}>
                      <TextInput
                        style={styles.inputPasword}
                        placeholder="Password"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                        placeholderTextColor={Colors.dark.text}
                      />
                      <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={() => setShowPassword(!showPassword)}
                      >
                      <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color={Colors.appColors.gray} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.inputGroup}>
                      <TextInput
                        style={styles.inputPasword}
                        placeholder="Confirm Password"
                        secureTextEntry={!showPassword2}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholderTextColor={Colors.dark.text}
                      />
                      <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={() => setShowPassword2(!showPassword2)}
                      >
                      <Ionicons name={showPassword2 ? 'eye-off' : 'eye'} size={24} color={Colors.appColors.gray} />
                      </TouchableOpacity>
                    </View>
                    {role==='mechanic' &&
                      <TextInput
                        style={styles.input}
                        placeholder="Garage Location"
                        value={garageLocation}
                        onChangeText={setGarageLocation}
                        placeholderTextColor={Colors.dark.text}
                      />
                    }
                  </KeyboardAvoidingView>
                  {error && (
                    <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
                  )}
                  <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSignUp} disabled={loading}>
                      {loading ? (
                        <ActivityIndicator size="small" color={Colors.appColors.primary} />
                      ) : (
                        <Text style={[styles.submitButtonText]}>Sign up</Text>
                      )}
                  </TouchableOpacity>
                  <Text style={styles.bottomText} >Already have an account? <Text onPress={() => router.push('/login')} style={styles.loginText} >Login</Text> </Text>
                </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(26,103,113,.51)', // fallback color for background
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(26,103,113,0.45)', // ensure bg color covers all
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: screenH,
  },
  container: {
    // removed flex settings from here
  },
  secondContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(26,103,113,0.45)',
    // removed flex and flexDirection
  },
  appLogo: {
    height: 78,
    width: 120,
    marginBottom:20
  },
  loginSignUpHeader: {
    // paddingVertical: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  loginSignUpTitle: {
    fontSize: 40,
    fontWeight: 'semibold',
    color: Colors.appColors.textPrimary,
    paddingBottom:8,
  },
  loginSignUpContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
      backgroundColor: Colors.appColors.textPrimary,
      borderColor:Colors.dark.text,
      borderWidth:2,
      paddingVertical: 8,
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
    color:Colors.appColors.primary,
  },
  submitButtonText:{
    color:Colors.appColors.primary,
    fontWeight:'bold',
    fontSize:20
  },
  profileFormContent: {
    padding: 20,
    paddingHorizontal: 10,
    width:'90%'
  },
  inputGroup: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a7373',
    borderRadius: 10,
    marginBottom: 20,
    borderColor:Colors.appColors.gray,
    borderWidth:2,
    paddingHorizontal: 10,
    paddingVertical: 5, 
  },
  input: {
    flex:1,
    backgroundColor: '#3a7373',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 18,
    borderColor:Colors.appColors.gray,
    borderWidth:2,
    color: Colors.dark.text,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  inputPasword: {
    flex: 1,
    color: Colors.appColors.white,
    fontSize: 18,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  passwordToggle: {
    paddingLeft: 1,
  },
  bottomText:{
    textAlign:'center',
    color:'white'
  },
  loginText:{
    fontWeight:'bold',
    color:'white'
  }
});
