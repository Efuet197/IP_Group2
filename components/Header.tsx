import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { GestureResponderEvent, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface headerProps {
    title:string
    onBackPress?:((event: GestureResponderEvent) => void)
}

const Header = ({ title, onBackPress }:headerProps) => (
  <ThemedView style={styles.header}>
    {onBackPress && (
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Icon name="chevron-left" size={24} color={Colors.light.tabIconDefault} />
      </TouchableOpacity>
    )}
    <ThemedText style={styles.headerTitle}>{title}</ThemedText>
  </ThemedView>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.appColors.primary,
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
    color: Colors.appColors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
export default Header