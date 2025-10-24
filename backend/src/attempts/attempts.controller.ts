import { Controller, Post, Param, Body } from '@nestjs/common';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { AnswerDto } from './dto/answer.dto';
import { AttemptsService } from './attempts.service';

@Controller('attempts')
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Post(':attemptId/answer')
  async answer(
    @Param('attemptId', ParseObjectIdPipe) attemptId: string,
    @Body() dto: AnswerDto,
  ): Promise<{ message: string }> {
    return await this.attemptsService.answer(attemptId, dto);
  }

  @Post(':attemptId/complete')
  async complete(
    @Param('attemptId', ParseObjectIdPipe) attemptId: string,
  ): Promise<{ totalCorrect: number }> {
    return await this.attemptsService.complete(attemptId);
  }
}
