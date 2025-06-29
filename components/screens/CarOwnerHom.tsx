import IconButton from '@/components/ui/IconButton';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient'; // You might need to install this
import { useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/MaterialIcons'; // Adjust based on your icon library
// import { Ionicons } from 'react-native-vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header2 from '../Header2';

export default function CarOwnerHome({navigateTo}:{navigateTo:(screenName: string, params?: {}) => void}) {
    const router=useRouter()
    // Example: Replace with actual recent scans count from props or context
    const metrics = {
      totalScans: 0,
      lastScan: '-',
      diagnosticsFound: 0,
    };
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.appColors.primary} />
            {/* Modern Header */}
            {/* <LinearGradient
                colors={['white','white']}
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
                        <View style={styles.profileIcon}>
                            <Ionicons name="notifications" color={Colors.appColors.primary} size={28} />
                        </View>
                    </View>
                </View>
            </LinearGradient> */}
            <Header2 />
            <ScrollView contentContainerStyle={{paddingBottom:60}}>

                {/* Banner with background image and gradient overlay */}
                <View style={styles.heroBannerContainer}>
                <ImageBackground
                    source={require('@/assets/images/dashboard.jpg')}
                    style={styles.heroBannerImage}
                    imageStyle={{ borderRadius: 18 }}
                >
                    <LinearGradient
                    colors={["rgba(26,103,113,0.85)", "rgba(26,103,113,0.0)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.heroBannerGradient}
                    >
                    <View style={styles.heroBannerContent}>
                        <Text style={styles.heroBannerTitle}>Welcome back!</Text>
                        <Text style={styles.heroBannerSubtitle}>Ready for your next car diagnosis?</Text>
                    </View>
                    </LinearGradient>
                </ImageBackground>
                </View>

                {/* Metrics Card */}
                <View style={styles.metricsCard}>
                <View style={styles.metricItem}>
                    <Ionicons name="analytics" size={24} color={Colors.appColors.primary} />
                    <Text style={styles.metricValue}>{metrics.totalScans}</Text>
                    <Text style={styles.metricLabel}>Total Scans</Text>
                </View>
                <View style={styles.metricItem}>
                    <Ionicons name="calendar" size={24} color={Colors.appColors.primary} />
                    <Text style={styles.metricValue}>{metrics.lastScan}</Text>
                    <Text style={styles.metricLabel}>Last Scan</Text>
                </View>
                <View style={styles.metricItem}>
                    <Ionicons name="warning" size={24} color={Colors.appColors.primary} />
                    <Text style={styles.metricValue}>{metrics.diagnosticsFound}</Text>
                    <Text style={styles.metricLabel}>Diagnostics</Text>
                </View>
                </View>

                {/* Main Content */}
                <View style={styles.mainContent}>
                    <Text style={styles.sectionTitle}>Quick actions</Text>
                    <View style={styles.dashboardGrid}>
                        <IconButton
                            iconSize={24}
                            iconName="camera"
                            title="Scan Light"
                            color={Colors.appColors.primary}
                            textColor={Colors.appColors.textSecondary}
                            style={styles.dashboardButton}
                            navigateTo={()=>navigateTo('ScanLight')}
                        />
                        <IconButton
                            iconSize={24}
                            iconName="microphone"
                            title="Record Sound"
                            color={Colors.appColors.primary}
                            textColor={Colors.appColors.textSecondary}
                            style={styles.dashboardButton}
                            navigateTo={()=>navigateTo('RecordSound')}
                        />
                        <IconButton
                            iconSize={24}
                            iconName="history"
                            title="View History"
                            color={Colors.appColors.primary}
                            textColor={Colors.appColors.textSecondary}
                            style={styles.dashboardButton}
                            navigateTo={()=>navigateTo('History')}
                        />
                        <IconButton
                        iconSize={24}
                        iconName="search-plus"
                        title="Find Mechanic"
                        color={Colors.appColors.primary}
                        textColor={Colors.appColors.textSecondary}
                        style={styles.dashboardButton}
                        navigateTo={()=>router.push('/(tabs)/mechanic')}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
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
        paddingHorizontal: 28,
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
    },
    heroBannerContainer: {
        width: '90%',
        alignSelf: 'center',
        marginVertical: 18,
        borderRadius: 18,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    heroBannerImage: {
        width: '100%',
        height: 120,
        justifyContent: 'flex-end',
    },
    heroBannerGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderRadius: 18,
        padding: 20,
    },
    heroBannerContent: {
        alignItems: 'flex-start',
    },
    heroBannerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    heroBannerSubtitle: {
        fontSize: 15,
        color: '#fff',
        opacity: 0.9,
    },
    metricsCard: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: Colors.appColors.white,
        borderRadius: 18,
        marginHorizontal: 18,
        marginBottom: 8,
        paddingVertical: 14,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
    },
    metricItem: {
        alignItems: 'center',
        flex: 1,
    },
    metricValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.appColors.primary,
        marginTop: 2,
    },
    metricLabel: {
        fontSize: 12,
        color: Colors.appColors.gray,
        marginTop: 2,
    },
    mainContent: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.appColors.primary,
        marginTop: 20,
        marginBottom: 15,
        paddingHorizontal: 24,
    },
    dashboardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        gap: 16,
    },
    dashboardButton: {
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
});