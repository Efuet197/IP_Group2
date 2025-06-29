import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Types based on your Prisma schema
export type UserRole = 'carOwner' | 'mechanic';

export interface MechanicProfile {
  id: string;
  experienceYears: number;
  expertise?: string;
  availabilityStatus?: boolean;
  workshopLocation: string;
  rating?: number;
  // reviews?: Review[]; // Optionally add if you want reviews in context
}

export interface Diagnostics {
  id: string;
  summary: string;
  recommendation: string;
  date:Date;
  tutorialVideo:string[];
}

export interface User {
  id: string;
  _id?: string;
  fullName: string;
  email?: string;
  phoneNumber?: number;
  location?: string;
  role: UserRole;
  mechanicProfile?: MechanicProfile;
  diagnostics:Diagnostics[]
}

interface AppContextType {
  isSignedIn:boolean;
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
  setIsSignedIn: (isSignedIn:boolean) => void
}

const defaultUser: User = {
    id: 'dummy-id',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: 1234567890,
    location: 'New York',
    role: 'carOwner',
    diagnostics:[]
    // createdAt: new Date().toISOString(),
    // updatedAt: new Date().toISOString(),
};

const AppContext = createContext<AppContextType>({
    isSignedIn:false,
    user: defaultUser,
    setUser: () => {},
    logout: () => {},
    setIsSignedIn: ()=>{}
});

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');
        
        if (token && storedUser) {
          console.log("Found user and token")
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsSignedIn(true);
        } else {
          console.log("Couldn't find user and token")
          setIsSignedIn(false);
          setUser(defaultUser);
        }
      } catch (e) {
        console.log("Setting to false")
        setIsSignedIn(false);
        // setUser(defaultUser);
      }
    };
    checkAuth();
  }, []);
  useEffect(() => {
    const persistUser = async () => {
      try {
        if (user && user.id !== defaultUser.id) {
          await AsyncStorage.setItem('user', JSON.stringify(user));
        }
      } catch (e) {
        console.error("Error persisting user:", e);
      }
    };
    persistUser();
  }, [user]);

  const logout = async () => {
    setUser(defaultUser);
    setIsSignedIn(false);
    try {
      await AsyncStorage.removeItem('carcare');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    } catch (e) {
      // handle error
    }
    // Add any additional logout logic here
  };

  return (
    <AppContext.Provider value={{ isSignedIn,user, setUser, logout,setIsSignedIn }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
