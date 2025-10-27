import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super();
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Connecting to the database...');
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Disconnecting from the database...');
    await this.$disconnect();
  }

  async seed(): Promise<void> {
    // TODO: Implement seed logic here
  }

  async clearDatabase(): Promise<void> {
    await this.$runCommandRaw({ dropDatabase: 1 });
    this.logger.log('Database cleared.');
  }
}
