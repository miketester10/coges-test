import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from './questions.controller';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { QuestionsService } from './questions.service';

describe('QuestionsController', () => {
  let questionsController: QuestionsController;

  const mockQuestionsService = {
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsController],
      providers: [
        {
          provide: QuestionsService,
          useValue: mockQuestionsService,
        },
      ],
    }).compile();

    questionsController = module.get<QuestionsController>(QuestionsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('dovrebbe restituire tutte le domande', async () => {
      const mockQuestions = [
        { id: '1', text: 'Domanda 1', options: [] },
        { id: '2', text: 'Domanda 2', options: [] },
      ];

      mockQuestionsService.findAll.mockResolvedValue(mockQuestions);

      const result = await questionsController.getAll();

      expect(result).toEqual(mockQuestions);
    });
  });

  describe('getOne', () => {
    it('dovrebbe restituire una domanda specifica', async () => {
      const mockQuestion = {
        id: '507f1f77bcf86cd799439011',
        text: 'Domanda test',
        options: [
          { id: 'opt1', text: 'Opzione 1' },
          { id: 'opt2', text: 'Opzione 2' },
        ],
      };

      mockQuestionsService.findById.mockResolvedValue(mockQuestion);

      const result = await questionsController.getOne(
        '507f1f77bcf86cd799439011',
      );

      expect(result).toEqual(mockQuestion);
    });

    it('dovrebbe propagare NotFoundException dal service', async () => {
      mockQuestionsService.findById.mockRejectedValue(
        new NotFoundException('Question non trovata'),
      );

      await expect(
        questionsController.getOne('507f1f77bcf86cd799439011'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        questionsController.getOne('507f1f77bcf86cd799439011'),
      ).rejects.toThrow('Question non trovata');
    });

    it('dovrebbe propagare BadRequestException dal service', async () => {
      mockQuestionsService.findById.mockRejectedValue(
        new BadRequestException('La Question deve avere almeno 2 risposte'),
      );

      await expect(
        questionsController.getOne('507f1f77bcf86cd799439011'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        questionsController.getOne('507f1f77bcf86cd799439011'),
      ).rejects.toThrow('La Question deve avere almeno 2 risposte');
    });
  });
});
