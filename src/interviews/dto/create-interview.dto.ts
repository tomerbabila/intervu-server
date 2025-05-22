import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateInterviewDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;
}
