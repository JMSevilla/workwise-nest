import { Injectable , Logger, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenExpiredError } from 'jsonwebtoken';
import { JwtRefreshTokenStrategy } from './strategy/jwt-token-refresh.strategy';
import { RefreshTokenIdsStorage } from './refresh-token-ids-storage';


@Injectable()
export class AuthService {
    private readonly logger = new Logger(JwtRefreshTokenStrategy.name)

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly usersService: UserService,
        private readonly configService: ConfigService,
        private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage
    ) {}

    async signIn(signInDto: SignInDto) {
        const user = await this.validateUser(
            signInDto.username,
            signInDto.password
        )
        if(!user) {
            throw new UnauthorizedException('Invalid username or password');
        }

        const payload = { sub: user.id, username: user.username }
        const accessToken = await this.jwtService.signAsync(payload)
        const refreshToken = await this.jwtService.signAsync(payload, { 
            expiresIn: '1d'
        })

        await this.refreshTokenIdsStorage.insert(user.id, refreshToken)

        return { 
            access_token: accessToken,
            refresh_token: refreshToken
        }
    }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findByUsername(username)
        if(user && (await user.validatePassword(password))){
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async refreshAccessToken( refreshToken: string ) : Promise<{ access_token: string }> {
        try {
            const decoded = await this.jwtService.verifyAsync(refreshToken)
            await this.refreshTokenIdsStorage.validate(decoded.sub, refreshToken)
            const payload = { sub: decoded.sub, username: decoded.username }
            const accessToken = await this.jwtService.signAsync(payload)
            return { access_token: accessToken }
        } catch (error) {
            this.logger.error(`Error: ${error.message}`)
            throw new UnauthorizedException('Invalid refresh token')
        }
    }

    async invalidateToken(access_token: string): Promise<void> {
        try {
            const decoded = await this.jwtService.verifyAsync(access_token)
            await this.refreshTokenIdsStorage.invalidate(decoded.sub)
        } catch (error) {
            throw new UnauthorizedException('Invalid access token');
        }
    }
}

