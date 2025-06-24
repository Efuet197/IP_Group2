import { Colors } from '@/constants/Colors';
import { useAppContext } from '@/context/AppContext';
import { loginUser } from '@/utils/authApi';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Login({navigateTo}:{navigateTo?:(screenName: string, params?: {}) => void}) {
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router=useRouter()
    const { setUser } = useAppContext();

    const handleLogin = async () => {
        setError(null);
        if (!email || !password) {
            setError('Email and password are required.');
            return;
        }
        // Simple email regex
        // if (!/^\S+@\S+\.\S+$/.test(email)) {
        //     setError('Please enter a valid email address.');
        //     return;
        // }
        setLoading(true);
        try {
            const user = await loginUser(email, password);
            console.log(user)
            if(user){
              setUser(user);
              router.push('/(tabs)/home');
            }
        } catch(err:any) {
          console.log(err)
            setError('Login failed. '+ err.response.data.message+ " Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };
    return (
      <SafeAreaView style={styles.safeArea}>
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
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.loginContainer}>
                <StatusBar style="light" />
                <Image
                    source={require('@/assets/images/logo.png')}
                    style={styles.appLogo}
                />
                <Text style={styles.loginTitle}>Login</Text>
                <View style={{width:'90%'}}>
                  <View style={styles.inputGroup}>
                      <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor={Colors.appColors.gray}
                      keyboardType="email-address"
                      value={email}
                      onChangeText={setEmail}
                      returnKeyType="next"
                      autoCapitalize="none"
                      autoCorrect={false}
                      textContentType="username"
                      importantForAutofill="yes"
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
                      returnKeyType="done"
                      textContentType="password"
                      autoCapitalize="none"
                      autoCorrect={false}
                      importantForAutofill="yes"
                      />
                      <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={() => setShowPassword(!showPassword)}
                      >
                      <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color={Colors.appColors.gray} />
                      </TouchableOpacity>
                  </View>
                </View>
                {error && (
                  <Text style={{ color: 'red', marginBottom: 10,width:'90%' }}>{error}</Text>
                )}
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
                    {loading ? (
                      <ActivityIndicator size="small" color={Colors.appColors.primary} />
                    ) : (
                      <Text style={styles.loginButtonText}>Login</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/signup')}>
                    <Text style={styles.signupText}>
                    Don't have an account yet? <Text style={styles.signupLink}>Sign up</Text>
                    </Text>
                </TouchableOpacity>
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
    backgroundColor: 'rgba(26,103,113,0.45)', // fallback color for background
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: '100%',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor:'rgba(26,103,113,0.45)',
    backdropFilter:'blur(5px)',
    paddingHorizontal: 10,
  },
  appLogo: {
    height: 78,
    width: 120,
    marginBottom:20
  },
  loginTitle: {
    fontSize: 40,
    fontWeight: 'semibold',
    color: Colors.appColors.white,
    marginBottom: 25,
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
    paddingVertical: 8,
  },
  passwordToggle: {
    paddingLeft: 10,
  },
  loginButton: {
    backgroundColor: Colors.appColors.white,
    width: '90%',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
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
