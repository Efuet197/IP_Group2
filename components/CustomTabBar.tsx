import { Colors } from '@/constants/Colors';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Adjust based on your icon library

const { width } = Dimensions.get('window');

interface TabItem {
  id: string;
  icon: string;
  label: string;
  route: string;
}

interface CustomTabBarProps {
  activeTab: string;
  onTabPress: (route: string) => void;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({ activeTab, onTabPress }) => {
  const [pressedTab, setPressedTab] = useState<string | null>(null);
  const scaleAnimations = useRef<{ [key: string]: Animated.Value }>({});
  const backgroundAnimations = useRef<{ [key: string]: Animated.Value }>({});

  const tabs: TabItem[] = [
    { id: '1', icon: 'home', label: 'Home', route: 'Home' },
    { id: '2', icon: 'car-wrench', label: 'Mechanic', route: 'Reports' },
    { id: '3', icon: 'settings', label: 'Settings', route: 'Settings' },
  ];

  // Initialize animations for each tab
  tabs.forEach(tab => {
    if (!scaleAnimations.current[tab.id]) {
      scaleAnimations.current[tab.id] = new Animated.Value(1);
    }
    if (!backgroundAnimations.current[tab.id]) {
      backgroundAnimations.current[tab.id] = new Animated.Value(0);
    }
  });

  const handlePressIn = (tabId: string) => {
    setPressedTab(tabId);
    
    // Scale down animation (hover effect)
    Animated.parallel([
      Animated.spring(scaleAnimations.current[tabId], {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(backgroundAnimations.current[tabId], {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = (tabId: string) => {
    setPressedTab(null);
    
    // Scale back to normal
    Animated.parallel([
      Animated.spring(scaleAnimations.current[tabId], {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(backgroundAnimations.current[tabId], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleTabPress = (route: string, tabId: string) => {
    // Quick feedback animation
    Animated.sequence([
      Animated.spring(scaleAnimations.current[tabId], {
        toValue: 0.9,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.spring(scaleAnimations.current[tabId], {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ]).start();

    onTabPress(route);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.route;
          const isPressed = pressedTab === tab.id;
          
          const backgroundColorInterpolation = backgroundAnimations.current[tab.id].interpolate({
            inputRange: [0, 1],
            outputRange: ['transparent', 'rgba(59, 130, 246, 0.1)'],
          });

          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={1}
              onPressIn={() => handlePressIn(tab.id)}
              onPressOut={() => handlePressOut(tab.id)}
              onPress={() => handleTabPress(tab.route, tab.id)}
              style={styles.tabItem}
            >
              <Animated.View
                style={[
                  styles.tabContent,
                  {
                    transform: [{ scale: scaleAnimations.current[tab.id] }],
                    backgroundColor: backgroundColorInterpolation,
                  },
                  isActive && styles.activeTabContent,
                ]}
              >
                <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
                  <Icon
                    name={tab.icon}
                    size={24}
                    color={isActive ? '#ffffff' : Colors.appColors.primary}
                    style={styles.icon}
                  />
                  {isActive && <View style={styles.activeIndicator} />}
                </View>
                <Text style={[
                  styles.tabLabel,
                  isActive && styles.activeTabLabel,
                  isPressed && styles.pressedTabLabel
                ]}>
                  {tab.label}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    maxWidth:'80%',
    margin:'auto',
    borderRadius:20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabBar: {
    flexDirection: 'row',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    minHeight: 60,
    width: '100%',
    position: 'relative',
  },
  activeTabContent: {
    backgroundColor: Colors.appColors.primary,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 4,
    padding: 4,
  },
  activeIconContainer: {
    transform: [{ scale: 1.1 }],
  },
  icon: {
    textAlign: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
    marginTop: 2,
  },
  activeTabLabel: {
    color: '#ffffff',
    fontWeight: '700',
  },
  pressedTabLabel: {
    color: Colors.appColors.primary,
  },
});

export default CustomTabBar;