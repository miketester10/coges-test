/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Server } from 'http';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

interface QuestionData {
  id: string;
  text: string;
  position: number;
  testId: string;
  options?: {
    id: string;
    text: string;
  }[];
}

describe('Questions API Test (e2e)', () => {
  let app: INestApplication;
  let server: Server;
  let prismaService: PrismaService;

  const createTestWithQuestions = (): Prisma.TestCreateInput => ({
    title: `Test ${Math.random().toString(36).substring(7)}`,
    description: 'Descrizione test generica',
    questions: {
      create: [
        {
          text: 'Domanda di esempio 1',
          position: 1,
          options: {
            create: [
              { text: 'Opzione 1', isCorrect: true },
              { text: 'Opzione 2', isCorrect: false },
              { text: 'Opzione 3', isCorrect: false },
            ],
          },
        },
        {
          text: 'Domanda di esempio 2',
          position: 2,
          options: {
            create: [
              { text: 'Opzione 1', isCorrect: true },
              { text: 'Opzione 2', isCorrect: false },
              { text: 'Opzione 3', isCorrect: false },
              { text: 'Opzione 4', isCorrect: false },
            ],
          },
        },
        {
          text: 'Domanda di esempio 3',
          position: 3,
          options: {
            create: [
              { text: 'Opzione 1', isCorrect: true },
              { text: 'Opzione 2', isCorrect: false },
            ],
          },
        },
      ],
    },
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    // Inizializza l'applicazione NestJS
    await app.init();
    server = app.getHttpServer() as Server;
    prismaService = app.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // Pulisce il database
    await prismaService.clearDatabase();
    // Crea 3 test con domande di esempio
    await Promise.all([
      prismaService.test.create({ data: createTestWithQuestions() }),
      prismaService.test.create({ data: createTestWithQuestions() }),
      prismaService.test.create({ data: createTestWithQuestions() }),
    ]);
  });

  afterAll(async () => {
    // Chiude l'applicazione NestJS dopo i test
    await app.close();
  });

  describe('Recupera tutte le domande', () => {
    it('GET /questions senza dati', async () => {
      await prismaService.clearDatabase();
      await request(server)
        .get('/questions')
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          const questions = res.body as QuestionData[];
          expect(questions.length).toBe(0);
        });
    });

    it('GET /questions con dati', async () => {
      await request(server)
        .get('/questions')
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          const questions = res.body as QuestionData[];
          if (questions.length > 0) {
            questions.forEach((question: QuestionData) => {
              const { id, text, position, testId } = question;
              expect(id).toBeDefined();
              expect(typeof id).toBe('string');
              expect(text).toBeDefined();
              expect(typeof text).toBe('string');
              expect(text.length).toBeGreaterThan(0);
              expect(position).toBeDefined();
              expect(typeof position).toBe('number');
              expect(position).toBeGreaterThan(0);
              expect(testId).toBeDefined();
              expect(typeof testId).toBe('string');
            });
          } else {
            throw new Error('Nessuna domanda disponibile');
          }
        });
    });
  });

  describe('Recupera una singola domanda', () => {
    it('GET /questions/:id con ObjectId valido', async () => {
      // Prima recupera tutte le domande per trovare un ID valido
      const questionsResponse = await request(server).get('/questions');
      const questions = questionsResponse.body as QuestionData[];

      if (questions.length > 0) {
        const questionId = questions[0].id;
        await request(server)
          .get(`/questions/${questionId}`)
          .expect(200)
          .then((res) => {
            const question = res.body as QuestionData;
            const { id, text, position, testId, options } = question;
            expect(id).toBe(questionId);
            expect(typeof id).toBe('string');
            expect(text).toBeDefined();
            expect(typeof text).toBe('string');
            expect(text.length).toBeGreaterThan(0);
            expect(position).toBeDefined();
            expect(typeof position).toBe('number');
            expect(position).toBeGreaterThan(0);
            expect(testId).toBeDefined();
            expect(typeof testId).toBe('string');
            expect(Array.isArray(options)).toBe(true);
            expect(options!.length).toBeGreaterThanOrEqual(2);

            // Verifica struttura delle opzioni
            options!.forEach((option) => {
              expect(option.id).toBeDefined();
              expect(typeof option.id).toBe('string');
              expect(option.text).toBeDefined();
              expect(typeof option.text).toBe('string');
              // isCorrect non deve essere presente nella risposta
              expect(option).not.toHaveProperty('isCorrect');
            });
          });
      } else {
        throw new Error('Nessuna domanda disponibile');
      }
    });

    it('GET /questions/:id con ObjectId non valido', async () => {
      const invalidId = 'not-an-objectid';
      await request(server)
        .get(`/questions/${invalidId}`)
        .expect(400)
        .then((res) => {
          expect(res.body.message).toContain(
            `L'ID fornito non è un MongoDB ObjectId valido: ${invalidId}`,
          );
          expect(res.body.error).toBe('Bad Request');
        });
    });

    it('GET /questions/:id con ObjectId valido ma inesistente', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011'; // Formato ObjectId valido ma inesistente
      await request(server)
        .get(`/questions/${nonExistentId}`)
        .expect(404)
        .then((res) => {
          expect(res.body.message).toBe('Question non trovata');
          expect(res.body.error).toBe('Not Found');
        });
    });
  });
});
