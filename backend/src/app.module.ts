import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AttemptsModule } from './attempts/attempts.module';
import { PrismaModule } from './prisma/prisma.module';
import { QuestionsModule } from './questions/questions.module';
import { SessionsModule } from './sessions/sessions.module';
import { TestsModule } from './tests/tests.module';
import { DelayMiddleware } from './common/middleware/delay.middleware';

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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // Applica il middleware a tutte le route
    consumer.apply(DelayMiddleware).forRoutes('*');
  }
}
