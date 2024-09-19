import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger'; // Adjust the path if necessary

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Log environment variables for debugging
  console.log('MONGODB_URI:', process.env.MONGODB_URI);
  console.log('JWT_SECRET:', process.env.JWT_SECRET);

  // Enable CORS with specific options if needed
  app.enableCors({
    origin: ['http://localhost:3000','http://localhost:3001'], // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Allow these HTTP methods
    allowedHeaders: 'Content-Type, Authorization', // Allow these headers
  });

  // Setup Swagger
  setupSwagger(app);

  await app.listen(3001); // Start the application on port 3001
}

bootstrap();
