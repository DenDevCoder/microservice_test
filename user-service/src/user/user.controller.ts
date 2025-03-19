import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CatchError } from 'src/common/error.decorator';
import { createUserDto } from './dto/create_user.dto';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Controller('user')
export class UserController {
  private notificationClient: ClientProxy;
  constructor(private readonly userService: UserService) {
    this.notificationClient = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'notification_queue',
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  @Get()
  @CatchError('probem witn getting user')
  async getAll() {
    return this.userService.getAll();
  }

  @Post()
  @CatchError('problem with creating user')
  async create(@Body() createUserDto: createUserDto) {
    const { email, password } = createUserDto;
    const user = await this.userService.create(email, password);
    this.notificationClient
      .emit('user_created', {
        id: user.id,
        email: user.email,
      })
      .subscribe({
        next: () => {
          console.log('Notification sent:');
        },
        error: (error) => {
          console.error('Error sending notification:', error);
        },
      });
    return user;
  }
}
