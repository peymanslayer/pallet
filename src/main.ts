import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { swaggerInitConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // CHK: could not to implement this for all route.not compatible!!!
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, // Strip out unwanted properties
  //     forbidNonWhitelisted: true, // Throw an error if extra properties are present
  //     transform: true, // Automatically transform payloads to DTO instances
  //   }),
  // );
  swaggerInitConfig(app);
  app.enableCors();
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
