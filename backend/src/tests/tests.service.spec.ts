/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TestsService } from './tests.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TestsService', () => {
  let testsService: TestsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    test: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    testsService = module.get<TestsService>(TestsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('dovrebbe restituire tutti i test con il conteggio delle domande', async () => {
      const mockTests = [
        {
          id: '1',
          title: 'Test 1',
          description: 'Descrizione test 1',
          _count: { questions: 5 },
        },
        {
          id: '2',
          title: 'Test 2',
          description: 'Descrizione test 2',
          _count: { questions: 3 },
        },
      ];

      mockPrismaService.test.findMany.mockResolvedValue(mockTests);

      const result = await testsService.findAll();

      expect(result).toEqual(mockTests);
      expect(prismaService.test.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          title: true,
          description: true,
          _count: {
            select: { questions: true },
          },
        },
      });
    });
  });

  describe('findById', () => {
    it('dovrebbe restituire un test con le sue domande ordinate per posizione', async () => {
      const mockTest = {
        id: '1',
        title: 'Test completo',
        description: 'Test con domande',
        questions: [{ id: 'q1' }, { id: 'q2' }, { id: 'q3' }],
      };

      mockPrismaService.test.findUnique.mockResolvedValue(mockTest);

      const result = await testsService.findById('1');

      expect(result).toEqual(mockTest);
      expect(prismaService.test.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          questions: {
            select: {
              id: true,
            },
            orderBy: { position: 'asc' },
          },
        },
      });
    });

    it('dovrebbe lanciare NotFoundException se il test non esiste', async () => {
      mockPrismaService.test.findUnique.mockResolvedValue(null);

      await expect(testsService.findById('999')).rejects.toThrow(
        NotFoundException,
      );
      await expect(testsService.findById('999')).rejects.toThrow(
        'Test non trovato',
      );
    });

    it('dovrebbe lanciare BadRequestException se il test ha meno di 3 domande', async () => {
      const mockTest = {
        id: '1',
        title: 'Test incompleto',
        questions: [{ id: 'q1' }, { id: 'q2' }],
      };

      mockPrismaService.test.findUnique.mockResolvedValue(mockTest);

      await expect(testsService.findById('1')).rejects.toThrow(
        BadRequestException,
      );
      await expect(testsService.findById('1')).rejects.toThrow(
        'Il Test deve avere almeno 3 domande',
      );
    });
  });
});
