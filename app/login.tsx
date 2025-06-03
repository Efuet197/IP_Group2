import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login({navigateTo}:{navigateTo?:(screenName: string, params?: {}) => void}) {
    const [name, setName] = useState<string>('');
    const [role, setRole] = useState<'mechanic'|'carOwner'>('carOwner');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [garageLocation, setGarageLocation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { signIn } = useAuth();

    const handleLogin = () => {
        // Implement login logic here
        console.log('Login pressed:', email, password);
        signIn(name,password)
        // router.push('/(tabs)')
    };
    const router=useRouter()
    const handleUpdateProfile = () => {
      console.log('Updating profile:', { name, password,garageLocation });
      router.push('/(tabs)/home')
      // navigateTo('CarOwnerDashboard');
    };
    return (
        <View style={styles.container}>
          <SafeAreaView style={styles.loginContainer}>
            <StatusBar style="light" />
            <Image
                source={require('@/assets/images/logo.png')}
                style={styles.appLogo}
            />
            <Text style={styles.loginTitle}>Login</Text>

            <View style={styles.inputGroup}>
                <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={Colors.appColors.gray}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                />
            </View>

            <View style={styles.inputGroup}>
                <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={Colors.appColors.gray}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                />
                <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
                >
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color={Colors.appColors.gray} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text style={styles.signupText}>
                Don't have an account yet? <Text style={styles.signupLink}>Sign up</Text>
                </Text>
            </TouchableOpacity>
            </SafeAreaView>
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
  loginContainer: {
    flex: 1,
    backgroundColor: Colors.appColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  loginTitle: {
    fontSize: 40,
    fontWeight: 'semibold',
    color: Colors.appColors.white,
    marginBottom: 50,
  },
  inputGroup: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a7373',
    borderColor:Colors.appColors.gray,
    borderWidth:2,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 5, 
  },
  input: {
    flex: 1,
    color: Colors.appColors.white,
    fontSize: 18,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  passwordToggle: {
    paddingLeft: 10,
  },
  loginButton: {
    backgroundColor: Colors.appColors.white,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  loginButtonText: {
    color: Colors.appColors.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  signupText: {
    color: Colors.appColors.white,
    fontSize: 16,
    marginTop: 20,
  },
  signupLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
