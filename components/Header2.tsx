import { Colors } from '@/constants/Colors';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { FlatList, GestureResponderEvent, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface headerProps {
    title?: string;
    onBackPress?: (event: GestureResponderEvent) => void;
}

const mockNotifications = [
  { id: '1', title: 'Diagnosis Complete', message: 'Your last scan result is ready.' },
  { id: '2', title: 'Maintenance Reminder', message: 'Time for your scheduled car checkup.' },
  { id: '3', title: 'New Mechanic Nearby', message: 'A new mechanic is available in your area.' },
];

const Header2 = ({ title, onBackPress }: headerProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  return (
    <LinearGradient
      colors={['white', 'white']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Image
            source={require('@/assets/images/logo-color.png')}
            style={styles.appLogo}
          />
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.profileIcon} onPress={() => setModalVisible(true)}>
            <Ionicons name="notifications" color={Colors.appColors.primary} size={28} />
            {notifications.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notifications.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      {/* Notification Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notifications</Text>
            {notifications.length === 0 ? (
              <Text style={styles.noNotifications}>No notifications</Text>
            ) : (
              <FlatList
                data={notifications}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={styles.notificationItem}>
                    <Ionicons name="alert-circle" size={22} color={Colors.appColors.primary} style={{ marginRight: 10 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.notificationTitle}>{item.title}</Text>
                      <Text style={styles.notificationMessage}>{item.message}</Text>
                    </View>
                  </View>
                )}
              />
            )}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  headerLeft: {
    flex: 1,
  },
  appLogo: {
    height: 40,
    width: 55,
  },
  headerRight: {
    alignItems: 'center',
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: Colors.appColors.accent,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    zIndex: 2,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
    minHeight: 250,
    maxHeight: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.appColors.primary,
    marginBottom: 16,
  },
  noNotifications: {
    color: Colors.appColors.gray,
    textAlign: 'center',
    marginVertical: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    backgroundColor: '#f7fafc',
    borderRadius: 10,
    padding: 10,
  },
  notificationTitle: {
    fontWeight: 'bold',
    color: Colors.appColors.primary,
    fontSize: 15,
  },
  notificationMessage: {
    color: Colors.appColors.darkGray,
    fontSize: 13,
    marginTop: 2,
  },
  closeButton: {
    marginTop: 18,
    backgroundColor: Colors.appColors.primary,
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Header2;