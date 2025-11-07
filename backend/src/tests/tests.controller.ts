import {
  Controller,
  Get,
  Logger,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { TestsService } from './tests.service';
import { Test } from '@prisma/client';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('tests')
export class TestsController {
  private readonly logger = new Logger(TestsController.name);
  constructor(private testsService: TestsService) {}

  @Get()
  async getAll(): Promise<Test[]> {
    this.logger.debug('Fetch All Tests from DB');
    return await this.testsService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id', ParseObjectIdPipe) id: string): Promise<Test> {
    this.logger.debug('Fetch a specific Test from DB');
    return await this.testsService.findById(id);
  }
}
