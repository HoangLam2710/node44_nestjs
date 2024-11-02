import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Headers,
  Res,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { VideoService } from './video.service';
import {
  CreateVideoDto,
  FileUploadDto,
  FileUploadMultipleDto,
} from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Response } from 'express';
import { VideoDto } from 'src/video/dto/video.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { getStorageOptions } from 'src/shared/upload.service';
import { CloudUploadService } from 'src/shared/cloudUpload.service';

// nest g resource video --no-spec

@ApiTags('Video')
@Controller('video')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly cloudUploadService: CloudUploadService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/create-video')
  async create(
    @Body() createVideoDto: CreateVideoDto,
    @Res() res: Response,
  ): Promise<Response<VideoDto>> {
    // return this.videoService.create(createVideoDto);
    try {
      const newVideo = await this.videoService.create(createVideoDto);
      return res.status(HttpStatus.CREATED).json(newVideo);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get('/get-videos')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiQuery({ name: 'Authorization', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all videos successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findAll(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('keyword') keyword: string,
    @Headers('Authorization') auth: string,
    @Res() res: Response,
  ): Promise<Response<VideoDto[]>> {
    // return res.status(HttpStatus.OK).json({ page, size, keyword, auth });
    try {
      const formatPage = page ? Number(page) : 1;
      const formatSize = size ? Number(size) : 10;

      const videos = await this.videoService.findAll(
        formatPage,
        formatSize,
        keyword,
      );
      return res.status(HttpStatus.OK).json(videos);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Post('/upload-thumbnail')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto, required: true })
  @UseInterceptors(
    FileInterceptor('image', { storage: getStorageOptions('videos') }),
  )
  uploadThumbnail(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json(file);
  }

  @Post('/upload-cloudinary')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto, required: true })
  @UseInterceptors(FileInterceptor('image'))
  async uploadThumbnailCloudinary(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      const result = await this.cloudUploadService.uploadImage(file, 'videos');
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Upload failed',
      });
    }
  }

  @Post('/upload-multiple-thumbnail')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadMultipleDto, required: true })
  @UseInterceptors(
    FilesInterceptor('image', 20, { storage: getStorageOptions('videos') }),
  )
  uploadMultipleThumbnail(
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json(files);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.videoService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
  //   return this.videoService.update(+id, updateVideoDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.videoService.remove(+id);
  // }
}
