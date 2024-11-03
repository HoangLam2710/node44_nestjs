import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LoginDto } from 'src/auth/dto/login.dto';
import { EmailDto } from 'src/auth/dto/email.dto';
import { EmailService } from 'src/email/email.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  @Post('/login')
  async login(
    @Body() body: LoginDto,
    @Res() res: Response,
  ): Promise<Response<String>> {
    try {
      const result = await this.authService.login(body);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Post('/register')
  register(@Body() body: any, @Res() res: Response) {}

  @Post('/send-email')
  @ApiBody({ type: EmailDto })
  async sendEmail(@Body() body: EmailDto, @Res() res: Response) {
    const emailTo = body.email;
    const subject = body.subject;
    const text = body.text;

    await this.emailService.sendEmail(emailTo, subject, text);

    return res.status(HttpStatus.OK).json({
      message: 'Email sent successfully',
    });
  }
}
