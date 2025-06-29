import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import qs from "qs";
import fs from "fs";
import stream  from "stream";
import path   from "path";
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

let genAI=new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function generateSpectrogram(audioBuffer:any) {
    return new Promise((resolve, reject) => {
        const audioStream = stream.Readable.from(audioBuffer);
        const chunks:any = [];

        ffmpeg(audioStream)
            .complexFilter([
                'showspectrumpic=s=1024x512:legend=0:orientation=v'
            ])
            .toFormat('png') // Set the output format to PNG
            .on('end', () => {
                console.log('Spectrogram generation finished.');
                const spectrogramBuffer = Buffer.concat(chunks);
                resolve(spectrogramBuffer);
            })
            .on('error', (err) => {
                console.error('Error during spectrogram generation:', err.message);
                reject(new Error('FFmpeg failed to generate spectrogram.'));
            })
            // Pipe the output stream to collect the data chunks
            .pipe()
            .on('data', (chunk) => {
                chunks.push(chunk);
            });
    });
}
// highlight-end

// Helper to convert an image buffer to the format Gemini API needs
// highlight-start
function bufferToGenerativePart(buffer:any, mimeType:any) {
    return {
        inlineData: {
            data: buffer.toString("base64"),
            mimeType
        },
    };
}

/**
 * @desc    Analyzes an engine sound file to diagnose potential issues.
 * @route   POST /api/v1/diagnose/engine-sound
 * @access  Public
 */
const analyzeEngineSound = async (req:Request, res:Response):Promise<any> => {
  try {
    // 1. Check if an audio file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No audio file uploaded. Please upload a file with the key 'engineSound'.",
      });
    }

    // This feature requires a model that supports audio, like gemini-1.5-pro
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    
    // 2. The Prompt: Instruct the AI to act as an expert audio diagnostician
    const diagnosisPrompt = `
      You are a master automotive diagnostician and an expert in audio analysis.
      Analyze the following spectrogram of a car engine sound. The spectrogram's vertical axis represents frequency and the horizontal axis represents time:
      **Your Task:**
            1.  **Analyze the Spectrogram:** Identify key characteristics in the sound pattern (e.g., rhythmic ticking, high-frequency whining, low-frequency rumble, irregular clatter).
            2.  **Provide Top 3 Diagnoses:** List the three most likely problems. For each diagnosis, explain why the sound pattern points to that issue.
            3.  **Suggest Next Steps:** For each diagnosis, recommend what the user should check or what a professional mechanic should inspect.
            4.  **Severity Level:** Assign a severity level (e.g., "Low: Monitor", "Medium: Schedule Inspection Soon", "High: Stop Driving Immediately").
            5.  **Format your response as a valid JSON object and nothing else.**
      
      If the audio does not sound like a vehicle engine or is unintelligible, return a JSON object with an error message:
      { "error": "The audio file does not contain a clear engine sound." }
    `;

    const audioBuffer = req.file.buffer;
    const spectrogramBuffer = await generateSpectrogram(audioBuffer)
    const imagePart = bufferToGenerativePart(spectrogramBuffer, "image/png");

    // 3. Upload the file to Google's servers to get a file reference.
    // We use the buffer and mimetype directly from multer.
    const audioFile = {
        inlineData: {
            mimeType: req.file.mimetype,
            data: req.file.buffer.toString("base64"),
        }
    };

    // 4. Generate content using the prompt and the uploaded audio file
    // const result = await model.generateContent([diagnosisPrompt, audioFile]);
    const result = await model.generateContent([diagnosisPrompt, imagePart]);
    const responseText = result.response.text();

    // 5. Clean and parse the JSON response from the AI
    const cleanedJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let diagnosis;
    try {
        diagnosis = JSON.parse(cleanedJsonString);
    } catch (parseError) {
        console.error("Failed to parse JSON from Gemini:", parseError);
        return res.status(500).json({ 
            success: false, 
            error: "AI failed to return valid JSON. Raw response included for debugging.",
            rawResponse: responseText 
        });
    }

    // 6. Search YouTube for a relevant tutorial video based on the diagnosis
    let youtubeUrl = null;
    try {
        let searchQuery = diagnosis?.diagnosisSummary || (diagnosis?.potentialIssues?.[0]?.issue) || "car engine repair tutorial";
        const params = qs.stringify({
            part: 'snippet',
            q: searchQuery + ' car repair tutorial',
            key: process.env.YOUTUBE_API_KEY,
            maxResults: 1,
            type: 'video',
        });
        const ytRes = await axios.get(`https://www.googleapis.com/youtube/v3/search?${params}`);
        const videoId = ytRes.data.items?.[0]?.id?.videoId;
        if (videoId) {
            youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        }
    } catch (ytErr) {
        youtubeUrl = null;
    }

    // 7. Return the diagnosis and the YouTube tutorial video URL
    return res.json({
        success: true,
        diagnosis,
        tutorialVideo: youtubeUrl
    });

  } catch (error) {
    console.error("Error in engine sound analysis controller:", error);
    res.status(500).json({
      success: false,
      error: "An internal server error occurred while analyzing the audio.",
    });
  }
};

export default analyzeEngineSound