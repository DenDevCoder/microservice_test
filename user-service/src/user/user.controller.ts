import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CatchError } from 'src/common/error.decorator';
import { createUserDto } from './dto/create_user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

    return user;
  }
}
