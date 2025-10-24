import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!ObjectId.isValid(value)) {
      throw new BadRequestException(
        `L'ID fornito non è un MongoDB ObjectId valido: ${value}`,
      );
    }
    return value;
  }
}
