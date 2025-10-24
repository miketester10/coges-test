import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnswerDto } from './dto/answer.dto';
import { SessionsService } from 'src/sessions/sessions.service';

@Injectable()
export class AttemptsService {
  constructor(
    private readonly prisma: PrismaService,
    private sessionsService: SessionsService,
  ) {}

  async answer(
    attemptId: string,
    dto: AnswerDto,
  ): Promise<{ message: string }> {
    // Recupera il tentativo
    const attempt = await this.sessionsService.findById(attemptId);

    if (attempt.isCompleted)
      throw new BadRequestException('Hai già completato il test.');

    // Verifica che la domanda appartenga al test
    const question = attempt.test.questions.find(
      (q) => q.id === dto.questionId,
    );
    if (!question)
      throw new BadRequestException('Domanda non valida per questo test');

    // Verifica che la risposta appartenga alla domanda
    const chosenOption = question.options.find(
      (o) => o.id === dto.chosenOptionId,
    );
    if (!chosenOption)
      throw new BadRequestException('Risposta non valida per questa domanda');

    // Se la domanda è già stata risolta, aggiorna la risposta
    const alreadyAnswered = attempt.answers.some(
      (a) => a.questionId === dto.questionId,
    );
    if (alreadyAnswered)
      await this.prisma.attemptAnswer.updateMany({
        where: {
          attemptId: attempt.id,
          questionId: dto.questionId,
        },
        data: {
          chosenOptionId: dto.chosenOptionId,
          isCorrect: chosenOption.isCorrect,
          updatedAt: new Date(),
        },
      });
    else {
      // Registra la risposta
      await this.prisma.attemptAnswer.create({
        data: {
          attemptId: attempt.id,
          questionId: dto.questionId,
          chosenOptionId: dto.chosenOptionId,
          isCorrect: chosenOption.isCorrect,
        },
      });
    }

    return { message: 'Risposta registrata con successo' };
  }

  async complete(attemptId: string): Promise<{ totalCorrect: number }> {
    // Recupera il tentativo
    const attempt = await this.sessionsService.findById(attemptId);

    // Verifica che il tentativo, quindi il test, non sia già stato completato
    if (attempt.isCompleted)
      throw new BadRequestException('Hai già completato il test.');

    // Verifica che tutte le domande del test siano state risposte nel tentativo corrente
    if (attempt.answers.length < attempt.test.questions.length)
      throw new BadRequestException(
        'Devi rispondere a tutte le domande prima di completare il test.',
      );

    // Calcola il numero di risposte corrette
    const totalCorrect = await this.prisma.attemptAnswer.count({
      where: { attemptId: attempt.id, isCorrect: true },
    });

    // Segna il tentativo come completato
    await this.prisma.attempt.update({
      where: { id: attempt.id },
      data: {
        totalCorrect,
        isCompleted: true,
        finishedAt: new Date(),
      },
    });

    return { totalCorrect: totalCorrect };
  }
}
