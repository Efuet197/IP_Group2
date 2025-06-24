// import { IconSymbol } from '@/components/ui/IconSymbol';
// import { Colors } from '@/constants/Colors';
import TabBar from '@/components/TabBar';
import { Tabs } from 'expo-router';
import React, { useState } from 'react';
// import { Platform } from 'react-native';

export default function TabLayout() {
  // const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState('Home');
  const handleTabPress = (route: string) => {
    // router.replace(`/${route}`)
  };

  return (
    <Tabs tabBar={props=><TabBar {...props} />} >
      <Tabs.Screen name="home" options={{headerShown:false}} />
      <Tabs.Screen name="mechanic" options={{headerShown:false}} />
      <Tabs.Screen name="profile" options={{headerShown:false}} />
    </Tabs>
    // <Tabs
    //   screenOptions={{
    //     tabBarActiveTintColor: Colors.appColors.accent,
    //     tabBarInactiveTintColor:'#ffffff',
    //     tabBarItemStyle:{
    //       display:'flex',
    //       alignSelf:'center',
    //       // margin
    //     },
    //     headerShown: false,
    //     tabBarStyle: Platform.select({
    //       ios: {
    //         // Use a transparent background on iOS to show the blur effect
    //         position: 'absolute',
    //       },
    //       default: {
    //         backgroundColor: Colors.appColors.primary,
    //         // height:60,
    //         position: 'absolute',
    //         borderTopWidth: 0,
    //         height: Platform.OS === 'ios' ? 90 : 60, // Adjust height for iOS safe area
    //         paddingBottom: Platform.OS === 'ios' ? 30 : 0,
    //         // marginBottom: Platform.OS === 'ios' ? 0 : 50,
    //         paddingTop: 10,
    //         shadowColor: '#000',
    //         shadowOffset: { width: 0, height: -2 },
    //         shadowOpacity: 0.1,
    //         shadowRadius: 3,
    //         elevation: 5,
    //       },
    //     }),
    //   }}>
    //   <Tabs.Screen
    //     name="home"
    //     options={{
    //       title: 'Home',
    //       tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="mechanic"
    //     options={{
    //       title: 'Mechanic',
    //       // tabBarStyle:{display:'none'},
    //       tabBarIcon: ({ color }) => <IconSymbol size={28} name="car.badge.gearshape" color={color} />,
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="profile"
    //     options={{
    //       title: 'Profile',
    //       tabBarIcon: ({ color }) => <IconSymbol size={28} name="person" color={color} />,
    //     }}
    //   />
    // </Tabs>
  );
}
