import { BadRequestException } from '@nestjs/common';
import { ParseObjectIdPipe } from './parse-object-id.pipe';

describe('ParseObjectIdPipe', () => {
  let pipe: ParseObjectIdPipe;

  beforeEach(() => {
    pipe = new ParseObjectIdPipe();
  });

  describe('transform', () => {
    it("dovrebbe restituire l'ID se è un ObjectId valido", () => {
      const validObjectId = '507f1f77bcf86cd799439011';
      const result = pipe.transform(validObjectId, { type: 'param' });

      expect(result).toBe(validObjectId);
    });

    it('dovrebbe lanciare BadRequestException per ID non validi', () => {
      const invalidIds = [
        'invalid-id',
        '123',
        'not-an-objectid',
        '',
        '507f1f77bcf86cd79943901', // troppo corto
        '507f1f77bcf86cd7994390111', // troppo lungo
      ];

      invalidIds.forEach((invalidId) => {
        expect(() => {
          pipe.transform(invalidId, { type: 'param' });
        }).toThrow(BadRequestException);

        expect(() => {
          pipe.transform(invalidId, { type: 'param' });
        }).toThrow(
          `L'ID fornito non è un MongoDB ObjectId valido: ${invalidId}`,
        );
      });
    });

    it('dovrebbe funzionare con diversi tipi di metadata', () => {
      const validObjectId = '507f1f77bcf86cd799439011';

      const result1 = pipe.transform(validObjectId, { type: 'param' });
      const result2 = pipe.transform(validObjectId, { type: 'body' });
      const result3 = pipe.transform(validObjectId, { type: 'query' });

      expect(result1).toBe(validObjectId);
      expect(result2).toBe(validObjectId);
      expect(result3).toBe(validObjectId);
    });
  });
});
