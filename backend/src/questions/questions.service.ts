import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Question } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

// Servizio per operazioni di sola lettura sui test
@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  // Lista delle questions
  async findAll(): Promise<Question[]> {
    return await this.prisma.question.findMany();
  }

  // Dettaglio completo di una question (escluso isCorrect)
  async findById(id: string): Promise<Question> {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: { options: { select: { id: true, text: true } } },
    });
    if (!question) throw new NotFoundException('Question non trovata');
    if (question.options.length < 2)
      throw new BadRequestException('La Question deve avere almeno 2 risposte');

    return question;
  }
}
