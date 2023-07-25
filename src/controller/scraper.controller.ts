import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";
import { Express } from "express";
import { Website } from "src/dto/webiste.dto";
import { ScraperService } from "src/services/scraper.service";

@Controller("/")
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @ApiOperation({ summary: "List all websites" })
  @ApiResponse({ status: 200, description: "List of all websites" })
  @Get("/")
  list(): Promise<any[]> {
    return this.scraperService.listWebsites();
  }

  @ApiParam({
    name: "domain",
    required: true,
    description: "The domain of the website",
  })
  @ApiResponse({ status: 200, description: "A website", type: Website })
  @Get(":domain")
  getByDomain(@Param("domain") domain: string): Promise<any> {
    return this.scraperService.getWebsiteInfoByDomain(domain);
  }

  @ApiParam({
    name: "phoneNumber",
    required: true,
    description: "The phone number of the website",
  })
  @ApiOperation({ summary: "Get a website by its phone number" })
  @ApiResponse({ status: 200, description: "A website", type: Website })
  @Get(":phoneNumber")
  getByPhoneNumber(@Param("phoneNumber") phoneNumber: string): Promise<any> {
    return this.scraperService.getWebsiteInfoByPhoneNumber(phoneNumber);
  }

  @ApiBody({ type: Website })
  @ApiOperation({ summary: "Create a new website" })
  @ApiResponse({
    status: 201,
  })
  @Post()
  async createWebsite(@Body() websiteInfo: Website): Promise<void> {
    await this.scraperService.createWebsite(websiteInfo);
  }

  @ApiBody({ description: "CSV file to upload" })
  @ApiOperation({ summary: "Upload a CSV file" })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({
    status: 200,
    description: "The file has been successfully uploaded.",
  })
  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadCsv(@UploadedFile() file: Express.Multer.File) {
    await this.scraperService.processCsv(file);
    return { message: "CSV data uploaded successfully." };
  }

  @HttpCode(200)
  @ApiOperation({ summary: "Update a website" })
  @ApiResponse({
    status: 200,
    description: "The website has been successfully updated.",
  })
  @Put(":domain")
  async updateWebsite(
    @Body() websiteInfo: Website,
    @Param("domain") domain: string
  ): Promise<void> {
    await this.scraperService.updateWebsite(websiteInfo, domain);
  }

  @HttpCode(500)
  @ApiOperation({ summary: "Delete a website" })
  @ApiResponse({
    status: 500,
    description: "The website has been successfully deleted.",
  })
  @Delete(":domain")
  async deleteWebsite(@Param("domain") domain: string) {
    await this.scraperService.deleteWebsite(domain);
  }
}
