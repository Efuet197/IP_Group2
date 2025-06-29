// utils/notifications.ts
// import * as Notifications from 'expo-notifications';
// import * as Device from 'expo-device';
// import { Platform } from 'react-native';

// export async function registerForPushNotificationsAsync() {
//   let token;
//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   return token;
// }

// Usage in your app (e.g., after login/register):

// import { registerForPushNotificationsAsync } from '@/utils/notifications';
// import { useEffect } from 'react';

// useEffect(() => {
//   async function getTokenAndSendToBackend() {
//     const token = await registerForPushNotificationsAsync();
//     if (token) {
//       // Send token to your backend, e.g.:
//       await fetch('https://your-backend.com/api/save-push-token', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId: user.id, expoPushToken: token }),
//       });
//     }
//   }
//   getTokenAndSendToBackend();
// }, [user]);

// Send a push notification using Expo’s API:

// utils/sendExpoPush.js
// const fetch = require('node-fetch');

// async function sendExpoPushNotification(expoPushToken, message) {
//   const payload = {
//     to: expoPushToken,
//     sound: 'default',
//     title: message.title,
//     body: message.body,
//     data: message.data || {},
//   };

//   const response = await fetch('https://exp.host/--/api/v2/push/send', {
//     method: 'POST',
//     headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload),
//   });

//   return response.json();
// }

// module.exports = { sendExpoPushNotification };

// Usage in your Express route:
// const { sendExpoPushNotification } = require('./utils/sendExpoPush');

// // Example Express route
// app.post('/api/notify-user', async (req, res) => {
//   const { expoPushToken, title, body, data } = req.body;
//   try {
//     const result = await sendExpoPushNotification(expoPushToken, { title, body, data });
//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to send notification' });
//   }
// });