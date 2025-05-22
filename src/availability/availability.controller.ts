import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('availability')
@UseGuards(JwtAuthGuard)
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post('slots')
  @UseGuards(RoleGuard)
  @Roles(UserRole.MENTOR)
  createSlot(@Request() req, @Body() createSlotDto: CreateSlotDto) {
    return this.availabilityService.createSlot(req.user, createSlotDto);
  }

  @Get('mentor/:mentorId')
  getMentorSlots(@Param('mentorId') mentorId: string) {
    return this.availabilityService.getMentorSlots(mentorId);
  }

  @Post('slots/:slotId/book')
  @UseGuards(RoleGuard)
  @Roles(UserRole.MENTEE)
  bookSlot(@Request() req, @Param('slotId') slotId: string) {
    return this.availabilityService.bookSlot(slotId, req.user.id);
  }

  @Post('slots/:slotId/cancel')
  @UseGuards(RoleGuard)
  @Roles(UserRole.MENTEE)
  cancelBooking(@Request() req, @Param('slotId') slotId: string) {
    return this.availabilityService.cancelBooking(slotId, req.user.id);
  }

  @Delete('slots/:slotId')
  @UseGuards(RoleGuard)
  @Roles(UserRole.MENTOR)
  deleteSlot(@Request() req, @Param('slotId') slotId: string) {
    return this.availabilityService.deleteSlot(slotId, req.user.id);
  }
} 