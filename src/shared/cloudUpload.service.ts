import { Inject, Injectable } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudUploadService {
  constructor(@Inject('CLOUDINARY') private cloudinary) {}

  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        // define folder on cloudinary to save the image
        { folder },
        // param 2: upload callback
        (error: any, result: UploadApiResponse) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        },
      );

      uploadStream.end(file.buffer);
    });
  }
}
