import { Module } from '@nestjs/common';
import { AttemptsModule } from './attempts/attempts.module';
import { PrismaModule } from './prisma/prisma.module';
import { QuestionsModule } from './questions/questions.module';
import { SessionsModule } from './sessions/sessions.module';
import { TestsModule } from './tests/tests.module';

@Module({
  imports: [
    QuestionsModule,
    AttemptsModule,
    SessionsModule,
    TestsModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
