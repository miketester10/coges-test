import { Controller, Get, Param } from '@nestjs/common';
import { TestsService } from './tests.service';
import { Test } from '@prisma/client';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';

@Controller('tests')
export class TestsController {
  constructor(private testsService: TestsService) {}

  @Get()
  async getAll(): Promise<Test[]> {
    return await this.testsService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id', ParseObjectIdPipe) id: string): Promise<Test> {
    return await this.testsService.findById(id);
  }
}
