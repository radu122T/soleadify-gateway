import { Test, TestingModule } from "@nestjs/testing";
import { ScraperController } from "../../src/controller/scraper.controller";
import { ScraperService } from "../../src/services/scraper.service";
import { Website } from "../../src/dto/webiste.dto";

jest.mock("src/services/scraper.service");

describe("ScraperController", () => {
  let controller: ScraperController;
  let service: jest.Mocked<ScraperService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScraperController],
      providers: [ScraperService],
    }).compile();

    controller = module.get<ScraperController>(ScraperController);
    service = module.get(ScraperService);
  });

  it("should list websites", async () => {
    const websitesMock = [{ domain: "example.com" }, { domain: "sample.com" }];
    service.listWebsites.mockResolvedValue(websitesMock);

    const websites = await controller.list();
    expect(websites).toEqual(websitesMock);
  });

  it("should get website info by domain", async () => {
    const websiteMock = { domain: "example.com", phone: "1234567890" };
    service.getWebsiteInfoByDomain.mockResolvedValue(websiteMock);

    const website = await controller.getByDomain("example.com");
    expect(website).toEqual(websiteMock);
  });

  it("should get website info by phone number", async () => {
    const websiteMock = { domain: "example.com", phone: "1234567890" };
    service.getWebsiteInfoByPhoneNumber.mockResolvedValue(websiteMock);

    const website = await controller.getByPhoneNumber("1234567890");
    expect(website).toEqual(websiteMock);
  });

  it("should create a website", async () => {
    const websiteInfo: Website = {
      domain: "example.com",
      phone_numbers: ["1234567890"],
    };
    service.createWebsite.mockResolvedValue(undefined);

    await expect(controller.createWebsite(websiteInfo)).resolves.not.toThrow();
    expect(service.createWebsite).toHaveBeenCalledWith(websiteInfo);
  });

  it("should update a website", async () => {
    const websiteInfo: Website = {
      domain: "example.com",
      phone_numbers: ["1234567890"],
    };
    service.updateWebsite.mockResolvedValue(undefined);

    await expect(
      controller.updateWebsite(websiteInfo, "example.com")
    ).resolves.not.toThrow();
    expect(service.updateWebsite).toHaveBeenCalledWith(
      websiteInfo,
      "example.com"
    );
  });

  it("should delete a website", async () => {
    service.deleteWebsite.mockResolvedValue(undefined);

    await expect(
      controller.deleteWebsite("example.com")
    ).resolves.not.toThrow();
    expect(service.deleteWebsite).toHaveBeenCalledWith("example.com");
  });
});
