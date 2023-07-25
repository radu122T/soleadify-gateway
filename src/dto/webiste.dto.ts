import { IsNotEmpty, IsOptional } from "class-validator";

export class Website {
  @IsNotEmpty()
  domain: string;

  @IsOptional()
  company_commercial_name?: string;

  @IsOptional()
  company_legal_name?: string;

  @IsOptional()
  company_all_available_names?: string;

  @IsOptional()
  phone_numbers?: string[];

  @IsOptional()
  social_media?: string[];

  @IsOptional()
  address?: string[];
}
