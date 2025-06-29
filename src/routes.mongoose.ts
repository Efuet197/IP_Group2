import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose, {Schema} from 'mongoose';
import multer from 'multer';
import axios from 'axios';
import analyzeDashboard from './controllers/dashboardScan.controller';
import analyzeEngineSound from './controllers/engineSound.controller';
import fs from "fs";
import path   from "path";
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import analyzeEngineSound2 from './controllers/engine2.controller';

// Point fluent-ffmpeg to the path of the installed binary
// ffmpeg.setFfmpegPath(ffmpegInstaller.path);

enum UserRole {
  carOwner,
  mechanic
}

// --- Mongoose Schemas ---
const mechanicProfileSchema = new mongoose.Schema({
  userId: {type:Schema.Types.ObjectId,ref:'User'},
  expertise: String,
  experienceYears: String,
  availabilityStatus: String,
  workshopLocation: String,
  reviews:[{type:Schema.Types.ObjectId,ref:'Review'}],
  rating: {type:Number},
});
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true,sparse:true},
  fullName: { type: String, required: true },
  phoneNumber: { type: String, unique: true,sparse:true},
  password: { type: String, required: true },
  name: String,
  role: {type:String, enum:['carOwner','mechanic']},
  mechanicProfile:{type:Schema.Types.ObjectId,ref:'MechanicProfile'},
  diagnostics:[{type:Schema.Types.ObjectId,ref:'Diagnostic'}],
},{timestamps:true});
const reviewSchema = new mongoose.Schema({ 
  userId: String,
  mechanic: {type:Schema.Types.ObjectId,ref:'MechanicProfile'},
  rating: Number,
  comment: String,
  date: { type: Date, default: new Date(Date.now()) },
});
const tutorialVideoSchema = new mongoose.Schema({
  url: String,
  title: String,
  faultRelated: [String],
  diagnostic:{type:Schema.Types.ObjectId,ref:'Diagnostic'}
});
const diagnosticSchema = new mongoose.Schema({
  userId: {type:Schema.Types.ObjectId,ref:'User',required:true},
  tutorialVideo:String, //{type:Schema.Types.ObjectId,ref:'TutorialVideo'},
  summary: String,
  faultCode:String,
  recommendation:String,
},{timestamps:true});

const User = mongoose.model('User', userSchema);
const Mechanic = mongoose.model('MechanicProfile', mechanicProfileSchema);
const Review = mongoose.model('Review', reviewSchema);
const TutorialVideo = mongoose.model('TutorialVideo', tutorialVideoSchema);
export const Diagnostic = mongoose.model('Diagnostic', diagnosticSchema);

const router = Router();
const fileFilter = (req:Request, file:any, cb:any) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only images and audio are allowed.'), false);
  }
};
const UPLOAD_DIR = './uploads';
const OUTPUT_DIR = './spectrograms';
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// const upload = multer({ dest: UPLOAD_DIR });
const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: {
    // Limit file size to 15MB to prevent large uploads
    fileSize: 15 * 1024 * 1024 
  },
  dest: UPLOAD_DIR
});
const upload2 = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    // Limit file size to 15MB to prevent large uploads
    fileSize: 15 * 1024 * 1024 
  }
});


/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         email:
 *           type: string
 *         fullName:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         password:
 *           type: string
 *         name:
 *           type: string
 *         role:
 *           type: string
 *           enum: [carOwner, mechanic]
 *         mechanicProfile:
 *           $ref: '#/components/schemas/MechanicProfile'
 *         diagnostics:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Diagnostic'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     MechanicProfile:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         expertise:
 *           type: string
 *         experienceYears:
 *           type: string
 *         availabilityStatus:
 *           type: string
 *         workshopLocation:
 *           type: string
 *         reviews:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Review'
 *         rating:
 *           type: number
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         mechanic:
 *           type: string
 *         rating:
 *           type: number
 *         comment:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *     TutorialVideo:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         url:
 *           type: string
 *         title:
 *           type: string
 *         faultRelated:
 *           type: array
 *           items:
 *             type: string
 *         diagnostic:
 *           type: string
 *     Diagnostic:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         tutorialVideo:
 *           type: string
 *         summary:
 *           type: string
 *         faultCode:
 *           type: string
 *         recommendation:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Failed to create user
 */
