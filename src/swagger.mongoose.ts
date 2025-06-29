import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'CarCare API',
    version: '1.0.1',
    description: 'API documentation for the CarCare backend.',
  },
  servers: [
    {
      url: 'http://localhost:8000/api',
      description: 'Local server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const options = {
  swaggerDefinition,
  // Path to the API docs (your routes file)
  apis: ['./src/routes.mongoose.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default function setupSwagger2(app: Express) {
  app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
