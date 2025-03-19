import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { createOrderDto } from './dto/create-order.dto';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('order')
export class OrderController {
  private userClient: ClientProxy;
  constructor(private readonly orderService: OrderService) {
    this.userClient = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'users_queue',
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  @Post()
  async create(@Body() createOrderDto: createOrderDto) {
    const { email, totalPrice, paymentMethod, status } = createOrderDto;
    const user = await firstValueFrom(
      this.userClient.send('get_user_by_email', email),
    );
    try {
      return this.orderService.create(
        user.id,
        totalPrice,
        paymentMethod,
        status,
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}
