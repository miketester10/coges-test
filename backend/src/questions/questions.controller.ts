import {
  Controller,
  Get,
  Logger,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { QuestionsService } from './questions.service';
import { Question } from '@prisma/client';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('questions')
export class QuestionsController {
  private readonly logger = new Logger(QuestionsController.name);
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  getAll(): Promise<Question[]> {
    this.logger.debug('Fetch All Questions from DB');
    return this.questionsService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseObjectIdPipe) id: string): Promise<Question> {
    this.logger.debug('Fetch a specific Question from DB');
    return this.questionsService.findById(id);
  }
}
