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
  ): Promise<any> {
    // return res.status(HttpStatus.OK).json({ page, size, keyword, auth });
    try {
      return await this.videoService.findAll();
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
