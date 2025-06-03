import { Colors } from '@/constants/Colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function History({navigateTo}:{navigateTo:(screenName: string, params?: {}) => void}) {

  const historyData = [
    { id: '1', date: 'May 31, 2025', fault: 'Low Engine Oil Pressure', severity: 'High' },
    { id: '2', date: 'May 31, 2025', fault: 'Low Engine Oil Pressure', severity: 'Low' },
    { id: '3', date: 'May 31, 2025', fault: 'Low Engine Oil Pressure', severity: 'Medium' },
    { id: '4', date: 'May 31, 2025', fault: 'Low Engine Oil Pressure', severity: 'High' },
    { id: '5', date: 'May 30, 2025', fault: 'Brake Fluid Low', severity: 'Medium' },
    { id: '6', date: 'May 29, 2025', fault: 'Tire Pressure Imbalance', severity: 'Low' },
    { id: '7', date: 'May 30, 2025', fault: 'Brake Fluid Low', severity: 'Medium' },
    { id: '8', date: 'May 29, 2025', fault: 'Tire Pressure Imbalance', severity: 'Low' },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return Colors.appColors.red;
      case 'medium':
        return Colors.appColors.orange;
      case 'low':
        return Colors.appColors.green;
      default:
        return Colors.appColors.gray;
    }
  };

  const renderHistoryItem = ({ item }: { item: typeof historyData[0] }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => navigateTo('DiagnosisResult', { diagnosis: item })}
    >
      <View style={styles.historyItemDate}>
        <MaterialIcons name="calendar-month" size={25} color={Colors.appColors.primary} />
        
      </View>
      <View style={styles.historyItemDetails}>
        <Text style={styles.historyItemDateText}>{item.date}</Text>
        <Text style={styles.historyItemFault}>{item.fault}</Text>
        <View style={[styles.severityTag, { backgroundColor: getSeverityColor(item.severity) }]}>
          <Text style={styles.severityTagText}>{item.severity}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.historyContainer}>
      {/* <StatusBar style="dark" /> */}
      <View style={styles.historyHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigateTo('CarOwnerDashboard')}>
          <Ionicons name="chevron-back" size={30} color={Colors.appColors.white} />
        </TouchableOpacity>
        <Text style={styles.historyTitle}>History</Text>
      </View>
      <FlatList
        data={historyData}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.historyListContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    historyContainer: {
    flex: 1,
    backgroundColor: Colors.appColors.secondary,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 20,
    paddingRight:1,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
    paddingLeft:0,
    backgroundColor: Colors.appColors.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.appColors.lightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.appColors.white,
    marginLeft: 10,
  },
  historyListContent: {
    padding: 20,
    paddingBottom: 70,
    marginBottom:30
  },
  historyItem: {
    backgroundColor: Colors.appColors.white,
    borderColor:Colors.appColors.gray,
    borderWidth:2,
    borderRadius: 10,
    padding: 15,
    paddingVertical:30,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  historyItemDate: {
    width: 50,
    marginRight: 15,
    alignItems: 'center',
    justifyContent:'flex-start'
  },
  historyItemDateText: {
    fontSize: 14,
    color: Colors.appColors.darkGray,
    fontWeight: 'bold',
  },
  historyItemDetails: {
    flex: 1,
  },
  historyItemFault: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.appColors.primary,
    marginBottom: 10,
  },
  severityTag: {
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  severityTagText: {
    color: Colors.appColors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});