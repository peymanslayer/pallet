import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // HIGH: 1. check all dto in system
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip out unwanted properties
      forbidNonWhitelisted: true, // Throw an error if extra properties are present
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );
  app.enableCors();
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
