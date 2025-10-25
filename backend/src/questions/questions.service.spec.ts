/* eslint-disable @typescript-eslint/unbound-method */

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { PrismaService } from '../prisma/prisma.service';

describe('QuestionsService', () => {
  let questionsService: QuestionsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    question: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    questionsService = module.get<QuestionsService>(QuestionsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('dovrebbe restituire tutte le domande', async () => {
      const mockQuestions = [
        { id: '1', text: 'Domanda 1', options: [] },
        { id: '2', text: 'Domanda 2', options: [] },
      ];

      mockPrismaService.question.findMany.mockResolvedValue(mockQuestions);

      const result = await questionsService.findAll();

      expect(result).toEqual(mockQuestions);
      expect(prismaService.question.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('dovrebbe restituire una domanda con le sue opzioni', async () => {
      const mockQuestion = {
        id: '1',
        text: 'Domanda test',
        options: [
          { id: 'opt1', text: 'Opzione 1' },
          { id: 'opt2', text: 'Opzione 2' },
        ],
      };

      mockPrismaService.question.findUnique.mockResolvedValue(mockQuestion);

      const result = await questionsService.findById('1');

      expect(result).toEqual(mockQuestion);
      expect(prismaService.question.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          options: { select: { id: true, text: true } },
        },
      });
    });

    it('dovrebbe lanciare NotFoundException se la domanda non esiste', async () => {
      mockPrismaService.question.findUnique.mockResolvedValue(null);

      await expect(questionsService.findById('999')).rejects.toThrow(
        NotFoundException,
      );
      await expect(questionsService.findById('999')).rejects.toThrow(
        'Question non trovata',
      );
    });

    it('dovrebbe lanciare BadRequestException se la domanda ha meno di 2 opzioni', async () => {
      const mockQuestion = {
        id: '1',
        text: 'Domanda con una sola opzione',
        options: [{ id: 'opt1', text: 'Sola opzione' }],
      };

      mockPrismaService.question.findUnique.mockResolvedValue(mockQuestion);

      await expect(questionsService.findById('1')).rejects.toThrow(
        BadRequestException,
      );
      await expect(questionsService.findById('1')).rejects.toThrow(
        'La Question deve avere almeno 2 risposte',
      );
    });
  });
});
