import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AttemptsModule } from './attempts/attempts.module';
import { PrismaModule } from './prisma/prisma.module';
import { QuestionsModule } from './questions/questions.module';
import { SessionsModule } from './sessions/sessions.module';
import { TestsModule } from './tests/tests.module';
import { DelayMiddleware } from './common/middleware/delay.middleware';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          stores: [
            createKeyv({
              url: configService.get<string>('REDIS_URL'),
              password: configService.get<string>('REDIS_PASSWORD'),
            }),
          ],
          ttl: 60 * 1000, // 60 secondi
        };
      },
    }),
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
