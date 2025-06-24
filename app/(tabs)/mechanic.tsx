import Header2 from '@/components/Header2';
import { Colors } from '@/constants/Colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const mechanicsData = [
  { id: '1', name: 'Adam Marmont', location: 'Chief Street Bomaka, Buea', phone: '+237671818471', expertise: 'Engine Specialist' },
  { id: '2', name: 'Henry Bright', location: 'Clerks Quaters, Buea', phone: '+237677853329', expertise: 'Electrical Systems' },
  { id: '3', name: 'Lewis Hall', location: 'Half Mile, Limbe', phone: '+237680689460', expertise: 'Diagnostics' },
  { id: '4', name: 'Jane Doe', location: 'Molyko, Buea', phone: '+237690123456', expertise: 'Brakes & Suspension' },
];

export default function Mechanic() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [mechanics, setMechanics] = useState<any[]>(mechanicsData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMechanics = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with your actual backend endpoint
        const response = await fetch('https://your-backend-api.com/api/mechanics');
        if (!response.ok) throw new Error('Failed to fetch mechanics');
        const data = await response.json();
        setMechanics(data);
      } catch (e: any) {
        setError('Could not load mechanics.');
      } finally {
        setLoading(false);
      }
    };
    fetchMechanics();
  }, []);

  const filteredMechanics = mechanics.filter(
    m =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.location.toLowerCase().includes(search.toLowerCase()) ||
      (m.expertise || '').toLowerCase().includes(search.toLowerCase())
  );

  const renderMechanicItem = ({ item }: { item: any }) => (
    <View style={styles.mechanicCard}>
      <View style={styles.mechanicCardHeader}>
        <Ionicons name="person-circle-outline" size={40} color={Colors.appColors.primary} style={{marginRight: 10}} />
        <View style={{flex:1}}>
          <Text style={styles.mechanicName}>{item.name}</Text>
          {item.expertise && (
            <View style={styles.mechanicExpertiseRow}>
              <MaterialIcons name="build" size={18} color={Colors.appColors.accent} />
              <Text style={styles.mechanicExpertise}>{item.expertise}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.callButton} onPress={() => {}}>
          <Ionicons name="call" size={20} color={Colors.appColors.white} />
        </TouchableOpacity>
      </View>
      <View style={styles.mechanicInfoRow}>
        <Ionicons name="location" size={18} color={Colors.appColors.primary} />
        <Text style={styles.mechanicLocation}>{item.location}</Text>
      </View>
      <View style={styles.mechanicInfoRow}>
        <Ionicons name="call" size={18} color={Colors.appColors.primary} />
        <Text style={styles.mechanicPhone}>{item.phone}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.findMechanicContainer}>
      <Header2 title="Find a Mechanic" />
      <View style={styles.filterBar}>
        <Ionicons name="search" size={22} color={Colors.appColors.primary} style={{marginRight: 8}} />
        <TextInput
          style={styles.filterInput}
          placeholder="Search by name, location, or expertise..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={Colors.appColors.gray}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.appColors.primary} style={{marginTop: 40}} />
      ) : error ? (
        <Text style={styles.emptyText}>{error}</Text>
      ) : (
        <FlatList
          data={filteredMechanics}
          renderItem={renderMechanicItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.findMechanicListContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No mechanics found.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  findMechanicContainer: {
    flex: 1,
    backgroundColor: Colors.appColors.secondary,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.appColors.white,
    borderRadius: 12,
    margin: 18,
    marginBottom: 0,
    paddingHorizontal: 14,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  filterInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.appColors.primary,
    paddingVertical: 6,
  },
  findMechanicListContent: {
    padding: 18,
    paddingTop: 12,
    gap: 16,
  },
  mechanicCard: {
    backgroundColor: Colors.appColors.white,
    borderRadius: 14,
    padding: 18,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  mechanicCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mechanicName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.appColors.primary,
  },
  mechanicExpertiseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  mechanicExpertise: {
    fontSize: 14,
    color: Colors.appColors.accent,
    marginLeft: 4,
  },
  mechanicInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
  mechanicLocation: {
    fontSize: 14,
    color: Colors.appColors.darkGray,
    marginLeft: 8,
  },
  mechanicPhone: {
    fontSize: 14,
    color: Colors.appColors.darkGray,
    marginLeft: 8,
  },
  callButton: {
    backgroundColor: Colors.appColors.primary,
    borderRadius: 8,
    padding: 10,
    marginLeft: 10,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.appColors.gray,
    fontSize: 16,
    marginTop: 40,
  },
});