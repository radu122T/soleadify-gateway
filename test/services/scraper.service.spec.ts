import { Test, TestingModule } from "@nestjs/testing";
import { KafkaProducerService } from "../../src/services/kafka-producer.service";
import { ScraperService } from "../../src/services/scraper.service";
import { Website } from "../../src/dto/webiste.dto";

jest.mock("./kafka-producer.service");

describe("ScraperService", () => {
  let service: ScraperService;
  let kafkaProducerService: jest.Mocked<KafkaProducerService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScraperService, KafkaProducerService],
    }).compile();

    service = module.get<ScraperService>(ScraperService);
    kafkaProducerService = module.get(KafkaProducerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should get all websites", async () => {
    const websitesMock = [
      { domain: "example.com", someField: "someValue" },
      { domain: "another.com", someField: "anotherValue" },
    ];
    kafkaProducerService.getAllWebsites.mockResolvedValue(websitesMock);

    const websites = await service.listWebsites();
    expect(websites).toEqual(websitesMock);
  });

  it("should get website info by domain", async () => {
    const websiteMock = { domain: "example.com", someField: "someValue" };
    kafkaProducerService.getByDomain.mockResolvedValue(websiteMock);

    const website = await service.getWebsiteInfoByDomain("example.com");
    expect(website).toEqual(websiteMock);
  });

  it("should get website info by phone number", async () => {
    const websiteMock = {
      domain: "example.com",
      phone_numbers: ["1234567890"],
    };
    kafkaProducerService.getByPhoneNumber.mockResolvedValue(websiteMock);

    const website = await service.getWebsiteInfoByPhoneNumber("1234567890");
    expect(website).toEqual(websiteMock);
  });

  it("should create website", async () => {
    const websiteInfo: Website = {
      domain: "example.com",
      phone_numbers: ["1234567890"],
    };
    kafkaProducerService.createWebsite.mockResolvedValue(websiteInfo);

    const website = await service.createWebsite(websiteInfo);
    expect(website).toEqual(websiteInfo);
  });

  it("should update website", async () => {
    const websiteInfo: Website = {
      domain: "example.com",
      phone_numbers: ["1234567890"],
    };

    kafkaProducerService.updateWebsite.mockResolvedValue(undefined);

    await expect(
      service.updateWebsite(websiteInfo, "example.com")
    ).resolves.not.toThrow();
    expect(kafkaProducerService.updateWebsite).toHaveBeenCalledWith(
      websiteInfo,
      "example.com"
    );
  });

  it("should delete website", async () => {
    kafkaProducerService.deleteWebsite.mockResolvedValue(undefined);

    await expect(service.deleteWebsite("example.com")).resolves.not.toThrow();
    expect(kafkaProducerService.deleteWebsite).toHaveBeenCalledWith(
      "example.com"
    );
  });
});
