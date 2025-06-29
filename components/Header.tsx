import { Colors } from '@/constants/Colors';
import { Image } from 'expo-image';
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface headerProps {
    title:string
    onBackPress?:((event: GestureResponderEvent) => void)
}

const Header = ({ title, onBackPress }:headerProps) => (
  <View style={styles.header}>
    {onBackPress && (
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Icon name="chevron-left" size={24} color={Colors.light.tabIconDefault} />
      </TouchableOpacity>
    )}
    <Text style={styles.headerTitle}>
      {!onBackPress ?
      <Image
          source={require('@/assets/images/logo.png')}
          style={styles.appLogo}
      />
      :
      title
      }
    </Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.appColors.primary,
    paddingVertical: 15,
    // paddingTop:55,
    paddingHorizontal: 20,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  appLogo: {
    height: 40,
    width: 55,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    display:'flex',
    alignItems: 'center',
    columnGap:'.5em',
    color: Colors.appColors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
export default Header