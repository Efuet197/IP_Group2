import Header from '@/components/Header';
import { ThemedView } from '@/components/ThemedView';
import IconButton from '@/components/ui/IconButton';
import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CarOwnerHome({navigateTo}:{navigateTo:(screenName: string, params?: {}) => void}) {
    return (
        <SafeAreaView style={styles.container}>
          <Header title="CarCare" />
          <ThemedView style={styles.dashboardGrid}>
              <IconButton
                  iconName="camera"
                  title="Scan Light"
                  // onPress={() => navigateTo('ScanLight')}
                  color={Colors.appColors.primary}
                  textColor={Colors.appColors.textSecondary}
                  style={styles.dashboardButton}
                  navigateTo={()=>navigateTo('ScanLight')}
              />
              <IconButton
                  iconName="microphone"
                  title="Record Sound"
                  // onPress={() => navigateTo('RecordSound')}
                  color={Colors.appColors.primary}
                  textColor={Colors.appColors.textSecondary}
                  style={styles.dashboardButton}
                  navigateTo={()=>navigateTo('RecordSound')}
              />
            
              <IconButton
                  iconName="history"
                  title="View History"
                  // onPress={() => navigateTo('History')}
                  color={Colors.appColors.primary}
                  textColor={Colors.appColors.textSecondary}
                  style={styles.dashboardButton}
                  navigateTo={()=>navigateTo('History')}
              />
              {/* <IconButton
                  iconName="wrench"
                  title="Find Mechanic"
                  onPress={() => navigateTo('FindMechanic')}
                  color={Colors.appColors.primary}
                  textColor={Colors.appColors.textSecondary}
                  style={styles.dashboardButton}
              /> */}
          </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appColors.lightGray,
  },
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex:1,
    alignContent:'center',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor:Colors.light.background
  },
  dashboardButton: {
    marginBottom: 20,
  }
});
