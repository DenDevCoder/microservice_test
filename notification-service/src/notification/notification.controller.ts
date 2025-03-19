import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('notification')
export class NotificationController {
  @EventPattern('user_created')
  userCreated(@Payload() data: any) {
    console.log('user was successfully created:', data);
  }
}
