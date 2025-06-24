import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface ButtonProps {
    iconName?:string
    title:string
    color?:string
    textStyle:object
    iconSize?:number
    style:object
    navigateTo:(screenName: string, params?: {}) => void
    role:'mechanic'|'carOwner'
}

const RoleButton = ({ title, navigateTo, role,iconName, style, textStyle, iconSize = 24 }:ButtonProps) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={()=>navigateTo(role)}>
        {iconName && <Icon name={iconName} size={iconSize} color={Colors.appColors.textPrimary} style={styles.buttonIcon} />}
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  )
}

export default RoleButton

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.appColors.primary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonText: {
        color: Colors.appColors.textPrimary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonIcon: {
        marginRight: 10,
    },
})