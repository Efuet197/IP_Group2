import qs from "qs";
import fs from "fs";
import stream  from "stream";
import path   from "path";
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import axios from "axios";

// --- Gemini API Setup ---
// Load environment variables from .env file
import { GoogleGenerativeAI } from "@google/generative-ai";

// Make sure you have GEMINI_API_KEY in your .env file
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GOOGLE_API_KEY is not set in environment variables.');
}

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// We use the 'gemini-pro-vision' model because it can process both text and images
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Helper function to convert a file to a Base64 part for the API
function fileToGenerativePart(filePath:any, mimeType:any) {
  return {
    inlineData: {
      data: fs.readFileSync(filePath).toString("base64"),
      mimeType
    },
  };
}

// --- Your Main Function (assuming it's in an Express route) ---
// Let's assume inputPath, outputPath, and folderPath are defined earlier
// e.g., in an Express route handler like app.post('/analyze', (req, res) => { ... });

import { Request, Response } from "express";
import { Diagnostic } from "../routes.mongoose";

export default function analyzeEngineSound2(
    req:Request,
    res: Response,
    inputPath: string,
    outputPath: string,
    folderPath: string
) {
  ffmpeg(inputPath)
    .complexFilter(['showspectrumpic=s=800x440:legend=0:scale=log']) // Using a log scale can be better for audio
    .on('end', async () => {
      console.log('Spectrogram generation finished.');

      try {
        // --- Gemini Analysis Logic ---
        console.log('Starting Gemini analysis...');

        // 1. Define the prompt for the AI
        const prompt = `
            You are an AI-powered Engine Diagnostic System, model name "EngineEar." You are a world-class expert in both automotive engineering and acoustic analysis.
            Your task is to analyze the provided engine sound spectrogram and deliver a professional diagnostic report.
            Analyze the following spectrogram of a car engine sound. The spectrogram's vertical axis represents frequency and the horizontal axis represents time:
            **Your Task:**
                    1.  **Analyze the Spectrogram:** Identify key characteristics in the sound pattern (e.g., rhythmic ticking, high-frequency whining, low-frequency rumble, irregular clatter).
                    2.  **Provide Top 3 Diagnoses:** List the three most likely problems. For each diagnosis, explain why the sound pattern points to that issue.
                    3.  **Suggest Next Steps:** For each diagnosis, recommend what the user should check or what a professional mechanic should inspect.
                    4.  **Severity Level:** Assign a severity level (e.g., "Low: Monitor", "Medium: Schedule Inspection Soon", "High: Stop Driving Immediately").
                    5.  **Format your response as a valid JSON object and nothing else. In your response, instead of mentioning Spectrogram, use engine sound instead**
            Your response MUST be a valid JSON object and nothing else.
      
            The JSON object should have the following structure:
            {
                "summary": "A brief, one-sentence summary of the engine's status.",
                "fault":"A short phrase stating the fault.(e.g Low Engine Oil Pressure)"
                "severity":"The severity of the issue. Either High, Medium, or Low",
                "problem":"List at least one most likely problem. For each problem, explain why the sound pattern points to that issue",
                "suggestion":"For each diagnosis, recommend what the user should check or what a professional mechanic should inspect",
                "status": ** Assign a severity level (e.g., "Low: Monitor", "Medium: Schedule Inspection Soon", "High: Stop Driving Immediately"),
                "recommendation": "A general suggested course of action",
            }
            
            If the audio does not sound like a vehicle engine or is unintelligible, return a JSON object with an error message:
            { "error": "The audio file does not contain a clear engine sound." }
        `;

        const prompt2=`
        You are an AI-powered Engine Diagnostic System, model name "EngineEar." You are a world-class expert in both automotive engineering and acoustic analysis.
        Your task is to analyze the provided engine sound spectrogram and deliver a professional diagnostic report in a structured JSON diagnosis.
        Your response MUST be a single, valid JSON object and nothing else. Do not include "json" or any other text outside of the JSON structure.

        Analyze the provided spectrogram based on acoustic fault signatures.

        The JSON output must conform to the following schema:
        {
        "overallHealth": "string (Enum: 'Healthy', 'Caution', 'Serious Issue')",
        "fault":"A short phrase stating the fault.(e.g Low Engine Oil Pressure)"
        "severity":"The severity of the issue. Either High, Medium, or Low",
        "confidenceScore": "float (0.0 to 1.0)",
        "summary": "string (A one-sentence, human-readable summary)",
        "detectedAnomalies": [
            {
            "anomalyType": "string (e.g., 'Rod Knock', 'Piston Slap', 'Lifter Tick', 'Belt Squeal', 'Normal Operation')",
            "description": "string (A brief explanation of the issue)",
            "severity": "string (Enum: 'Low', 'Medium', 'High', 'None')",
            "recommendedAction": "string (A concrete next step for a mechanic)"
            }
        ]
        }
        `

        // 2. Prepare the image for the API
        // The output of showspectrumpic is a PNG
        const imagePart = fileToGenerativePart(outputPath, "image/png");

        // 3. Call the Gemini API
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const analysisText = response.text();

        console.log('Gemini analysis successful.');

        const cleanedJsonString = analysisText.replace(/```json/g, '').replace(/```/g, '').trim();

        let diagnosis;
        try {
            diagnosis = JSON.parse(cleanedJsonString);
        } catch (parseError) {
            console.error("Failed to parse JSON from Gemini:", parseError);
            // If parsing fails, it means the model didn't follow instructions.
            // We can send back the raw text for debugging or a generic error.
            return res.status(500).json({ 
                success: false, 
                error: "AI failed to return valid JSON. Raw response included.",
                rawResponse: analysisText 
            });
        }

        let youtubeUrl = null;
        try {
            let searchQuery = diagnosis?.problem[0].diagnosis || (diagnosis?.summary) || "car engine sound";
            const params = qs.stringify({
                part: 'snippet',
                q: searchQuery + ' car dashboard tutorial',
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
        const createdDiagnosis=await Diagnostic.create({
            userId:'685e6718742d2eed871a2bda',//req.body.userId,
            tutorialVideo:youtubeUrl,
            fault:diagnosis.fault,
            summary:diagnosis.summary,
            recommendation:diagnosis.recommendation,
            indicators:diagnosis.indicators
        })

        // 4. Send the final response including the analysis
        res.status(200).json({
          message: 'Spectrogram created and analyzed successfully!',
          tutorialVideo: youtubeUrl,
          diagnosis: diagnosis, // Include Gemini's analysis
        });

      } catch (geminiError:any) {
        console.error('Gemini API error:', geminiError);
        res.status(500).json({
          error: 'Spectrogram was created, but AI analysis failed.',
          details: geminiError.message,
          imagePath: outputPath, // Still return the path to the generated image
        });
      } finally {
        // Optional: Clean up the audio and image files after processing
        // fs.unlinkSync(inputPath);
        // fs.unlinkSync(outputPath);
      }
    })
    .on('error', (err) => {
      console.error('ffmpeg error:', err.message);
      // Clean up the uploaded audio file if it exists
      // if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      
      res.status(500).json({
        error: 'Failed to generate spectrogram.',
        details: err.message
      });
    })
    .save(outputPath);
}