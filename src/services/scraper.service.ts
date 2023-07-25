import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as csv from "csv-parser";
import { KafkaProducerService } from "./kafka-producer.service";
import { Website } from "../dto/webiste.dto";

@Injectable()
export class ScraperService {
  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  async processCsv(file: Express.Multer.File): Promise<void> {
    if (!file) {
      throw new Error("No file provided");
    }
    return new Promise((resolve, reject) => {
      fs.createReadStream(file.path)
        .pipe(csv())
        .on("data", async (row) => {
          await this.kafkaProducerService.send(
            "websites-to-scrape",
            JSON.stringify(row)
          );
        })
        .on("end", () => {
          resolve();
        })
        .on("error", reject);
    });
  }

  async listWebsites(): Promise<any> {
    try {
      const websites = await this.kafkaProducerService.getAllWebsites();
      return websites;
    } catch (error) {
      throw Error(`Something went wrong:${error}`);
    }
  }

  async getWebsiteInfoByDomain(domain: string): Promise<any> {
    try {
      const website = await this.kafkaProducerService.getByDomain(domain);
      return website;
    } catch (error) {
      throw Error(`Something went wrong:${error}`);
    }
  }

  async getWebsiteInfoByPhoneNumber(phoneNumber: string): Promise<any> {
    try {
      const website = await this.kafkaProducerService.getByPhoneNumber(
        phoneNumber
      );
      return website;
    } catch (error) {
      throw Error(`Something went wrong:${error}`);
    }
  }

  async createWebsite(websiteInfo: Website): Promise<any> {
    try {
      const website = await this.kafkaProducerService.createWebsite(
        websiteInfo
      );
      return website;
    } catch (error) {
      throw Error(`Something went wrong:${error}`);
    }
  }

  async updateWebsite(websiteInfo: Website, domain: string): Promise<any> {
    try {
      await this.kafkaProducerService.updateWebsite(websiteInfo, domain);
    } catch (error) {
      throw Error(`Something went wrong:${error}`);
    }
  }

  async deleteWebsite(domain: string): Promise<any> {
    try {
      await this.kafkaProducerService.deleteWebsite(domain);
    } catch (error) {
      throw Error(`Something went wrong:${error}`);
    }
  }
}
