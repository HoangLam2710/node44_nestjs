import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { VideoType } from 'src/video/enum/video_type.enum';

export class CreateVideoDto {
  @IsNotEmpty({ message: 'Video name is required' })
  @ApiProperty() // show prowperty in swagger
  video_name: string;

  @IsNotEmpty({ message: 'Thumbnail is required' })
  @ApiProperty()
  thumbnail: string;

  @IsNotEmpty({ message: 'Description is required' })
  @ApiProperty()
  description: string;

  @ApiProperty()
  views: number;

  @IsNotEmpty({ message: 'Source is required' })
  @ApiProperty()
  source: string;

  user_id: number;

  @IsEnum(VideoType, { message: 'Video type is not valid' })
  @ApiProperty({ enum: VideoType })
  type_id: number;
}
