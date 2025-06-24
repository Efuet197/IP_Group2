import Header2 from '@/components/Header2';
import { Colors } from '@/constants/Colors';
import { useAppContext, UserRole } from '@/context/AppContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const APP_VERSION = '1.0.0';
const APP_ENV = 'development';

const profile = () => {
  const { user, logout } = useAppContext();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>(user.fullName);
  const [phoneNumber, setPhoneNumber] = useState<string>(user.phoneNumber?.toString() || "");
  const [email, setEmail] = useState<string>(user.email || '');
  const [location, setLocation] = useState<string>(user.mechanicProfile?.workshopLocation || "");
  const [role, setRole] = useState<UserRole>(user.role);
  const router = useRouter();
  const handleSave = () => {
    // TODO: Save profile changes to backend
    setIsEditing(false);
  };
  const handleLogout = () => {
    logout();
    router.push('/');
  };
  const handleCancel = () => {
    setFullName(user.fullName);
    setPhoneNumber(user.phoneNumber?.toString() || "");
    setEmail(user.email || '');
    setLocation(user.mechanicProfile?.workshopLocation || "");
    setRole(user.role);
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header2 title="CarCare" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <LinearGradient
          colors={[Colors.appColors.primary, Colors.appColors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileCard}
        >
          <View style={styles.profileImageWrapper}>
            <View style={styles.profileImagePlaceholder}>
              <MaterialIcons name="person" size={80} color={Colors.appColors.gray} />
            </View>
          </View>
          <Text style={styles.profileName}>{fullName}</Text>
          <Text style={styles.profileRole}>{role === 'mechanic' ? 'Mechanic' : 'Car Owner'}</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(!isEditing)}>
            <MaterialIcons name={isEditing ? 'close' : 'edit'} size={24} color={Colors.appColors.primary} />
            <Text style={styles.editButtonText}>{isEditing ? 'Cancel' : 'Edit Profile'}</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Profile Details */}
        <View style={[styles.detailsSection, isEditing && styles.editingSection]}>
          <Text style={styles.sectionHeader}>Profile Details</Text>
          {isEditing ? (
            <>
              <View style={styles.inputRow}>
                <MaterialIcons name="person" size={20} color={Colors.appColors.primary} />
                <TextInput
                  style={styles.profileInput}
                  placeholder="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
              {user.phoneNumber && (
                <View style={styles.inputRow}>
                  <MaterialIcons name="phone" size={20} color={Colors.appColors.primary} />
                  <TextInput
                    style={styles.profileInput}
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                  />
                </View>
              )}
              {user.email && (
                <View style={styles.inputRow}>
                  <MaterialIcons name="email" size={20} color={Colors.appColors.primary} />
                  <TextInput
                    style={styles.profileInput}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              )}
              <View style={styles.inputRow}>
                <MaterialIcons name="location-on" size={20} color={Colors.appColors.primary} />
                <TextInput
                  style={styles.profileInput}
                  placeholder="Location"
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
              <View style={styles.inputRow}>
                <MaterialIcons name="badge" size={20} color={Colors.appColors.primary} />
                <TextInput
                  style={styles.profileInput}
                  placeholder="Role"
                  value={role}
                  onChangeText={(newText) => setRole(newText as UserRole)}
                />
              </View>
              <View style={styles.profileButtons}>
                <TouchableOpacity style={styles.profileSaveButton} onPress={handleSave}>
                  <Text style={[styles.profileButtonText, { color: 'white' }]}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileCancelButton} onPress={handleCancel}>
                  <Text style={styles.profileButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={styles.detailRow}>
                <MaterialIcons name="person" size={20} color={Colors.appColors.primary} />
                <Text style={styles.detailText}>{fullName}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialIcons name="badge" size={20} color={Colors.appColors.primary} />
                <Text style={styles.detailText}>{role === 'mechanic' ? 'Mechanic' : 'Car Owner'}</Text>
              </View>
              {user.phoneNumber ? (
                <View style={styles.detailRow}>
                  <MaterialIcons name="phone" size={20} color={Colors.appColors.primary} />
                  <Text style={styles.detailText}>{phoneNumber}</Text>
                </View>
              ) : null}
              {user.email ? (
                <View style={styles.detailRow}>
                  <MaterialIcons name="email" size={20} color={Colors.appColors.primary} />
                  <Text style={styles.detailText}>{email}</Text>
                </View>
              ) : null}
              <View style={styles.detailRow}>
                <MaterialIcons name="location-on" size={20} color={Colors.appColors.primary} />
                <Text style={styles.detailText}>{location}</Text>
              </View>
            </>
          )}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        {/* App Info Card */}
        <View style={styles.appInfoCard}>
          <Text style={styles.sectionHeader}>App Info</Text>
          <View style={styles.appInfoRow}>
            <MaterialIcons name="info" size={20} color={Colors.appColors.primary} />
            <Text style={styles.appInfoText}>Version: {APP_VERSION}</Text>
          </View>
          <View style={styles.appInfoRow}>
            <MaterialIcons name="build" size={20} color={Colors.appColors.primary} />
            <Text style={styles.appInfoText}>Environment: {APP_ENV}</Text>
          </View>
          <View style={styles.appInfoRow}>
            <MaterialIcons name="directions-car" size={20} color={Colors.appColors.primary} />
            <Text style={styles.appInfoText}>CarCare</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appColors.secondary,
  },
  scrollContent: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  profileCard: {
    width: '92%',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 18,
    paddingVertical: 32,
    marginTop: 18,
    marginBottom: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  profileImageWrapper: {
    marginBottom: 12,
    borderRadius: 64,
    borderWidth: 3,
    borderColor: Colors.appColors.white,
    padding: 4,
    backgroundColor: Colors.appColors.white,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.appColors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.appColors.white,
    marginBottom: 2,
    marginTop: 2,
    textShadowColor: 'rgba(0,0,0,0.12)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  profileRole: {
    fontSize: 16,
    color: Colors.appColors.white,
    marginBottom: 10,
    opacity: 0.85,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.appColors.white,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginTop: 8,
    elevation: 2,
  },
  editButtonText: {
    color: Colors.appColors.primary,
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
  detailsSection: {
    width: '92%',
    alignSelf: 'center',
    backgroundColor: Colors.appColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  editingSection: {
    borderWidth: 2,
    borderColor: Colors.appColors.primary,
    backgroundColor: '#f7fafc',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.appColors.primary,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  profileInput: {
    backgroundColor: Colors.appColors.lightGray,
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    color: Colors.appColors.darkGray,
    marginLeft: 10,
  },
  profileButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 18,
  },
  profileSaveButton: {
    backgroundColor: Colors.appColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },
  profileCancelButton: {
    backgroundColor: Colors.appColors.gray,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },
  profileButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: Colors.appColors.darkGray,
    marginLeft: 10,
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: Colors.appColors.gray,
    alignSelf: 'center',
    marginVertical: 18,
    opacity: 0.3,
  },
  appInfoCard: {
    width: '92%',
    alignSelf: 'center',
    backgroundColor: Colors.appColors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 1,
  },
  appInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  appInfoText: {
    fontSize: 15,
    color: Colors.appColors.darkGray,
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: Colors.appColors.primary,
    paddingVertical: 15,
    marginVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});