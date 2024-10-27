import { Exclude, Expose } from 'class-transformer';

export class VideoDto {
  @Expose()
  video_id: number;

  @Expose()
  video_name: string;

  @Expose()
  thumbnail: string;

  @Expose()
  description: string;

  @Expose()
  views: number;

  @Expose()
  source: string;

  @Exclude()
  user_id: number;

  @Exclude()
  type_id: number;

  constructor(partial: Partial<VideoDto>) {
    Object.assign(this, partial);
  }
}
