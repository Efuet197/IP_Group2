import { API_BASE_URL } from './authApi';

export async function diagnoseImage(imageUri: string) {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    name: 'photo.jpg',
    type: 'image/jpeg',
  } as any);

  const response = await fetch(`${API_BASE_URL}/diagnose/image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });

  if (!response.ok) throw new Error('Failed to diagnose image');
  return response.json();
}
