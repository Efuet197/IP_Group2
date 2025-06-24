import { Colors } from '@/constants/Colors';
import { diagnoseImage } from '@/utils/diagnoseApi';
import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function ScanDashboard({navigateTo}:{navigateTo:(screenName: string, params?: {}) => void}) {
    const [scanText, setScanText] = useState('');
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);
    const cameraRef = useRef<any>(null);
    const [image, setImage] = useState<any>(null);
    const [diagnoseLoading, setDiagnoseLoading] = useState(false);
    const [diagnoseResult, setDiagnoseResult] = useState<string | null>(null);

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
    const handleDiagnose = async () => {
      if (!image) {
        alert('Please select or take an image first.');
        return;
      }
      setDiagnoseLoading(true);
      setDiagnoseResult(null);
      try {
        const result = await diagnoseImage(image);
        setDiagnoseResult(result?.diagnosis || JSON.stringify(result));
        // Navigate to diagnosticResult screen and pass the result
        navigateTo('DiagnosisResult', { result: result?.diagnosis || JSON.stringify(result) });
      } catch (err) {
        setDiagnoseResult('Failed to diagnose image.');
        navigateTo('DiagnosisResult', { result: 'Failed to diagnose image.' });
      } finally {
        setDiagnoseLoading(false);
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
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigateTo('CarOwnerDashboard')}>
              <Ionicons name="chevron-back" size={30} color={Colors.appColors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Dashboard Light</Text>
        </View>

        <View style={styles.scanContent}>
          {/* Image Preview Card */}
          <View style={styles.imagePreviewCard}>
            {image ? (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={48} color={Colors.appColors.gray} />
                <Text style={styles.imagePlaceholderText}>No image selected</Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
              <Ionicons name="camera" size={22} color={Colors.appColors.primary} />
              <Text style={styles.actionButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
              <Ionicons name="image" size={22} color={Colors.appColors.primary} />
              <Text style={styles.actionButtonText}>Gallery</Text>
            </TouchableOpacity>
          </View>

          {/* Diagnose Button */}
          <TouchableOpacity style={styles.diagnoseButton} onPress={handleDiagnose} disabled={diagnoseLoading}>
            {diagnoseLoading ? (
              <ActivityIndicator size="small" color={Colors.appColors.primary} />
            ) : (
              <Text style={styles.diagnoseButtonText}>Diagnose</Text>
            )}
          </TouchableOpacity>
        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  scanLightContainer: {
    flex: 1,
    backgroundColor: Colors.appColors.primary,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 10,
    paddingHorizontal: 18,
    backgroundColor: Colors.appColors.primary,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  backButton: {
    padding: 4,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.appColors.primary,
  },
  scanContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom:100,
  },
  imagePreviewCard: {
    width: '100%',
    height: 370,
    backgroundColor: Colors.appColors.white,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    color: Colors.appColors.gray,
    fontSize: 15,
    marginTop: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
    gap: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.appColors.white,
    borderRadius: 10,
    paddingVertical: 14,
    marginHorizontal: 6,
    elevation: 2,
  },
  actionButtonText: {
    color: Colors.appColors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  diagnoseButton: {
    backgroundColor: Colors.appColors.accent,
    width: '96%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  diagnoseButtonText: {
    color: Colors.appColors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});