import { Controller, Put, Param, Body, Patch } from '@nestjs/common';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { AnswerDto } from './dto/answer.dto';
import { AttemptsService } from './attempts.service';

@Controller('attempts')
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Put(':attemptId/answer')
  async answer(
    @Param('attemptId', ParseObjectIdPipe) attemptId: string,
    @Body() dto: AnswerDto,
  ): Promise<{ message: string }> {
    return await this.attemptsService.answer(attemptId, dto);
  }

  @Patch(':attemptId/complete')
  async complete(
    @Param('attemptId', ParseObjectIdPipe) attemptId: string,
  ): Promise<{ totalCorrect: number }> {
    return await this.attemptsService.complete(attemptId);
  }
}
