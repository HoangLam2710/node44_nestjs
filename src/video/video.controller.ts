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
} from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Response } from 'express';
import { VideoDto } from 'src/video/dto/video.dto';

// nest g resource video --no-spec

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  // @Post()
  @Post('/create-video')
  create(@Body() createVideoDto: CreateVideoDto, @Res() res: Response) {
    return res.status(HttpStatus.CREATED).json(createVideoDto);
    // return this.videoService.create(createVideoDto);
  }

  @Get('/get-videos')
  async findAll(
    @Query('page') page: string,
    @Query('size') size: string,
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoService.remove(+id);
  }
}
