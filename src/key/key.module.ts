import { Module } from '@nestjs/common';
import { KeyService } from 'src/key/key.service';

@Module({
  providers: [KeyService],
  exports: [KeyService],
})
export class KeyModule {}
