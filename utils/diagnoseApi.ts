import axios from 'axios';
import { API_BASE_URL } from './authApi';

export async function diagnoseImage(imageUri: string) {
  try {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);
  
    console.log(formData)
    const response = await axios.post(`${API_BASE_URL}/diagnose/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    });
    if(response.data) return response.data;
  } catch (error:any) {
    return {err:error.message}
  }
}
