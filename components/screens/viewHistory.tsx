import { Colors } from '@/constants/Colors';
import { useAppContext } from '@/context/AppContext';
import { API_BASE_URL } from '@/utils/authApi';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type diag={
  _id:string,
  tutorialVideo:string,
  summary: string,
  fault:string,
  severity:string,
  recommendation:string,
  createdAt:string
}
interface componentProps {
  navigateTo:(screenName: string, params?: {}) => void
  setRouteParams:()=>void
}

export default function History({navigateTo,setRouteParams}: {navigateTo:(screenName: string, params?: {}) => void,setRouteParams:React.Dispatch<React.SetStateAction<{
    diagnosis: diag | null;
}>>}) {
  const { user } = useAppContext();
  const historyData = [
    { id: '1', date: 'May 31, 2025', fault: 'Low Engine Oil Pressure', severity: 'High', summary: 'Engine oil pressure dropped below safe level.' },
    { id: '2', date: 'May 31, 2025', fault: 'Low Engine Oil Pressure', severity: 'Low', summary: 'Minor oil pressure fluctuation.' },
    { id: '3', date: 'May 31, 2025', fault: 'Low Engine Oil Pressure', severity: 'Medium', summary: 'Oil pressure warning, check soon.' },
    { id: '4', date: 'May 31, 2025', fault: 'Low Engine Oil Pressure', severity: 'High', summary: 'Critical oil pressure issue.' },
    { id: '5', date: 'May 30, 2025', fault: 'Brake Fluid Low', severity: 'Medium', summary: 'Brake fluid below recommended level.' },
    { id: '6', date: 'May 29, 2025', fault: 'Tire Pressure Imbalance', severity: 'Low', summary: 'Tire pressure slightly off.' },
    { id: '7', date: 'May 30, 2025', fault: 'Brake Fluid Low', severity: 'Medium', summary: 'Brake fluid warning.' },
    { id: '8', date: 'May 29, 2025', fault: 'Tire Pressure Imbalance', severity: 'Low', summary: 'Minor tire pressure issue.' },
  ];
  const [diagnostics,setDiagnostics]=useState<diag[]>([])
  // Stats
  const totalScans = historyData.length;
  const lastScan = historyData[0]?.date;
  const mostCommonFault = historyData.reduce((acc, cur) => {
    acc[cur.fault] = (acc[cur.fault] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const mostCommonFaultName = Object.keys(mostCommonFault).reduce((a, b) => mostCommonFault[a] > mostCommonFault[b] ? a : b, Object.keys(mostCommonFault)[0] || '');

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

  const renderHistoryItem = ({ item }: { item: diag }) => (
    <TouchableOpacity
      key={item._id}
      style={styles.historyItem}
      onPress={() => {
        setRouteParams({ diagnosis: item })
        navigateTo('DiagnosisResult', { diagnosis: item })
      }}
      activeOpacity={0.8}
    >
      <View style={styles.historyItemIconCol}>
        <MaterialIcons name="calendar-month" size={25} color={Colors.appColors.primary} style={{marginBottom: 8}} />
        <MaterialCommunityIcons name="chevron-right" size={28} color={Colors.appColors.gray} />
      </View>
      <View style={styles.historyItemDetails}>
        <Text style={styles.historyItemDateText}>{item.createdAt.slice(0,11)}</Text>
        <Text style={styles.historyItemFault}>{item.fault}</Text>
        <Text style={styles.historyItemSummary}>{item.summary || 'No summary available.'}</Text>
        <View style={[styles.severityTag, { backgroundColor: getSeverityColor(item.severity || "") }]}> 
          <Text style={styles.severityTagText}>{item.severity}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    const fetchHistory = async () => {
      // setLoading(true);
      // setError(null);
      try {
        console.log(user)
        const response = await axios.get(`${API_BASE_URL}/diagnostics/${user.id || user._id}`);
        console.log(response)
        if(response.data){
          setDiagnostics(response.data)
        }
      } catch (e: any) {
        console.log('Error.Could not fetch history.',e);
      } finally {
      }
    };
    fetchHistory();
  }, []);
  return (
    <SafeAreaView style={styles.historyContainer}>
      <View style={styles.historyHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigateTo('CarOwnerDashboard')}>
          <Ionicons name="chevron-back" size={30} color={Colors.appColors.white} />
        </TouchableOpacity>
        <Text style={styles.historyTitle}>History</Text>
      </View>
      {/* Stats Banner */}
      <View style={styles.statsBanner}>
        <View style={[styles.statsBannerItem,{marginLeft:10}]}>
          <MaterialIcons name="history" size={22} color={Colors.appColors.primary} />
          <Text style={styles.statsBannerValue}>{totalScans}</Text>
          <Text style={styles.statsBannerLabel}>Total Scans</Text>
        </View>
        <View style={[styles.statsBannerItem,{flex:2}]}>
          <MaterialIcons name="event-available" size={22} color={Colors.appColors.primary} />
          <Text style={styles.statsBannerValue}>{lastScan}</Text>
          <Text style={styles.statsBannerLabel}>Last Scan</Text>
        </View>
        <View style={[styles.statsBannerItem,{flex:2}]}>
          <MaterialIcons name="warning" size={22} color={Colors.appColors.primary} />
          <Text style={styles.statsBannerValue}>{mostCommonFaultName}</Text>
          <Text style={styles.statsBannerLabel}>Most Common Fault</Text>
        </View>
      </View>
      <FlatList
        data={diagnostics}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item._id}
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
  statsBanner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.appColors.white,
    borderRadius: 16,
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 18,
    paddingVertical: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  statsBannerItem: {
    alignItems: 'center',
    flex: 1,
  },
  statsBannerValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.appColors.primary,
    marginTop: 2,
    textAlign:'center'
  },
  statsBannerLabel: {
    fontSize: 12,
    color: Colors.appColors.gray,
    marginTop: 2,
    textAlign: 'center',
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
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  historyItemIconCol: {
    width: 40,
    alignItems: 'center',
    justifyContent:'flex-start',
    marginRight: 10,
  },
  historyItemDateText: {
    fontSize: 13,
    color: Colors.appColors.darkGray,
    fontWeight: 'bold',
  },
  historyItemDetails: {
    flex: 1,
  },
  historyItemFault: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.appColors.primary,
    marginBottom: 4,
  },
  historyItemSummary: {
    fontSize: 13,
    color: Colors.appColors.gray,
    marginBottom: 8,
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