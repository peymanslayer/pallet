import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function swaggerInitConfig(app: INestApplication): void {
    const document = new DocumentBuilder()
      .setTitle("Pallet Management")
      .setDescription("")
      .setVersion("V0.0.1")
      .build();
  
    const swaggerDocument = SwaggerModule.createDocument(app, document);
  
    SwaggerModule.setup("/api-docs", app, swaggerDocument, {
      swaggerOptions: {
        withCredentials: true,
      },
    });
  }