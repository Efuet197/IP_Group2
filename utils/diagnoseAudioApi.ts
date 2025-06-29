import axios from 'axios';
import { API_BASE_URL } from './authApi';

export async function diagnoseAudio(audioUri: string) {
  try {
    const formData = new FormData();
    formData.append('audio', {
      uri: audioUri,
      name: 'recording.m4a',
      type: 'audio/m4a',
    } as any);
  
    const response = await axios.post(`${API_BASE_URL}/diagnose/audio`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if(response.data)  return response.data;
  } catch (error:any) {
    return {err:error.message}
  }
}
