import { Injectable } from '@nestjs/common';
import { CatchError } from 'src/common/error.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  @CatchError('problem with getting user')
  async getOne(user_id: string) {
    return await this.prisma.user.findUnique({ where: { id: user_id } });
  }

  @CatchError('problem with getting users')
  async getAll() {
    return await this.prisma.user.findMany();
  }

  @CatchError('problem with creating user')
  async create(email: string, password: string) {
    return await this.prisma.user.create({ data: { email, password } });
  }

  @CatchError('problem with getting user')
  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }
}
