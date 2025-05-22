import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AvailabilitySlot } from './availability-slot.entity';
import { CreateSlotDto } from './dto/create-slot.dto';
import { User } from '../users/user.entity';
import { UserRole } from '../users/user.entity';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(AvailabilitySlot)
    private availabilityRepository: Repository<AvailabilitySlot>,
  ) {}

  async createSlot(mentor: User, createSlotDto: CreateSlotDto): Promise<AvailabilitySlot> {
    if (mentor.role !== UserRole.MENTOR) {
      throw new ForbiddenException('Only mentors can create availability slots');
    }

    const startTime = new Date(createSlotDto.startTime);
    const endTime = new Date(createSlotDto.endTime);

    if (endTime <= startTime) {
      throw new BadRequestException('End time must be after start time');
    }

    // Check for overlapping slots
    const overlappingSlot = await this.availabilityRepository.findOne({
      where: {
        mentor: { id: mentor.id },
        startTime: Between(startTime, endTime),
      },
    });

    if (overlappingSlot) {
      throw new BadRequestException('This time slot overlaps with an existing slot');
    }

    const slot = this.availabilityRepository.create({
      mentor,
      startTime,
      endTime,
    });

    return this.availabilityRepository.save(slot);
  }

  async getMentorSlots(mentorId: string): Promise<AvailabilitySlot[]> {
    return this.availabilityRepository.find({
      where: {
        mentor: { id: mentorId },
        startTime: Between(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // Next 30 days
      },
      order: {
        startTime: 'ASC',
      },
    });
  }

  async bookSlot(slotId: string, userId: string): Promise<AvailabilitySlot> {
    const slot = await this.availabilityRepository.findOne({
      where: { id: slotId },
    });

    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

    if (!slot.isAvailable) {
      throw new BadRequestException('This slot is already booked');
    }

    slot.isAvailable = false;
    slot.bookedByUserId = userId;

    return this.availabilityRepository.save(slot);
  }

  async cancelBooking(slotId: string, userId: string): Promise<AvailabilitySlot> {
    const slot = await this.availabilityRepository.findOne({
      where: { id: slotId },
    });

    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

    if (slot.bookedByUserId !== userId) {
      throw new ForbiddenException('You can only cancel your own bookings');
    }

    slot.isAvailable = true;
    slot.bookedByUserId = null;

    return this.availabilityRepository.save(slot);
  }

  async deleteSlot(slotId: string, mentorId: string): Promise<void> {
    const slot = await this.availabilityRepository.findOne({
      where: { id: slotId },
      relations: ['mentor'],
    });

    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

    if (slot.mentor.id !== mentorId) {
      throw new ForbiddenException('You can only delete your own slots');
    }

    if (!slot.isAvailable) {
      throw new BadRequestException('Cannot delete a booked slot');
    }

    await this.availabilityRepository.remove(slot);
  }
}
