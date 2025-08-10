
import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(private repo: UsersRepository) {}

    async create(dto: CreateUserDto) {
        return this.repo.create(dto);
    }

    async findByEmail(email: string) {
        return this.repo.findByEmail(email);
    }

    async findById(id: string) {
        return this.repo.findById(id);
    }

    async setCurrentRefreshToken(userId: string, tokenHash: string) {
        return this.repo.setRefreshToken(userId, tokenHash);
    }

    async removeRefreshToken(userId: string) {
        return this.repo.removeRefreshToken(userId);
    }
}
