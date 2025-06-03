import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function ScanDashboard({navigateTo}:{navigateTo:(screenName: string, params?: {}) => void}) {
    const [scanText, setScanText] = useState('');
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);
    const cameraRef = useRef<any>(null);
    const [image, setImage] = useState<any>(null);

    const takePhoto = async () => {
      // Request camera permissions
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      // Launch camera
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Or .All, .Videos
        allowsEditing: true, // Allow cropping/editing
        aspect: [4, 3], // Aspect ratio for editing
        quality: 1, // 0 to 1, higher is better quality
      });

      console.log(result);

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    };

    const pickImage = async () => {
    // Request media library permissions
      const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaLibraryStatus !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      // Launch image picker
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Or .All, .Videos
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log(result);

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    };
    const handleToggleScanning = () => {
        takePhoto()
        setIsScanning(!isScanning);
        // Implement stop recording logic
        isScanning?console.log('Stopped scanning'):console.log('Started scanning');
    };
    const takePicture = async () => {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
        console.log(photo);
      }
    };
    useEffect(() => {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(status === 'granted');
      })();
    }, []);
    return (
        <SafeAreaView style={styles.scanLightContainer}>
        <StatusBar style="light" />
        <TouchableOpacity style={styles.backButton} onPress={() => navigateTo('CarOwnerDashboard')}>
            <Ionicons name="chevron-back" size={30} color={Colors.appColors.white} />
        </TouchableOpacity>

        <View style={styles.scanLightContent}>
            {/* <View style={styles.scanFrame} /> */}
            {image? <Image source={{ uri: image }} style={styles.scanFrame} /> :<View style={styles.scanFrame} />}
            <TouchableOpacity style={styles.scanCircleButton} onPress={handleToggleScanning} />
            {hasCameraPermission?
              <TouchableOpacity style={styles.stopButton2} onPress={pickImage} >
                  <Text style={styles.stopButtonText2}>Select image from gallery</Text>
              </TouchableOpacity>
              :
              <Text>No access to camera</Text>
            }
            <TouchableOpacity style={styles.stopButton} >
                <Text style={styles.stopButtonText}>Check Diagnose</Text>
            </TouchableOpacity>
        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  scanLightContainer: {
    flex: 1,
    backgroundColor: Colors.appColors.primary,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Platform.OS === 'android' ? 50 : 0,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 20,
  },
  scanLightContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 50,
  },
  scanFrame: {
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').width * .8 * .9, // Adjust aspect ratio as needed
    borderWidth: 4,
    borderColor: Colors.appColors.white,
    borderRadius: 10,
    marginBottom: 30,
    backgroundColor:'#212223c2'
  },
  scanCircleButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: Colors.appColors.white,
    marginBottom: 30,
  },
  stopButton: {
    backgroundColor: Colors.appColors.white,
    width: Dimensions.get('window').width * 0.8,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  stopButton2: {
    marginBottom: 20,
    backgroundColor: Colors.appColors.accent,
    width: Dimensions.get('window').width * 0.8,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  stopButtonText: {
    color: Colors.appColors.primary,
    fontSize: 18,
    fontWeight: 'semibold',
  },
  stopButtonText2: {
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: 'semibold',
  },
});