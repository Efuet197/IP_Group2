import { Colors } from '@/constants/Colors';
import { diagnoseAudio } from '@/utils/diagnoseAudioApi';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function RecordSound({navigateTo}:{navigateTo:(screenName: string, params?: {}) => void}) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recording, setRecording] = useState<any>(null);
  const [recordingStatus, setRecordingStatus] = useState('idle'); // 'idle', 'recording', 'stopped'
  const [audioUri, setAudioUri] = useState<any>(null);
  const [sound, setSound] = useState<any>(null);
  const [playbackStatus, setPlaybackStatus] = useState('idle');
  const [diagnoseLoading, setDiagnoseLoading] = useState(false);
  const [diagnoseResult, setDiagnoseResult] = useState<string | null>(null);

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement stop recording logic
    isRecording?console.log('Stopped recording'):console.log('Started recording');
  };

  async function startRecording() {
    try {
      // 1. Request microphone permissions
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        alert('Permission to access microphone is required!');
        return;
      }

      // 2. Configure audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false, // Set to true if you need background recording
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // 3. Create a new Audio.Recording instance and prepare it
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setRecordingStatus('recording');
      console.log('Recording started');

    } catch (err) {
      console.error('Failed to start recording', err);
      setRecordingStatus('idle');
    }
  }

  async function stopRecording() {
    setRecordingStatus('stopped');
    console.log('Stopping recording');

    if (!recording) return; // Ensure recording object exists

    try {
      // 1. Stop and unload the recording
      await recording.stopAndUnloadAsync();

      // 2. Get the URI of the recorded file
      const uri = recording.getURI();
      setAudioUri(uri);
      console.log('Recording stopped and stored at', uri);

      // 3. Reset recording state
      setRecording(null);

      // 4. Set audio mode back to non-recording (optional, but good practice)
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: true, // Allow sound to play through earpiece
      });

    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  }

  async function playSound() {
    if (!audioUri) {
      alert('No audio recorded yet!');
      return;
    }
    if (sound) {
      // If sound is already loaded, just play it
      await sound.replayAsync();
      setPlaybackStatus('playing');
      return;
    }

    try {
      // 1. Load the recorded sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded && !status.isPlaying && status.positionMillis > 0) {
            setPlaybackStatus('idle'); // Reset status when playback finishes
            newSound.unloadAsync(); // Unload sound when finished (optional)
            setSound(null); // Clear sound object
          }
        }
      );
      setSound(newSound);
      setPlaybackStatus('playing');
      console.log('Playing sound');

    } catch (error) {
      console.error('Failed to play sound', error);
      setPlaybackStatus('idle');
    }
  }

  async function pauseSound() {
    if (sound && playbackStatus === 'playing') {
      await sound.pauseAsync();
      setPlaybackStatus('paused');
      console.log('Sound paused');
    }
  }

  async function resumeSound() {
    if (sound && playbackStatus === 'paused') {
      await sound.playAsync();
      setPlaybackStatus('playing');
      console.log('Sound resumed');
    }
  }

  async function handleDiagnoseAudio() {
    if (!audioUri) {
      alert('No audio recorded yet!');
      return;
    }
    setDiagnoseLoading(true);
    setDiagnoseResult(null);
    try {
      const result = await diagnoseAudio(audioUri);
      setDiagnoseResult(result?.diagnosis || JSON.stringify(result));
      // Navigate to diagnosticResult screen and pass the result
      navigateTo('DiagnosisResult', { result: result?.diagnosis || JSON.stringify(result) });
    } catch (err) {
      setDiagnoseResult('Failed to diagnose audio.');
      navigateTo('DiagnosisResult', { result: 'Failed to diagnose audio.' });
    } finally {
      setDiagnoseLoading(false);
    }
  }

  React.useEffect(() => {
    // Unload the sound when the component unmounts
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  return (
    <SafeAreaView style={styles.recordSoundContainer}>
      <StatusBar style="light" />
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigateTo('CarOwnerDashboard')}>
          <Ionicons name="chevron-back" size={30} color={Colors.appColors.white} />
        </TouchableOpacity>
        {/* <Text style={styles.headerTitle}>Record Engine Sound</Text> */}
      </View>
      {/* <ScrollView contentContainerStyle={{paddingBottom:120}}> */}
        <View style={styles.recordSoundContent}>
          {/* Mic Card */}
          <View style={[styles.micCard, recordingStatus === 'recording' && styles.micCardActive]}> 
            {recordingStatus === 'recording' ?
              <MaterialCommunityIcons name="waveform" size={100} color={Colors.appColors.accent} style={styles.micIcon} />
              :
              <MaterialIcons name="mic" size={100} color={Colors.appColors.primary} style={styles.micIcon} />
            }
          </View>
          <Text style={styles.recordingText}>{recordingStatus === 'recording' ? "Recording..." : "Tap to Record"}</Text>

          {/* Record Button */}
          <TouchableOpacity style={styles.recordButton} onPress={recordingStatus === 'recording' ? stopRecording : startRecording}>
            <Text style={styles.recordButtonText}>{recordingStatus === 'recording' ? "Stop Recording" : "Start Recording"}</Text>
          </TouchableOpacity>

          {/* Playback & Diagnose Controls */}
          {audioUri && (
            <View style={styles.playbackControls}>
              <Text style={styles.playbackText}>Playback:</Text>
              {playbackStatus === 'playing' ? (
                <TouchableOpacity style={styles.playSound} onPress={pauseSound}>
                  <Ionicons name="pause" size={22} color={Colors.appColors.primary} />
                  <Text style={styles.playSoundText}>Pause</Text>
                </TouchableOpacity>
              ) : playbackStatus === 'paused' ? (
                <TouchableOpacity style={styles.playSound} onPress={resumeSound}>
                  <Ionicons name="play" size={22} color={Colors.appColors.primary} />
                  <Text style={styles.playSoundText}>Resume</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.playSound} onPress={playSound}>
                  <Ionicons name="play" size={22} color={Colors.appColors.primary} />
                  <Text style={styles.playSoundText}>Play</Text>
                </TouchableOpacity>
              )}
              {/* Diagnose Button */}
              <TouchableOpacity style={styles.diagnoseButton} onPress={handleDiagnoseAudio} disabled={diagnoseLoading}>
                {diagnoseLoading ? (
                  <ActivityIndicator size="small" color={Colors.appColors.primary} />
                ) : (
                  <Text style={styles.diagnoseButtonText}>Diagnose Engine</Text>
                )}
              </TouchableOpacity>
              {diagnoseResult && (
                <View style={styles.resultCard}>
                  <Text style={{color: Colors.appColors.primary, fontWeight: 'bold'}}>Result:</Text>
                  <Text style={{color: Colors.appColors.primary}}>{diagnoseResult}</Text>
                </View>
              )}
              <Text style={styles.statusText}>Playback Status: {playbackStatus}</Text>
            </View>
          )}
        </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  recordSoundContainer: {
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
  recordSoundContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom:60
  },
  micCard: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.appColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    // elevation: 10,
    // shadowColor: '#fff',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.12,
    // shadowRadius: 8,
  },
  micCardActive: {
    borderWidth: 4,
    borderColor: Colors.appColors.accent,
    shadowColor: Colors.appColors.accent,
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  micIcon: {
    alignSelf: 'center',
  },
  recordingText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.appColors.white,
    marginBottom: 18,
  },
  recordButton: {
    backgroundColor: Colors.appColors.white,
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
  },
  recordButtonText: {
    color: Colors.appColors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  playbackControls: {
    marginTop: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 20,
    width: '100%',
  },
  playbackText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    color: Colors.appColors.white,
  },
  playSound: {
    backgroundColor: Colors.appColors.white,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    paddingVertical: 12,
    elevation: 2,
  },
  playSoundText: {
    color: Colors.appColors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  diagnoseButton: {
    backgroundColor: Colors.appColors.accent,
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  diagnoseButtonText: {
    color: Colors.appColors.primary,
    fontSize: 17,
    fontWeight: 'bold',
  },
  resultCard: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    width: '100%',
  },
  statusText: {
    marginVertical: 10,
    fontSize: 14,
    color: '#333',
  },
});