// User Endpoints
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err });
  }
});
router.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user', error: err });
  }
});
router.put('/users/:id', async (req: Request, res: Response):Promise<any> => {
  try {
    const { id } = req.params;
    const { name, email, password, phoneNumber, location, role } = req.body;
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (password !== undefined) updateData.password = await bcrypt.hash(password, 10);
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (location !== undefined) updateData.location = location;
    if (role !== undefined) updateData.role = role;
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated', user });
  } catch (err: any) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

/**
 * @openapi
 * /mechanics:
 *   get:
 *     tags: [Mechanics]
 *     summary: Get all mechanics
 *     responses:
 *       200:
 *         description: List of mechanics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MechanicProfile'
 *   post:
 *     tags: [Mechanics]
 *     summary: Create a new mechanic profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MechanicProfile'
 *     responses:
 *       201:
 *         description: Mechanic created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MechanicProfile'
 *       500:
 *         description: Failed to create mechanic
 */
// Mechanic Endpoints
router.get('/mechanics', async (req, res):Promise<any> => {
  try {
    const mechanics = await Mechanic.find().populate('userId');
    console.log(mechanics)
    return res.json(mechanics);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch mechanics', error: err });
  }
});
router.post('/mechanics', async (req, res) => {
  try {
    const mechanic = await Mechanic.create(req.body);
    res.status(201).json(mechanic);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create mechanic', error: err });
  }
});

/**
 * @openapi
 * /reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Get all reviews
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *   post:
 *     tags: [Reviews]
 *     summary: Create a new review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Review created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       500:
 *         description: Failed to create review
 */
// Review Endpoints
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err });
  }
});
router.post('/reviews', async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create review', error: err });
  }
});

/**
 * @openapi
 * /tutorial-videos:
 *   get:
 *     tags: [TutorialVideos]
 *     summary: Get all tutorial videos
 *     responses:
 *       200:
 *         description: List of tutorial videos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TutorialVideo'
 *   post:
 *     tags: [TutorialVideos]
 *     summary: Upload a new tutorial video
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TutorialVideo'
 *     responses:
 *       201:
 *         description: Tutorial video uploaded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TutorialVideo'
 *       500:
 *         description: Failed to upload tutorial video
 */
// TutorialVideo Endpoints
router.get('/tutorial-videos', async (req, res) => {
  try {
    const videos = await TutorialVideo.find();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tutorial videos', error: err });
  }
});
router.post('/tutorial-videos', async (req, res) => {
  try {
    const video = await TutorialVideo.create(req.body);
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload tutorial video', error: err });
  }
});

/**
 * @openapi
 * /diagnostics/{userId}:
 *   get:
 *     tags: [Diagnostics]
 *     summary: Get diagnostics for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of diagnostics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Diagnostic'
 *       500:
 *         description: Failed to fetch diagnostics
 */
// Diagnostic Endpoints
router.get('/diagnostics/:userId', async (req, res) => {
  try {
    const diagnostics = await Diagnostic.find({userId:req.params});
    res.json(diagnostics);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch diagnostics', error: err });
  }
});

/**
 * @openapi
 * /diagnose:
 *   post:
 *     tags: [Diagnosis]
 *     summary: Diagnose car fault from dashboard image or engine sound
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               dashboardImage:
 *                 type: string
 *                 format: binary
 *               engineSound:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Diagnosis result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 diagnosis:
 *                   type: object
 *       500:
 *         description: Diagnosis failed
 */
