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
