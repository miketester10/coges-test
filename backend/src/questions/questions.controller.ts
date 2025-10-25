import { Controller, Get, Param } from '@nestjs/common';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { QuestionsService } from './questions.service';
import { Question } from '@prisma/client';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  getAll(): Promise<Question[]> {
    return this.questionsService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseObjectIdPipe) id: string): Promise<Question> {
    return this.questionsService.findById(id);
  }
}
