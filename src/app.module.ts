import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideoModule } from './video/video.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), VideoModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
