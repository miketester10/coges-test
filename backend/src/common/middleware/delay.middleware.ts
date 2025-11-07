import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DelayMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Applica un ritardo di 500 ms
    // await new Promise((resolve, reject) => setTimeout(resolve, 500));
    next();
  }
}
