import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const API_BASE_URL = 'http://localhost:8000/api'; // Replace with your Express backend URL

export async function loginUser(email: string, password: string) {
    // const response = await fetch(`${API_BASE_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // });
    const response = await axios.post(`${API_BASE_URL}/auth/login`,{email, password})
    console.log(response)
    if (!response.data) throw new Error('Login failed');
    const data = await response.data;
    // data should contain { token, user }
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
}

export async function registerUser(user: {
  fullName: string;
  email?: string;
  password: string;
  phoneNumber?: string;
  location?: string;
  role: string;
  workshopLocation?: string;
}) {
  // const response = await fetch(`${API_BASE_URL}/auth/signup`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(user)
  // });
  const response = await axios.post(`${API_BASE_URL}/auth/signup`,user)
  console.log(response)
  if (!response.data) throw new Error('Registration failed');
  const data = await response.data;
  // data should contain { token, user }
  await AsyncStorage.setItem('token', data.token);
  await AsyncStorage.setItem('user', JSON.stringify(data.user));
  return data.user;
}
