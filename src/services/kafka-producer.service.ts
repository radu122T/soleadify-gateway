import { Injectable } from "@nestjs/common";
import { Client, ClientKafka, Transport } from "@nestjs/microservices";
import { Observable, firstValueFrom } from "rxjs";
import { Website } from "../dto/webiste.dto";

@Injectable()
export class KafkaProducerService {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: "gateway",
        brokers: ["kafka:9092"],
      },
      consumer: {
        groupId: "gateway-consumer",
      },
    },
  })
  client: ClientKafka;

  onModuleInit() {
    this.client.subscribeToResponseOf("get-all-websites");
    this.client.subscribeToResponseOf("get-by-domain");
    this.client.subscribeToResponseOf("get-by-phoneNumber");
    this.client.subscribeToResponseOf("create-website");
    this.client.subscribeToResponseOf("update-website");
    this.client.subscribeToResponseOf("delete-website");
    const requestPatterns = ["websites-to-scrape"];
    requestPatterns.forEach((pattern) => {
      this.client.subscribeToResponseOf(pattern);
    });
  }

  getAllWebsites(): Promise<any[]> {
    return this.client.send("get-all-websites", {}).toPromise();
  }

  getByDomain(domain: string): Promise<any> {
    return this.client.send("get-by-domain", domain).toPromise();
  }

  getByPhoneNumber(phoneNumber: string): Promise<any> {
    return this.client.send("get-by-phoneNumber", phoneNumber).toPromise();
  }

  createWebsite(website: Website): Promise<any> {
    return this.client.send("create-website", website).toPromise();
  }

  updateWebsite(website: Website, domain: string): Promise<any> {
    return this.client.send("update-website", { website, domain }).toPromise();
  }

  deleteWebsite(domain: string): Promise<any> {
    return this.client.send("delete-website", domain).toPromise();
  }

  async send(topic: string, value: string): Promise<void> {
    const obs$ = this.client.emit(topic, value);
    return firstValueFrom(obs$);
  }
}
