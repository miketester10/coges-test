import { Controller, Get, Param } from '@nestjs/common';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  getAll() {
    return this.questionsService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.questionsService.findById(id);
  }
}
