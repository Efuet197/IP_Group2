import express, { Express, Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import router from './routes.mongoose'
import { setupSwagger } from './swagger';
import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose'
import cors from 'cors'
import setupSwagger2 from './swagger.mongoose';

//For env File 
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(cors({origin:'http://localhost:8081'}))
app.use(express.json());
// app.use('/api', routes);
app.use('/api', router);
setupSwagger2(app);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

// const prisma = new PrismaClient();
// prisma.$connect()
//   .then(() => {
//     console.log('Connected to MongoDB via Prisma');
//   })
//   .catch((error) => {
//     mongoose.connect("mongodb://localhost:27017/carcare").then(()=>{
//         console.log("Connected to MongoDB without prisma")
//     }).catch((err)=>{
//        console.error('Failed to connect to MongoDB:', err.message);
//        console.error('Failed to connect to MongoDB:', error.message);
//     })
//   });

mongoose.connect("mongodb://localhost:27017/carcare").then(()=>{
      console.log("Connected to MongoDB without prisma")
  }).catch((err)=>{
      console.error('Failed to connect to MongoDB:', err.message);
  })

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
// "dev": " ts-node-dev --respawn --transpile-only src/server.ts"