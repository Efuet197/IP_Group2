import { Request, Response } from "express";
import axios from "axios";
import qs from "qs";
import dotenv from 'dotenv';
//For env File 
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Diagnostic } from "../routes.mongoose";

// Initialize the Google Gemini Pro Vision model
// Make sure your GEMINI_API_KEY is set in your .env file
let genAI= new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
/**
 * @desc    Analyzes a car dashboard image to provide a vehicle diagnosis.
 * @route   POST /api/v1/diagnose/dashboard
 * @access  Public (or Private, depending on your auth middleware)
 */
const analyzeDashboard = async (req:Request, res:Response):Promise<any> => {
  try {
    console.log(req.file)
    console.log(req.body)
    console.log(req.body.image)
    // 1. Check if an image file was uploaded
    // if (!req.file) {
    //   return res.status(400).json({
    //     success: false,
    //     error: "No image file uploaded. Please upload an image with the key 'dashboardImage'.",
    //   });
    // }

    // 2. The prompt is crucial. We ask the AI to act as an expert and return structured JSON.
    const diagnosisPrompt = `
      You are an expert car mechanic AI assistant. Analyze the provided car dashboard image.
      Identify all illuminated warning lights, gauges, and any messages on the display.
      Based on your analysis, provide a vehicle diagnosis.
      
      Your response MUST be a valid JSON object and nothing else.
      
      The JSON object should have the following structure:
      {
        "summary": "A brief, one-sentence summary of the vehicle's status.",
        "fault":"A short phrase stating the fault.(e.g Low Engine Oil Pressure)",
        "status": "Urgent" | "Warning" | "Info" | "OK",
        "recommendation": "A general suggested course of action",
        "severity":"The severity of the issue. Either High, Medium, or Low",
        "indicators": [
          {
            "name": "Indicator Name (e.g., 'Check Engine Light')",
            "status": "ON" | "OFF",
            "meaning": "A detailed explanation of what this light means.",
            "recommendation": "A suggested course of action (e.g., 'See a mechanic immediately')."
          }
        ],
        "readings": {
          "speed": "The current speed if visible (e.g., '65 mph' or 'Not visible').",
          "odometer": "The vehicle's mileage if visible (e.g., '120,543 miles' or 'Not visible').",
          "fuelLevel": "Approximate fuel level (e.g., 'Approx. 25%' or 'Empty').",
          "engineTemp": "Engine temperature status (e.g., 'Normal', 'Hot', 'Cold')."
        }
      }

      If the image is not a car dashboard or is unclear, return a JSON object with an error message:
      { "error": "The uploaded image is not a clear car dashboard." }
    `;

    // 3. Prepare the image for the API
    // The Gemini API needs the image data as a base64 string or a Buffer, along with its MIME type.
    // Multer's memory storage provides this as `req.file.buffer` and `req.file.mimetype`.
    const imagePart = {
      inlineData: {
        data: req.body.dashboardImage,//req.file.buffer.toString("base64"),//
        mimeType: req.body.mimeType,//req.file.mimetype,//
      },
    };

    // 4. Send the prompt and image to the Gemini API
    const result = await model.generateContent([diagnosisPrompt, imagePart]);
    const responseText = result.response.text();

    // 5. The API returns the JSON as a string, so we need to parse it.
    // We'll clean up the response to ensure it's valid JSON.
    // The model sometimes wraps the JSON in markdown backticks.
    const cleanedJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
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
            rawResponse: responseText 
        });
    }

    // 6. Search YouTube for a relevant tutorial video based on the diagnosis
    let youtubeUrl = null;
    try {
        let searchQuery = diagnosis?.diagnosisSummary || (diagnosis?.indicators?.[0]?.name) || "car dashboard warning light";
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
      userId:req.body.userId,
      tutorialVideo:youtubeUrl,
      fault:diagnosis.fault,
      summary:diagnosis.summary,
      recommendation:diagnosis.recommendation,
      indicators:diagnosis.indicators
    })
    // 7. Send the successful diagnosis and YouTube tutorial video URL back to the client
    res.status(200).json({
      success: true,
      diagnosis: diagnosis,
      tutorialVideo: youtubeUrl
    });

  } catch (error:any) {
    console.error("Error in dashboard image analysis controller:", error.message.slice(0,200));
    res.status(500).json({
      success: false,
      error: "An internal server error occurred while analyzing the image.",
    });
  }
};
export default analyzeDashboard