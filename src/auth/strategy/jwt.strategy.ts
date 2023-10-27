import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../jwt-payload.interface';
import { JwtRefreshTokenStrategy } from './jwt-token-refresh.strategy';
import { AccountsService } from 'src/logic/backoffice/accounts/accounts.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtRefreshTokenStrategy.name);
    constructor(private readonly accountsService: AccountsService) {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: process.env.JWT_SECRET || 'secret',
        });
        this.logger.warn('JwtStrategy initialized');
    }
    async validate(payload: JwtPayload): Promise<any> {
        this.logger.warn(`Payload: ${JSON.stringify(payload)}`);
        const user = await this.accountsService.findOne(payload.sub);
        if (!user) {
          this.logger.error('User not found');
          throw new UnauthorizedException();
        }
        return user;
    }
}