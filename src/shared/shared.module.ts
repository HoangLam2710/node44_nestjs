import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CloudUploadService } from 'src/shared/cloudUpload.service';

@Module({
  imports: [CloudinaryModule],
  providers: [CloudUploadService],
  exports: [CloudUploadService],
})
export class SharedModule {}