// Diagnose Route
router.post('/diagnose', upload2.fields([
  { name: 'dashboardImage', maxCount: 1 },
  { name: 'engineSound', maxCount: 1 }
]), async (req, res):Promise<any> => {
  try {
    const dashboardImage = req.files && (req.files as any).dashboardImage ? (req.files as any).dashboardImage[0] : null;
    const engineSound = req.files && (req.files as any).engineSound ? (req.files as any).engineSound[0] : null;

    if (!dashboardImage && !engineSound) {
      return res.status(400).json({ message: 'No dashboard image or engine sound provided' });
    }

    let diagnosisResult = null;

    if (dashboardImage) {
      // Example: Call AI API for dashboard image analysis
      // Replace with your actual AI/external API endpoint and logic
      const aiResponse = await axios.post('https://external-ai-api.example.com/dashboard-diagnosis', {
        image: dashboardImage.buffer.toString('base64'),
      });
      diagnosisResult = aiResponse.data;
    } else if (engineSound) {
      // Example: Call external API for engine sound analysis
      // Replace with your actual external API endpoint and logic
      const soundResponse = await axios.post('https://external-api.example.com/engine-sound-diagnosis', {
        sound: engineSound.buffer.toString('base64'),
      });
      diagnosisResult = soundResponse.data;
    }

    res.json({ diagnosis: diagnosisResult });
  } catch (err: any) {
    res.status(500).json({ message: 'Diagnosis failed', error: err?.response?.data || err.message });
  }
});
/**
 * @openapi
 * /diagnose/dashboard:
 *   post:
 *     tags: [Diagnosis]
 *     summary: Diagnose dashboard image (AI/ML)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               dashboardImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Dashboard diagnosis result
 *       500:
 *         description: Diagnosis failed
 */
router.post(
    '/diagnose/dashboard', 
    upload.single('dashboardImage'),
    analyzeDashboard
);
/**
 * @openapi
 * /diagnose/engine-sound2:
 *   post:
 *     tags: [Diagnosis]
 *     summary: Diagnose engine sound (AI/ML)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               engineSound:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Engine sound diagnosis result
 *       500:
 *         description: Diagnosis failed
 */
router.post(
    '/diagnose/engine-sound2', 
    upload.single('engineSound'),
    analyzeEngineSound
);
/**
 * @openapi
 * /diagnose/engine-sound:
 *   post:
 *     tags: [Diagnosis]
 *     summary: Generate spectrogram from engine sound
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               engineSound:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Spectrogram created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 imagePath:
 *                   type: string
 *                 folderPath:
 *                   type: string
 *       500:
 *         description: Failed to generate spectrogram
 */
router.post(
  '/diagnose/engine-sound', 
  upload.single('engineSound'), 
  (req: Request, res: Response): void => {
    if (!req.file) {
      res.status(400).json({ error: 'No audio file was uploaded.' });
      return;
    }

    // Store the incoming multer file in a folder
    const folderPath = UPLOAD_DIR; // Use the uploads directory
    const fileName = `test-${req.file.originalname}`;
    const filePath = path.join(folderPath, fileName);

    // Write the buffer to disk
    fs.writeFileSync(filePath, req.file.buffer);

    const inputPath = filePath;
    const outputFilename = `${path.parse(req.file.originalname).name}-${Date.now()}.png`;
    const outputPath = path.join(OUTPUT_DIR, outputFilename);

    console.log(`Processing ${inputPath} to generate ${outputPath}`);

    // Use ffmpeg to create the spectrogram
    ffmpeg(inputPath)
      .complexFilter(['showspectrumpic=s=800x400:legend=0'])
      .on('end', () => {
        console.log('Spectrogram generation finished.');
        // Clean up the uploaded audio file
        // fs.unlinkSync(inputPath);

        res.json({
          message: 'Spectrogram created successfully!',
          imagePath: outputPath,
          folderPath // Return the folder path as requested
        });
      })
      .on('error', (err) => {
        console.error('ffmpeg error:', err.message);
        // Clean up the uploaded audio file
        // fs.unlinkSync(inputPath);

        res.status(500).json({ error: 'Failed to generate spectrogram.', details: err.message });
      })
      .save(outputPath); // Save the output to a file
  }
);
/**
 * @openapi
 * /diagnose/engine-sound3:
 *   post:
 *     tags: [Diagnosis]
 *     summary: Diagnose engine sound and generate spectrogram (custom logic)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               engineSound:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Engine sound diagnosis and spectrogram result
 *       500:
 *         description: Diagnosis failed
 */
