import {
    Injectable,
    OnApplicationBootstrap,
    OnApplicationShutdown
} from '@nestjs/common'
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

export class InvalidatedRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdsStorage implements OnApplicationBootstrap, OnApplicationShutdown {
    private storage: Record<string, string> = {}

    constructor(private configService: ConfigService) {}

    onApplicationShutdown(signal?: string) {
        return;
    }
    onApplicationBootstrap() {
        return;
    }
    async insert(userId: number, tokenId: string): Promise<void> {
        this.storage[this.getKey(userId)] = tokenId
    }
    async validate(userId: number, tokenId: string) : Promise<boolean> {
        const storedId = await this.storage[this.getKey(userId)]
        if(storedId !== tokenId) {
            throw new InvalidatedRefreshTokenError()
        }
        return storedId === tokenId;
    }
    async invalidate(userId: number) : Promise<void> {
        delete this.storage[this.getKey(userId)]
    }
    private getKey(userId: number): string {
        return `user-${userId}`
    }
}