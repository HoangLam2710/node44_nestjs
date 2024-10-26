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

  @Get('/get-videos/:page/:size')
  findAll(
    @Param('page') page: string,
    @Param('size') size: string,
    @Query('keyword') keyword: string,
    @Headers('Authorization') auth: string,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({ page, size, keyword, auth });
    // return this.videoService.findAll();
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
