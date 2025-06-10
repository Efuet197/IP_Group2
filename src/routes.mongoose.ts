import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import multer from 'multer';
import axios from 'axios';

// --- Mongoose Schemas ---
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: String,
  role: String,
  createdAt: { type: Date, default: Date.now },
});
const mechanicSchema = new mongoose.Schema({
  userId: String,
  expertise: [String],
  rating: Number,
});
const vehicleOwnerSchema = new mongoose.Schema({
  userId: String,
  vehicles: [String],
});
const dashboardImageSchema = new mongoose.Schema({
  url: String,
  uploadedBy: String,
  uploadedAt: { type: Date, default: Date.now },
});
const engineSoundFileSchema = new mongoose.Schema({
  url: String,
  uploadedBy: String,
  uploadedAt: { type: Date, default: Date.now },
});
const reviewSchema = new mongoose.Schema({
  reviewerId: String,
  mechanicId: String,
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now },
});
const tutorialVideoSchema = new mongoose.Schema({
  url: String,
  title: String,
  description: String,
  uploadedBy: String,
  uploadedAt: { type: Date, default: Date.now },
});
const diagnosticSchema = new mongoose.Schema({
  vehicleId: String,
  userId: String,
  symptoms: [String],
  result: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Mechanic = mongoose.model('Mechanic', mechanicSchema);
const VehicleOwner = mongoose.model('VehicleOwner', vehicleOwnerSchema);
const DashboardImage = mongoose.model('DashboardImage', dashboardImageSchema);
const EngineSoundFile = mongoose.model('EngineSoundFile', engineSoundFileSchema);
const Review = mongoose.model('Review', reviewSchema);
const TutorialVideo = mongoose.model('TutorialVideo', tutorialVideoSchema);
const Diagnostic = mongoose.model('Diagnostic', diagnosticSchema);

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *   post:
 *     summary: Create a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created
 */
/**
 * @swagger
 * /mechanics:
 *   get:
 *     summary: Get all mechanics
 *     tags: [Mechanics]
 *     responses:
 *       200:
 *         description: List of mechanics
 *   post:
 *     summary: Create a mechanic
 *     tags: [Mechanics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mechanic'
 *     responses:
 *       201:
 *         description: Mechanic created
 */
/**
 * @swagger
 * /vehicle-owners:
 *   get:
 *     summary: Get all vehicle owners
 *     tags: [VehicleOwners]
 *     responses:
 *       200:
 *         description: List of vehicle owners
 *   post:
 *     summary: Create a vehicle owner
 *     tags: [VehicleOwners]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleOwner'
 *     responses:
 *       201:
 *         description: Vehicle owner created
 */
/**
 * @swagger
 * /dashboard-images:
 *   get:
 *     summary: Get all dashboard images
 *     tags: [DashboardImages]
 *     responses:
 *       200:
 *         description: List of dashboard images
 *   post:
 *     summary: Upload a dashboard image
 *     tags: [DashboardImages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DashboardImage'
 *     responses:
 *       201:
 *         description: Dashboard image uploaded
 */
/**
 * @swagger
 * /engine-sound-files:
 *   get:
 *     summary: Get all engine sound files
 *     tags: [EngineSoundFiles]
 *     responses:
 *       200:
 *         description: List of engine sound files
 *   post:
 *     summary: Upload an engine sound file
 *     tags: [EngineSoundFiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EngineSoundFile'
 *     responses:
 *       201:
 *         description: Engine sound file uploaded
 */
/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of reviews
 *   post:
 *     summary: Create a review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Review created
 */
/**
 * @swagger
 * /tutorial-videos:
 *   get:
 *     summary: Get all tutorial videos
 *     tags: [TutorialVideos]
 *     responses:
 *       200:
 *         description: List of tutorial videos
 *   post:
 *     summary: Upload a tutorial video
 *     tags: [TutorialVideos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TutorialVideo'
 *     responses:
 *       201:
 *         description: Tutorial video uploaded
 */
/**
 * @swagger
 * /diagnostics:
 *   get:
 *     summary: Get all diagnostics
 *     tags: [Diagnostics]
 *     responses:
 *       200:
 *         description: List of diagnostics
 */
/**
 * @swagger
 * /diagnose:
 *   post:
 *     summary: Diagnose car fault from dashboard image or engine sound
 *     tags: [Diagnostics]
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
 *       400:
 *         description: No file provided
 *       500:
 *         description: Diagnosis failed
 */
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - phone_number
 *               - password
 *               - name
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: number
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created, return JWT token
 *       400:
 *         description: User already exists
 *       500:
 *         description: Signup failed
 */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone_number
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: number
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Login failed
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         name:
 *           type: string
 *         role:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     Mechanic:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         expertise:
 *           type: array
 *           items:
 *             type: string
 *         rating:
 *           type: number
 *     VehicleOwner:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         vehicles:
 *           type: array
 *           items:
 *             type: string
 *     DashboardImage:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         url:
 *           type: string
 *         uploadedBy:
 *           type: string
 *         uploadedAt:
 *           type: string
 *           format: date-time
 *     EngineSoundFile:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         url:
 *           type: string
 *         uploadedBy:
 *           type: string
 *         uploadedAt:
 *           type: string
 *           format: date-time
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         reviewerId:
 *           type: string
 *         mechanicId:
 *           type: string
 *         rating:
 *           type: integer
 *         comment:
 *           type: string
 *         createdAt:
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
 *         description:
 *           type: string
 *         uploadedBy:
 *           type: string
 *         uploadedAt:
 *           type: string
 *           format: date-time
 *     Diagnostic:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         vehicleId:
 *           type: string
 *         userId:
 *           type: string
 *         symptoms:
 *           type: array
 *           items:
 *             type: string
 *         result:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

// User Endpoints
router.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});
router.post('/users', async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
});
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user's information
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone_number:
 *                 type: number
 *               location:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [car_owner, mechanic]
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 *       500:
 *         description: Update failed
 */
