import { Module } from '@nestjs/common';
import { CloudinaryConfig } from 'src/cloudinary/cloudinary.config';
import { CloudinaryProvider } from 'src/cloudinary/cloudinary.provider';

@Module({
  providers: [CloudinaryConfig, CloudinaryProvider],
  exports: [CloudinaryProvider],
})
export class CloudinaryModule {}
