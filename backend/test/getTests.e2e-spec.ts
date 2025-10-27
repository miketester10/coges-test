/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Server } from 'http';
import { PrismaService } from 'src/prisma/prisma.service';

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

    // Pulisce il database prima di eseguire i test
    prismaService = app.get<PrismaService>(PrismaService);
    await prismaService.clearDatabase();
  });

  afterAll(async () => {
    // Chiude l'applicazione NestJS dopo i test
    await app.close();
  });

  describe('Recupera tutti i test', () => {
    it('GET /tests senza dati', async () => {
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
      await prismaService.seed();
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
              expect(title).toBeDefined();
              expect(description).toBeDefined();
              expect(_count).toBeDefined();
            });
          } else {
            console.log('Nessun test disponibile');
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
            expect(title).toBeDefined();
            expect(description).toBeDefined();
            expect(questions).toBeDefined();
            expect(Array.isArray(questions)).toBe(true);
          });
      } else {
        // Salta il test se non esistono tests nel database
        console.log('Nessun test disponibile');
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
