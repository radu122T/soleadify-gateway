import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle("Scraper service")
    .setDescription("The scraper API description")
    .setVersion("1.0")
    .addTag("scraper")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  await app.listen(4000);
}

bootstrap().catch((error) => {
  console.error("Failed to start microservice", error);
});
