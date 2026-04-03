import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptService {
  async hash(str: string) {
    return await bcrypt.hash(str, 10);
  }

  async compare(str: string, hash: string) {
    return await bcrypt.compare(str, hash);
  }
}
