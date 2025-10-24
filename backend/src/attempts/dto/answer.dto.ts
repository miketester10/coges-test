import { IsNotEmpty, IsMongoId } from 'class-validator';

export class AnswerDto {
  @IsMongoId()
  @IsNotEmpty()
  questionId: string;

  @IsMongoId()
  @IsNotEmpty()
  chosenOptionId: string;
}
