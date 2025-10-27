/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Server } from 'http';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

interface TestData {
  id: string;
  title: string;
  description: string;
  _count?: {
    questions: number;
  };
  questions?: {
    id: string;
  }[];
}

describe('API Test (e2e)', () => {
  let app: INestApplication;
  let server: Server;
  let prismaService: PrismaService;

  const createTest = (): Prisma.TestCreateInput => ({
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
    // Crea 3 test di esempio
    await Promise.all([
      prismaService.test.create({ data: createTest() }),
      prismaService.test.create({ data: createTest() }),
      prismaService.test.create({ data: createTest() }),
    ]);
  });

  afterAll(async () => {
    // Chiude l'applicazione NestJS dopo i test
    await app.close();
  });

  describe('Recupera tutti i test', () => {
    it('GET /tests senza dati', async () => {
      await prismaService.clearDatabase();
      await request(server)
        .get('/tests')
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          const tests = res.body as TestData[];
          expect(tests.length).toBe(0);
        });
    });

    it('GET /tests con dati', async () => {
      await request(server)
        .get('/tests')
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          const tests = res.body as TestData[];
          if (tests.length > 0) {
            tests.forEach((test: TestData) => {
              const { id, title, description, _count } = test;
              expect(id).toBeDefined();
              expect(typeof id).toBe('string');
              expect(title).toBeDefined();
              expect(typeof title).toBe('string');
              expect(title.length).toBeGreaterThan(0);
              expect(description).toBeDefined();
              expect(typeof description).toBe('string');
              expect(_count).toBeDefined();
              expect(_count!.questions).toBeGreaterThanOrEqual(3);
            });
          } else {
            fail('Nessun test disponibile');
          }
        });
    });
  });

  describe('Recupera un singolo test', () => {
    it('GET /tests/:id con ObjectId valido', async () => {
      // Prima recupera tutti i test per trovare un ID valido
      const testsResponse = await request(server).get('/tests');
      const tests = testsResponse.body as TestData[];

      if (tests.length > 0) {
        const testId = tests[0].id;
        await request(server)
          .get(`/tests/${testId}`)
          .expect(200)
          .then((res) => {
            const test = res.body as TestData;
            const { id, title, description, questions } = test;
            expect(id).toBe(testId);
            expect(typeof id).toBe('string');
            expect(title).toBeDefined();
            expect(typeof title).toBe('string');
            expect(title.length).toBeGreaterThan(0);
            expect(description).toBeDefined();
            expect(typeof description).toBe('string');
            expect(Array.isArray(questions)).toBe(true);
            expect(questions!.length).toBeGreaterThanOrEqual(3);
            questions!.forEach((question) => {
              expect(question.id).toBeDefined();
              expect(typeof question.id).toBe('string');
            });
          });
      } else {
        fail('Nessun test disponibile');
      }
    });

    it('GET /tests/:id con ObjectId non valido', async () => {
      const invalidId = 'not-an-objectid';
      await request(server)
        .get(`/tests/${invalidId}`)
        .expect(400)
        .then((res) => {
          expect(res.body.message).toContain(
            `L'ID fornito non è un MongoDB ObjectId valido: ${invalidId}`,
          );
          expect(res.body.error).toBe('Bad Request');
        });
    });

    it('GET /tests/:id con ObjectId valido ma inesistente', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011'; // Formato ObjectId valido ma inesistente
      await request(server)
        .get(`/tests/${nonExistentId}`)
        .expect(404)
        .then((res) => {
          expect(res.body.message).toBe('Test non trovato');
          expect(res.body.error).toBe('Not Found');
        });
    });
  });
});
