import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    totalPrice: number,
    paymentMethod: string,
    status: string,
  ) {
    try {
      return await this.prisma.order.create({
        data: {
          userId,
          totalPrice,
          paymentMethod,
          status,
        },
      });
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'problem with creating of order',
      );
    }
  }
}
