import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { KafkaProducerService } from "./services/kafka-producer.service";
import { ScraperController } from "./controller/scraper.controller";
import { ScraperService } from "./services/scraper.service";
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [
    MulterModule.register({
      dest: "./uploads",
    }),
    HttpModule.register({
      timeout: 30000,
    }),
  ],
  controllers: [ScraperController],
  providers: [ScraperService, KafkaProducerService],
})
export class AppModule {}