router.post(
  '/diagnose/engine-sound3', 
  upload.single('engineSound'), 
  (req: Request, res: Response): void => {
    if (!req.file) {
      res.status(400).json({ error: 'No audio file was uploaded.' });
      return;
    }

    // Store the incoming multer file in a folder
    const folderPath = UPLOAD_DIR; // Use the uploads directory
    const fileName = `${req.file.originalname}`;
    const filePath = path.join(folderPath, fileName);

    // Write the buffer to disk
    fs.writeFileSync(filePath, req.file.buffer);

    const inputPath = filePath;
    const outputFilename = `${path.parse(req.file.originalname).name}.png`;
    const outputPath = path.join(OUTPUT_DIR, outputFilename);

    console.log(`Processing ${inputPath} to generate ${outputPath}`);

    // Call the main analysis function
    analyzeEngineSound2(req,res, inputPath, outputPath, folderPath);
  }
);


/**
 * @openapi
 * /auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user or mechanic
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [carOwner, mechanic]
 *               workshopLocation:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               fullName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: User already exists or missing info
 *       500:
 *         description: Signup failed
 */
// Signup Route
router.post('/auth/signup', async (req, res):Promise<any> => {
  const { email, password,role, workshopLocation,phoneNumber,fullName } = req.body;
  try {
    if (!email && !phoneNumber ) {
      return res.status(400).json({ message: 'Email or phone number must be provided' });
    }
    const existingUser =email? await User.findOne({ email }) : await User.findOne({ phoneNumber });
    // const existingUser2 = await User.findOne({ phoneNumber });
    console.log("Existing 1: ",existingUser)
    if (existingUser ) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let user;
    if(role==='mechanic'){
      user = await User.create({ email,phoneNumber, password: hashedPassword,fullName,role});
      // user = email? await User.create({ email, password: hashedPassword,fullName,role}) : await User.create({ phoneNumber, password: hashedPassword,fullName,role});
      const mechanicProfile=await Mechanic.create({workshopLocation,userId:user._id})
      user=await User.findOneAndUpdate({_id:user.id},{mechanicProfile:mechanicProfile._id},{new:true})
    }else{
      // user = email? await User.create({ email, password: hashedPassword,fullName,role}) : await User.create({ password: hashedPassword,phoneNumber,fullName,role});
      user = await User.create({ email,phoneNumber, password: hashedPassword,fullName,role});
    }
    const token =jwt.sign(
        { id: user?._id },
        `${process.env.JWT_SECRET}`,{expiresIn:'24h'}
    );
    res.status(201).json({ message: 'User created',token, user: { ...user?.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err });
  }
});

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email or phone number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: No user with those credentials
 *       500:
 *         description: Login failed
 */
// Login Route
router.post('/auth/login', async (req, res):Promise<any> => {
  const { email, password } = req.body;
  console.log(email, password)
  try {
    let user = await User.findOne({ email }).populate(['mechanicProfile','diagnostics']);
    if (!user) {
      user = await User.findOne({ phoneNumber:email }).populate(['mechanicProfile','diagnostics']);
      if(!user) return res.status(404).json({ message: 'No user with those credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );
    console.log(token, { ...user.toObject(), password: undefined })
    res.json({ token, user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err });
  }
});

export default router;
