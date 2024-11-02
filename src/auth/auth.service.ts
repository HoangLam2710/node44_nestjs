import { BadRequestException, Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { LoginDto } from 'src/auth/dto/login.dto';
import { KeyService } from 'src/key/key.service';

@Injectable()
export class AuthService {
  prisma = new PrismaClient();
  constructor(
    private jwtService: JwtService,
    // private configService: ConfigService,
    private keyService: KeyService,
  ) {}

  async login(body: LoginDto): Promise<String> {
    try {
      const { email, pass_word } = body;
      const checkUser = await this.prisma.users.findFirst({
        where: { email },
      });
      if (!checkUser) {
        throw new BadRequestException('User not found');
      }

      const isMatch = checkUser.pass_word === pass_word;
      if (!isMatch) {
        throw new BadRequestException('Invalid password');
      }

      const token = this.jwtService.sign(
        {
          data: { userId: checkUser.user_id },
        },
        {
          expiresIn: '30m',
          // secret: this.configService.get('SECRET_KEY'),
          privateKey: this.keyService.getPrivateKey(),
          algorithm: 'RS256',
        },
      );

      return token;
    } catch (error) {
      throw new Error(error);
    }
  }
}
