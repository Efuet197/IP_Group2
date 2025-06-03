// contexts/AuthContext.js
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useState } from 'react';

type AuthContextType = {
  isSignedIn: boolean;
  isLoading: boolean;
  signIn:(username: string, password: string) => Promise<void>
  signOut:()=>void
};

const AuthContext = createContext<AuthContextType>({
    isSignedIn:false,
    isLoading:false,
    signIn:async (username: string, password: string) => {},
    signOut:()=>{}
});

export function AuthProvider({ children }:{children:any}) {
  const [isSignedIn, setIsSignedIn] = useState(false); // Default to false
  const [isLoading, setIsLoading] = useState(true); // To manage splash screen
  const router=useRouter()
  // useEffect(() => {
  //   const checkAuthStatus = async () => {
  //     try {
  //       // Simulate an async check
  //       await new Promise(resolve => setTimeout(resolve, 1000));
  //       // setIsSignedIn(true); // Set to true if a token is found
  //       setIsSignedIn(false); // Keep it false for initial login demo
  //       setIsLoading(false);
  //     } finally {
  //       setIsLoading(false);
  //       SplashScreen.hideAsync(); // Hide splash screen once auth check is done
  //     }
  //   };
  //   checkAuthStatus();
  // }, []);

  const signIn = async (username:string, password:string) => {
    // Simulate API call for login
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('User signed in!');
    setIsSignedIn(true);
    router.push('/(tabs)/home')
  };

  const signOut = async () => {
    // Simulate API call for logout
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('User signed out!');
    setIsSignedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}