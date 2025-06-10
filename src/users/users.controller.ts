import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    try {
      const user = await this.usersService.findOne(id);
      return user;
    } catch (error) {
      throw new NotFoundException('User does not exist!');
    }
  }

  @Post()
  async create(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req, @Body() profileData: Partial<User>) {
    return this.usersService.update(req.user.id, profileData);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async delete(@Request() req): Promise<any> {
    const user = await this.usersService.findOne(req.user.id);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    return this.usersService.delete(req.user.id);
  }

  @Get('mentors/search')
  async searchMentors(@Query() query: Record<string, string>) {
    return this.usersService.searchMentors(query);
  }

  @Get('mentors/:id')
  async getMentorProfile(@Param('id') id: string) {
    return this.usersService.getMentorProfile(id);
  }
}
