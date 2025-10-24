import { Controller, Post, Body } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';

@Controller('sessions')
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Post()
  async create(@Body() dto: CreateSessionDto): Promise<{ attemptId: string }> {
    return this.sessionsService.startAttempt(dto.name, dto.testId);
  }
}
