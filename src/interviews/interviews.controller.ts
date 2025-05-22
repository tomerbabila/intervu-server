import { Controller, Post, Get, Body, Param, UseGuards, Request, Put, ForbiddenException } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('interviews')
@UseGuards(JwtAuthGuard)
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post('slots/:slotId')
  @UseGuards(RoleGuard)
  @Roles(UserRole.MENTEE)
  createInterview(
    @Param('slotId') slotId: string,
    @Request() req,
    @Body() createInterviewDto: CreateInterviewDto,
  ) {
    return this.interviewsService.createInterview(slotId, req.user.id, createInterviewDto);
  }

  @Get(':id')
  async getInterview(@Param('id') id: string, @Request() req) {
    const interview = await this.interviewsService.getInterview(id);
    if (interview.mentor.id !== req.user.id && interview.mentee.id !== req.user.id) {
      throw new ForbiddenException('You can only view your own interviews');
    }
    return interview;
  }

  @Get('user/me')
  getUserInterviews(@Request() req) {
    return this.interviewsService.getUserInterviews(req.user.id);
  }

  @Put(':id/summary')
  @UseGuards(RoleGuard)
  @Roles(UserRole.MENTOR)
  addSummary(
    @Param('id') id: string,
    @Request() req,
    @Body('summary') summary: string,
  ) {
    return this.interviewsService.addSummary(id, req.user.id, summary);
  }
} 