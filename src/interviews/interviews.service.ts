import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from './interview.entity';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { AvailabilityService } from '../availability/availability.service';
import { User } from '../users/user.entity';

@Injectable()
export class InterviewsService {
  constructor(
    @InjectRepository(Interview)
    private interviewRepository: Repository<Interview>,
    private availabilityService: AvailabilityService,
  ) {}

  async createInterview(slotId: string, menteeId: string, createInterviewDto: CreateInterviewDto): Promise<Interview> {
    const slot = await this.availabilityService.bookSlot(slotId, menteeId);

    if (!slot) {
      throw new BadRequestException('Failed to book the slot');
    }

    const interview = this.interviewRepository.create({
      ...createInterviewDto,
      mentor: { id: slot.mentor.id },
      mentee: { id: menteeId },
      slot,
    });

    return this.interviewRepository.save(interview);
  }

  async getInterview(id: string): Promise<Interview> {
    const interview = await this.interviewRepository.findOne({
      where: { id },
      relations: ['mentor', 'mentee', 'slot'],
    });

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    return interview;
  }

  async getUserInterviews(userId: string): Promise<Interview[]> {
    return this.interviewRepository.find({
      where: [{ mentor: { id: userId } }, { mentee: { id: userId } }],
      relations: ['mentor', 'mentee', 'slot'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async addSummary(id: string, mentorId: string, summary: string): Promise<Interview> {
    const interview = await this.interviewRepository.findOne({
      where: { id, mentor: { id: mentorId } },
    });

    if (!interview) {
      throw new NotFoundException('Interview not found or unauthorized');
    }

    interview.summary = summary;
    interview.isCompleted = true;

    return this.interviewRepository.save(interview);
  }
}
