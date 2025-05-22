import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateSlotDto {
  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @IsDateString()
  @IsNotEmpty()
  endTime: string;
}