router.put('/users/:id', async (req: Request, res: Response):Promise<any> => {
  try {
    const { id } = req.params;
    const { name, email, password, phone_number, location, role } = req.body;
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (password !== undefined) updateData.password = await bcrypt.hash(password, 10);
    if (phone_number !== undefined) updateData.phone_number = phone_number;
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

// Mechanic Endpoints
router.get('/mechanics', async (req, res) => {
  const mechanics = await Mechanic.find();
  res.json(mechanics);
});
router.post('/mechanics', async (req, res) => {
  const mechanic = await Mechanic.create(req.body);
  res.status(201).json(mechanic);
});

// VehicleOwner Endpoints
router.get('/vehicle-owners', async (req, res) => {
  const owners = await VehicleOwner.find();
  res.json(owners);
});
router.post('/vehicle-owners', async (req, res) => {
  const owner = await VehicleOwner.create(req.body);
  res.status(201).json(owner);
});

// DashboardImage Endpoints
router.get('/dashboard-images', async (req, res) => {
  const images = await DashboardImage.find();
  res.json(images);
});
router.post('/dashboard-images', async (req, res) => {
  const image = await DashboardImage.create(req.body);
  res.status(201).json(image);
});

// EngineSoundFile Endpoints
router.get('/engine-sound-files', async (req, res) => {
  const files = await EngineSoundFile.find();
  res.json(files);
});
router.post('/engine-sound-files', async (req, res) => {
  const file = await EngineSoundFile.create(req.body);
  res.status(201).json(file);
});

// Review Endpoints
router.get('/reviews', async (req, res) => {
  const reviews = await Review.find();
  res.json(reviews);
});
router.post('/reviews', async (req, res) => {
  const review = await Review.create(req.body);
  res.status(201).json(review);
});

// TutorialVideo Endpoints
router.get('/tutorial-videos', async (req, res) => {
  const videos = await TutorialVideo.find();
  res.json(videos);
});
router.post('/tutorial-videos', async (req, res) => {
  const video = await TutorialVideo.create(req.body);
  res.status(201).json(video);
});

// Diagnostic Endpoints
router.get('/diagnostics', async (req, res) => {
  const diagnostics = await Diagnostic.find();
  res.json(diagnostics);
});
// router.post('/diagnostics', async (req, res) => {
//   const diagnostic = await Diagnostic.create(req.body);
//   res.status(201).json(diagnostic);
// });

// Diagnose Route
router.post('/diagnose', upload.fields([
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

// Signup Route
router.post('/auth/signup', async (req, res):Promise<any> => {
  const { email, password, name, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name, role });
    const token = jwt.sign(
        { id: user._id },
        `${process.env.JWT_SECRET}`,{expiresIn:'24h'}
    );
    res.status(201).json({ message: 'User created',token, user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err });
  }
});

// Login Route
router.post('/auth/login', async (req, res):Promise<any> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
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
    res.json({ token, user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err });
  }
});

export default router;
