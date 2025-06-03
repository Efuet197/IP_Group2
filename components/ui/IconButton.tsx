import { Colors } from '@/constants/Colors';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemedText } from '../ThemedText';

interface IconButtonProps {
    iconName:string
    title:string
    color?:string
    textColor?:string
    iconSize?:number
    style:object
    navigateTo:any
}

const IconButton = ({ iconName, title, navigateTo,iconSize = 40, color = Colors.appColors.primary, textColor = Colors.appColors.textSecondary, style }:IconButtonProps) => (
  <TouchableOpacity style={[styles.iconButton, style]} onPress={navigateTo}>
    <Icon name={iconName} size={iconSize} color={color} />
    {title && <ThemedText style={[styles.iconButtonText, { color: textColor }]}>{title}</ThemedText>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  iconButton: {
    backgroundColor: Colors.appColors.secondary,
    borderColor:Colors.appColors.primary,
    borderWidth:1,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%', // Adjust for grid layout
    aspectRatio: 1, // Make it square
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  iconButtonText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default IconButton