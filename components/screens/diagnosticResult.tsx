import { Colors } from '@/constants/Colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function DiagnosisResult({navigateTo}:{navigateTo:(screenName: string, params?: {}) => void}) {
  // In a real app, you would get diagnosis data from navigation params or state
  const diagnosis = {
    fault: 'Low Engine Oil Pressure',
    severity: 'High',
    suggestions: 'Check oil level, top up if necessary. If problem persists, consult a mechanic.',
  };

  return (
    <SafeAreaView style={styles.diagnosisContainer}>
      <StatusBar style="dark" />
      <View style={styles.diagnosisHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigateTo('History')}>
          <Ionicons name="chevron-back" size={30} color={Colors.appColors.white} />
        </TouchableOpacity>
        <Text style={styles.diagnosisTitle}>Diagnosis Results</Text>
      </View>

      <ScrollView contentContainerStyle={styles.diagnosisContent}>
        <View style={styles.diagnosisCard}>
          <Text style={styles.diagnosisLabel}>Fault Identified:</Text>
          <Text style={styles.diagnosisValue}>{diagnosis.fault}</Text>
        </View>

        <View style={styles.diagnosisCard}>
          <Text style={styles.diagnosisLabel}>Severity:</Text>
          <Text style={[styles.diagnosisValue, { color: diagnosis.severity === 'High' ? Colors.appColors.red : Colors.appColors.darkGray }]}>
            {diagnosis.severity}
          </Text>
        </View>

        <View style={styles.diagnosisCard}>
          <Text style={styles.diagnosisLabel}>Suggestions:</Text>
          <Text style={styles.diagnosisValue}>{diagnosis.suggestions}</Text>
        </View>

        <View style={styles.videoPlaceholder}>
          <MaterialIcons name="play-circle-outline" size={80} color={Colors.appColors.darkGray} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  diagnosisContainer: {
    flex: 1,
    backgroundColor: Colors.appColors.secondary,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 20,
    paddingRight:1,
  },
  diagnosisHeader: {
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
  diagnosisTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.appColors.white,
    marginLeft: 10,
  },
  diagnosisContent: {
    padding: 20,
    marginTop:30,
    paddingBottom:150,
  },
  diagnosisCard: {
    backgroundColor: Colors.appColors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  diagnosisLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.appColors.darkGray,
    marginBottom: 5,
  },
  diagnosisValue: {
    fontSize: 18,
    color: Colors.appColors.primary,
  },
  videoPlaceholder: {
    backgroundColor: Colors.appColors.gray,
    height: 200,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});