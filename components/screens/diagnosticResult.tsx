import { Colors } from '@/constants/Colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function DiagnosisResult({navigateTo, result}: {navigateTo: (screenName: string, params?: {}) => void, result?: any}) {
  // Accept result as prop
  let diagnosis = result;
  // Fallback for demo/testing
  if (!diagnosis || typeof diagnosis === 'string') {
    diagnosis = {
      fault: typeof result === 'string' ? result : 'No diagnosis result provided.',
      severity: '',
      recommendation: '',
      tutorialVideo: ''
    };
  }

  // Color for severity
  let severityColor = Colors.appColors.darkGray;
  if (diagnosis.severity === 'High') severityColor = Colors.appColors.red;
  else if (diagnosis.severity === 'Medium') severityColor = Colors.appColors.orange;
  else if (diagnosis.severity === 'Low') severityColor = Colors.appColors.green;

  return (
    <SafeAreaView style={styles.diagnosisContainer}>
      <StatusBar style="light" />
      <View style={styles.diagnosisHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigateTo('History')}>
          <Ionicons name="chevron-back" size={30} color={Colors.appColors.white} />
        </TouchableOpacity>
        <Text style={styles.diagnosisTitle}>Diagnosis Results</Text>
      </View>

      <ScrollView contentContainerStyle={styles.diagnosisContent}>
        <View style={styles.diagnosisCard}>
          <View style={styles.cardRow}>
            <MaterialIcons name="report-problem" size={28} color={Colors.appColors.primary} style={styles.cardIcon} />
            <View style={{flex:1}}>
              <Text style={styles.diagnosisLabel}>Fault Identified:</Text>
              <Text style={styles.diagnosisValue}>{diagnosis.fault}</Text>
            </View>
          </View>
        </View>

        <View style={styles.diagnosisCard}>
          <View style={styles.cardRow}>
            <MaterialIcons name="priority-high" size={28} color={severityColor} style={styles.cardIcon} />
            <View style={{flex:1}}>
              <Text style={styles.diagnosisLabel}>Severity:</Text>
              <Text style={[styles.diagnosisValue, { color: severityColor }]}>{diagnosis.severity}</Text>
            </View>
          </View>
        </View>

        <View style={styles.diagnosisCard}>
          <View style={styles.cardRow}>
            <MaterialIcons name="lightbulb-outline" size={28} color={Colors.appColors.accent} style={styles.cardIcon} />
            <View style={{flex:1}}>
              <Text style={styles.diagnosisLabel}>Suggestions:</Text>
              <Text style={styles.diagnosisValue}>{diagnosis.recommendation}</Text>
            </View>
          </View>
        </View>

        {/* Video/Tutorial Section */}
        <View style={styles.videoSection}>
          {diagnosis.tutorialVideo ? (
            <TouchableOpacity style={styles.videoPlayBtn} onPress={() => Linking.openURL(diagnosis.tutorialVideo)}>
              <MaterialIcons name="play-circle-outline" size={80} color={Colors.appColors.primary} />
              <Text style={styles.videoText}>Watch Tutorial</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.videoPlaceholder}>
              <MaterialIcons name="play-circle-outline" size={80} color={Colors.appColors.gray} />
              <Text style={styles.videoText}>No tutorial available</Text>
            </View>
          )}
        </View>

        {/* Quick Action Button */}
        <TouchableOpacity style={styles.quickActionBtn} onPress={() => navigateTo('CarOwnerDashboard')}>
          <Ionicons name="home" size={22} color={Colors.appColors.white} />
          <Text style={styles.quickActionText}>Back to Home</Text>
        </TouchableOpacity>
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
    borderRadius: 12,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardIcon: {
    marginRight: 16,
    marginTop: 2,
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
  videoSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  videoPlayBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlaceholder: {
    backgroundColor: Colors.appColors.gray,
    height: 200,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  videoText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.appColors.primary,
    fontWeight: 'bold',
  },
  quickActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.appColors.primary,
    borderRadius: 10,
    paddingVertical: 16,
    marginTop: 30,
    width: '100%',
    elevation: 2,
  },
  quickActionText: {
    color: Colors.appColors.white,
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});