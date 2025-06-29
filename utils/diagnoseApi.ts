import axios from "axios";
import { API_BASE_URL } from "./authApi";

// export async function sendFileToServer(files:any) {
//     return uploadFiles({
//         toUrl: `http://xxx/YOUR_URL`,
//         files: files,
//         method: "POST",
//         headers: { Accept: "application/json" },
//         begin: () => {
//             // console.log('File Uploading Started...')
//         },
//         progress: ({ totalBytesSent, totalBytesExpectedToSend }) => {
//             // console.log({ totalBytesSent, totalBytesExpectedToSend })
//         },
//     })
//     .promise.then(({ body }) => {
//         // Response Here...
//         // const data = JSON.parse(body); => You can access to body here....
//     })
//     .catch(_ => {
//         // console.log('Error')
//     })
// }

export async function diagnoseImage(imageUri: string, userId: string) {
  try {
    const formData = new FormData();
    formData.append('dashboardImage', {
      uri: imageUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);
    formData.append('userId', userId);
    console.log(formData)
    console.log('--- Inspecting FormData Contents ---');
    // Manually log FormData fields since .entries() is not available in React Native
    // @ts-ignore
    if (formData._parts) {
      // @ts-ignore
      formData._parts.forEach((part: any) => {
        console.log(`${part[0]}:`, part[1]);
      });
    }
    console.log('------------------------------------');
    // Do NOT set Content-Type header manually; let Axios handle it
    const response = await axios.post(`${API_BASE_URL}/diagnose/image`, formData);
    return response.data;
  } catch (error: any) {
    return { err: error.message };
  }
}
