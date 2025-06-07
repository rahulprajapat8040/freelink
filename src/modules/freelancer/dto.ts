import { IsNotEmpty, IsString } from 'class-validator';

export class BidDto {
  @IsNotEmpty({ message: 'jobId is required' })
  @IsString()
  jobId: string;
  @IsNotEmpty({ message: 'Tell us why you is greatFit for this' })
  @IsString()
  whyYou: string;
  @IsNotEmpty({ message: 'bid amount is required' })
  bidAmount: number;
}

export class LanguageDto {
  @IsNotEmpty({ message: "language is required" })
  @IsString()
  language: string
  @IsNotEmpty({ message: "proficiency is required" })
  @IsString()
  proficiency: string
}

export class WorkHistoryDto {
  @IsNotEmpty({ message: "company name is required" })
  @IsString()
  companyName: string
  @IsNotEmpty({ message: "start date is required" })
  @IsString()
  startDate: string
  endDate?: string
  isPresent?: boolean
  @IsNotEmpty({ message: "role is required" })
  @IsString()
  role: string
  @IsNotEmpty({ message: "description is required" })
  @IsString()
  description: string
}

export class SkillDto {
  @IsNotEmpty({ message: "skill name is required" })
  @IsString()
  @IsNotEmpty({ message: "level is required" })
  @IsString()
  level: string
}