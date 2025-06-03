import Header from '@/components/Header';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('Adam Marmont');
  const [phoneNumber, setPhoneNumber] = useState('+237671818471');
  const [location, setLocation] = useState('Chief Street Bomaka, Buea');
  const [role, setRole] = useState('Mechanic');

  const handleSave = () => {
    console.log('Saving profile:', { fullName, phoneNumber, location, role });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Revert changes if cancelled (in a real app, you'd load original data)
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={styles.mechanicProfileContainer}>
      {/* <StatusBar style="light" /> */}
      <Header title="CarCare" />
      <View style={styles.mechanicProfileHeader}>
        {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color={Colors.appColors.white} />
        </TouchableOpacity> */}
        {/* <Text style={styles.mechanicProfileTitle}>CarCare</Text> */}
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <MaterialIcons name={isEditing ? 'close' : 'edit'} size={30} color={Colors.appColors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.mechanicProfileContent}>
        <View style={styles.profileImagePlaceholder}>
          <MaterialIcons name="person" size={80} color={Colors.appColors.gray} />
        </View>

        {isEditing ? (
          <>
            <TextInput
              style={styles.profileInput}
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
            />
            <TextInput
              style={styles.profileInput}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <TextInput
              style={styles.profileInput}
              placeholder="Location"
              value={location}
              onChangeText={setLocation}
            />
            <TextInput
              style={styles.profileInput}
              placeholder="Role"
              value={role}
              onChangeText={setRole}
            />
            <View style={styles.profileButtons}>
              <TouchableOpacity style={styles.profileSaveButton} onPress={handleSave}>
                <Text style={[styles.profileButtonText,{color:'white'}]}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileCancelButton} onPress={handleCancel}>
                <Text style={styles.profileButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.profileName}>{fullName}</Text>
            <Text style={styles.profileRole}>{role}</Text>
            <View style={styles.profileDetailRow}>
              <MaterialIcons name="phone" size={20} color={Colors.appColors.primary} />
              <Text style={styles.profileDetailText}>{phoneNumber}</Text>
            </View>
            <View style={styles.profileDetailRow}>
              <MaterialIcons name="location-on" size={20} color={Colors.appColors.primary} />
              <Text style={styles.profileDetailText}>{location}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default profile

const styles = StyleSheet.create({
  mechanicProfileContainer: {
    flex: 1,
    backgroundColor: Colors.appColors.secondary,
  },
  mechanicProfileHeader: {
    // position:'absolute',
    // top:100,
    // right:80,
    // backgroundColor: Colors.appColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  mechanicProfileTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.appColors.white,
  },
  mechanicProfileContent: {
    alignItems: 'center',
    padding: 20,
    paddingTop:0,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.appColors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.appColors.primary,
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.appColors.primary,
    marginBottom: 5,
  },
  profileRole: {
    fontSize: 18,
    color: Colors.appColors.darkGray,
    marginBottom: 20,
  },
  profileDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileDetailText: {
    fontSize: 16,
    color: Colors.appColors.darkGray,
    marginLeft: 10,
  },
  profileInput: {
    backgroundColor: Colors.appColors.white,
    width: '90%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    fontSize: 16,
    color: Colors.appColors.darkGray,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  profileButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: 20,
  },
  profileSaveButton: {
    backgroundColor: Colors.appColors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  profileCancelButton: {
    backgroundColor: Colors.appColors.gray,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  profileButtonText:{
    color:'black'
  }
})