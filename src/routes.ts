import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import multer from 'multer';
import qs from 'qs';

const prisma = new PrismaClient();
const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * tags:
 *   - name: Users
 *   - name: Mechanics
 *   - name: Reviews
 *   - name: TutorialVideos
 *   - name: Diagnostics
 */

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
 * /diagnostics/userId:
 *   get:
 *     summary: Get all diagnostics by a specific user
 *     tags: [Diagnostics]
 *     responses:
 *       200:
 *         description: List of diagnostics
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         fullName:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         phoneNumber:
 *           type: integer
 *         role:
 *           type: string
 *           enum: [car_owner, mechanic]
 *         mechanicProfile:
 *           $ref: '#/components/schemas/MechanicProfile'
 *         diagnostics:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Diagnostic'
 *     MechanicProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         experience_years:
 *           type: integer
 *         specialization:
 *           type: string
 *         availability_status:
 *           type: boolean
 *         workshopLocation:
 *           type: string
 *         userId:
 *           type: string
 *         reviews:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Review'
 *     Review:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         rating:
 *           type: integer
 *         comment:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         diagnosticId:
 *           type: string
 *     TutorialVideo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         url:
 *           type: string
 *         faultRelated:
 *           type: array
 *           items:
 *             type: string
 *         diagnosticId:
 *           type: string
 *     Diagnostic:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         vehicleId:
 *           type: string
 *         imageId:
 *           type: string
 *         audioId:
 *           type: string
 *         summary:
 *           type: string
 *         faultCode:
 *           type: string
 *         recommendation:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         reviews:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Review'
 *         tutorialVideo:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TutorialVideo'
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
 *               - phoneNumber
 *               - password
 *               - fullName
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               workshopLocation:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [car_owner, mechanic]
 *     responses:
 *       201:
 *         description: User created
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
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
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

// User Endpoints
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err });
  }
});
router.post('/users', async (req, res) => {
  try {
    const user = await prisma.user.create({ data: req.body });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user', error: err });
  }
});

// Mechanic Endpoints
router.get('/mechanics', async (req, res) => {
  try {
    const mechanics = await prisma.mechanicProfile.findMany(); 
    res.json(mechanics);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch mechanics', error: err });
  }
});
router.post('/mechanics', async (req, res) => {
  try {
    const mechanic = await prisma.mechanicProfile.create({ data: req.body });
    res.status(201).json(mechanic);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create mechanic', error: err });
  }
});

// DashboardImage Endpoints
// router.get('/dashboard-images', async (req, res) => {
//   try {
//     const images = await prisma.dashboardImage.findMany();
//     res.json(images);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch dashboard images', error: err });
//   }
// });
// router.post('/dashboard-images', async (req, res) => {
//   try {
//     const image = await prisma.dashboardImage.create({ data: req.body });
//     res.status(201).json(image);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to upload dashboard image', error: err });
//   }
// });

// EngineSoundFile Endpoints
// router.get('/engine-sound-files', async (req, res) => {
//   try {
//     const files = await prisma.engineSoundFile.findMany();
//     res.json(files);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch engine sound files', error: err });
//   }
// });
// router.post('/engine-sound-files', async (req, res) => {
//   try {
//     const file = await prisma.engineSoundFile.create({ data: req.body });
//     res.status(201).json(file);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to upload engine sound file', error: err });
//   }
// });

// Review Endpoints
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err });
  }
});
router.post('/reviews', async (req, res) => {
  try {
    const review = await prisma.review.create({ data: req.body });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create review', error: err });
  }
});

// TutorialVideo Endpoints
router.get('/tutorial-videos', async (req, res) => {
  try {
    const videos = await prisma.tutorialVideo.findMany();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tutorial videos', error: err });
  }
});
router.post('/tutorial-videos', async (req, res) => {
  try {
    const video = await prisma.tutorialVideo.create({ data: req.body });
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload tutorial video', error: err });
  }
});

// Diagnostic Endpoints
router.get('/diagnostics/:userId', async (req, res) => {
  try {
    const {userId}=req.params
    const diagnostics = await prisma.diagnostic.findMany({where:{user:{id:userId}}});
    res.json(diagnostics);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch diagnostics', error: err });
  }
});


// Signup Route
router.post('/auth/signup', async (req: Request, res: Response):Promise<any> => {
  const { email, password, fullName, role } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, fullName, role },
    });
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );
    res.status(201).json({ message: 'User created', token,user: { ...user, password: undefined } });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err });
  }
});

// Login Route
router.post('/auth/login', async (req, res):Promise<any>  => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );
    res.json({ token, user: { ...user, password: undefined } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err });
  }
});

// Car Fault Diagnosis Route
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
router.post('/diagnose', upload.fields([
  { name: 'dashboardImage', maxCount: 1 },
  { name: 'engineSound', maxCount: 1 }
]), async (req, res): Promise<any> => {
  try {
    const dashboardImage = req.files && (req.files as any).dashboardImage ? (req.files as any).dashboardImage[0] : null;
    const engineSound = req.files && (req.files as any).engineSound ? (req.files as any).engineSound[0] : null;

    if (!dashboardImage && !engineSound) {
      return res.status(400).json({ message: 'No dashboard image or engine sound provided' });
    }

    let diagnosisResult = null;
    let searchQuery = '';

    if (dashboardImage) {
      // Example: Call AI API for dashboard image analysis
      const aiResponse = await axios.post('https://external-ai-api.example.com/dashboard-diagnosis', {
        image: dashboardImage.buffer.toString('base64'),
      });
      diagnosisResult = aiResponse.data;
      searchQuery = aiResponse.data?.fault || 'car dashboard warning light';
    } else if (engineSound) {
      // Example: Call external API for engine sound analysis
      const soundResponse = await axios.post('https://external-api.example.com/engine-sound-diagnosis', {
        sound: engineSound.buffer.toString('base64'),
      });
      diagnosisResult = soundResponse.data;
      searchQuery = soundResponse.data?.fault || 'car engine sound diagnosis';
    }

    // Search YouTube for a relevant tutorial video
    let youtubeUrl = null;
    try {
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

    res.json({ diagnosis: diagnosisResult, tutorialVideo: youtubeUrl });
  } catch (err: any) {
    res.status(500).json({ message: 'Diagnosis failed', error: err?.response?.data || err.message });
  }
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
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone_number:
 *                 type: integer
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
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, password, phone_number, location, role } = req.body;
    // Only update fields that are provided
    const updateData: any = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (email !== undefined) updateData.email = email;
    if (password !== undefined) updateData.password = await bcrypt.hash(password, 10);
    if (phone_number !== undefined) updateData.phone_number = phone_number;
    if (location !== undefined) updateData.location = location;
    if (role !== undefined) updateData.role = role;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });
    res.json({ message: 'User updated', user });
  } catch (err: any) {
    if (err.code === 'P2025') {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(500).json({ message: 'Update failed', error: err.message });
    }
  }
});

export default router;
