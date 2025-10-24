import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  @IsNotEmpty()
  testId: string;
}
