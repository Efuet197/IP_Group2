import Header from '@/components/Header';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Mechanic() {
  const router = useRouter();

  const mechanicsData = [
    { id: '1', name: 'Adam Marmont', location: 'Chief Street Bomaka, Buea', phone: '+237671818471' },
    { id: '2', name: 'Henry Bright', location: 'Clerks Quaters, Buea', phone: '+237677853329' },
    { id: '3', name: 'Lewis Hall', location: 'Half Mile, Limbe', phone: '+237680689460' },
  ];

  const renderMechanicItem = ({ item }: { item: typeof mechanicsData[0] }) => (
    <TouchableOpacity style={styles.mechanicItem}>
        <Text style={styles.mechanicName}>
            <Ionicons name="person-circle-outline" size={25} color={Colors.appColors.primary} />
            {item.name}
        </Text>
        <Text style={styles.mechanicLocation}>
            <Ionicons name="location" size={25} color={Colors.appColors.primary} />
            {item.location}
        </Text>
        <Text style={styles.mechanicPhone}>
            <Ionicons name="call" size={20} color={Colors.appColors.primary} />
            {item.phone}
        </Text>
        <TouchableOpacity style={styles.callButton} >
            <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.findMechanicContainer}>
      <Header title="CarCare" />
      {/* <View style={styles.findMechanicHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color={Colors.appColors.darkGray} />
        </TouchableOpacity>
        <Text style={styles.findMechanicTitle}>Find Mechanic</Text>
      </View> */}
      <FlatList
        data={mechanicsData}
        renderItem={renderMechanicItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.findMechanicListContent}
      />
    </SafeAreaView>
  );
}

const styles=StyleSheet.create({
  findMechanicContainer: {
    flex: 1,
    backgroundColor: Colors.appColors.secondary,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 20,
    paddingRight:1,
  },
  findMechanicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.appColors.primary, // Changed to primary as per design
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  findMechanicTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.appColors.white,
    marginLeft: 20,
  },
  findMechanicListContent: {
    padding: 20,
    marginTop:20,
    display:'flex',
    flex:1,
    gap:'1em'
  },
  mechanicItem: {
    backgroundColor: Colors.appColors.white,
    borderWidth:2,
    borderColor:Colors.appColors.primary,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  mechanicName: {
    display:'flex',
    alignItems:'center',
    gap:'.5em',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.appColors.primary,
    marginBottom: 10,
  },
  mechanicLocation: {
    display:'flex',
    alignItems:'center',
    gap:'.5em',
    fontSize: 14,
    color: Colors.appColors.darkGray,
    marginBottom: 10,
  },
  mechanicPhone: {
    display:'flex',
    alignItems:'center',
    gap:'.5em',
    fontSize: 14,
    color: Colors.appColors.darkGray,
    marginBottom: 10,
  },
  callButton: {
    position:'absolute',
    top:0,
    right:15,
    backgroundColor: Colors.appColors.primary,
    width: 80,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    marginVertical:10
},
callButtonText: {
    color: Colors.appColors.white,
    fontSize: 18,
    fontWeight: 'semibold',
},
})