import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { TestsService } from 'src/tests/tests.service';

// Servizio che crea l'Attempt (sessione di test)
@Injectable()
export class SessionsService {
  constructor(
    private prisma: PrismaService,
    private testsService: TestsService,
  ) {}
  private readonly logger = new Logger(SessionsService.name);

  // Avvia un tentativo: crea Attempt e restituisce il suo id
  async startAttempt(
    name: string,
    testId: string,
  ): Promise<{ attemptId: string }> {
    // Trova o crea utente
    const user = await this.findOrCreateUserByName(name);

    // Elimina tentivi incompleti precedenti per lo stesso user e test
    await this.deleteIncompleteAttempts(user.id, testId);

    // Recupera test con domande ordinate e opzioni
    const test = await this.testsService.findById(testId);

    // Crea nuovo tentativo
    const attempt = await this.prisma.attempt.create({
      data: {
        userId: user.id,
        testId: test.id,
      },
    });

    return { attemptId: attempt.id };
  }

  // Recupera tentativo per id
  async findById(attemptId: string) {
    const attempt = await this.prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        test: {
          include: {
            questions: {
              include: { options: true },
            },
          },
        },
        answers: true,
      },
    });

    if (!attempt) throw new NotFoundException('Tentativo non trovato');

    return attempt;
  }

  // Trova o crea utente
  private async findOrCreateUserByName(name: string): Promise<User> {
    let user = await this.prisma.user.findFirst({ where: { name } });
    if (!user) {
      user = await this.prisma.user.create({ data: { name } });
    }
    return user;
  }

  // Elimina tentivi incompleti precedenti per lo stesso user e test (e risposte collegate)
  private async deleteIncompleteAttempts(
    userId: string,
    testId: string,
  ): Promise<void> {
    // Trova tutti i tentativi incompleti per userId e testId
    const incompleteAttempts = await this.prisma.attempt.findMany({
      where: { userId, testId, isCompleted: false },
      select: { id: true },
    });

    const attemptIds = incompleteAttempts.map((attempt) => attempt.id);

    if (attemptIds.length === 0) {
      // Nessun tentativo incompleto, non serve fare nulla
      return;
    }

    // Se una delete fallisce, l’intera transazione viene rollbackata
    await this.prisma.$transaction(async (tx) => {
      // Cancella prima tutte le risposte collegate ai tentativi
      await tx.attemptAnswer.deleteMany({
        where: { attemptId: { in: attemptIds } },
      });

      // Cancella i tentativi stessi
      await tx.attempt.deleteMany({
        where: { id: { in: attemptIds } },
      });
    });

    this.logger.log(
      `✅ Eliminati n. ${attemptIds.length} tentativi incompleti e le relative risposte`,
    );
  }
}
