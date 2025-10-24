import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

// Servizio per operazioni di sola lettura sui test
@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  // Lista dei test con numero di domande per ciascuno
  async findAll(): Promise<Test[]> {
    return await this.prisma.test.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        _count: {
          select: { questions: true },
        },
      },
    });
  }

  // Dettaglio un test con le sue domande (solo id)
  async findById(id: string): Promise<Test> {
    const test = await this.prisma.test.findUnique({
      where: { id },
      include: {
        questions: {
          select: {
            id: true,
          },
          orderBy: { position: 'asc' },
        },
      },
    });
    if (!test) throw new NotFoundException('Test non trovato');
    if (test.questions.length < 3)
      throw new BadRequestException('Il Test deve avere almeno 3 domande');

    return test;
  }
}
