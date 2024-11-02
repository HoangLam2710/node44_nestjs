import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { KeyService } from 'src/key/key.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // config: ConfigService,
    keyService: KeyService,
  ) {
    const publicKey = keyService.getPublicKey();

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // secretOrKey: config.get('SECRET_KEY'),
      // --------------------------------------------------------
      // use asymmetric lock
      secretOrKey: publicKey,
      algorithms: ['RS256'],
    });
  }

  prisma = new PrismaClient();

  async validate(tokenDecode: any) {
    const userId = tokenDecode.data.userId;
    const checkUser = await this.prisma.users.findFirst({
      where: { user_id: userId },
    });

    if (!checkUser) {
      return false;
    }
    return tokenDecode;
  }
}
