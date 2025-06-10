import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async searchMentors(query: Record<string, string>): Promise<User[]> {
    const validFields = ['firstName', 'lastName', 'jobTitle', 'company', 'expertise'];
    const where = validFields
      .filter((key) => query[key])
      .map((key) => ({ role: UserRole.MENTOR, [key]: ILike(`%${query[key]}%`) }));

    if (where.length === 0) {
      return this.usersRepository.find({
        where: { role: UserRole.MENTOR },
        select: ['id', 'firstName', 'lastName', 'jobTitle', 'company', 'bio', 'expertise', 'linkedInProfile'],
      });
    }

    return this.usersRepository.find({
      where,
      select: ['id', 'firstName', 'lastName', 'jobTitle', 'company', 'bio', 'expertise', 'linkedInProfile'],
    });
  }

  async getMentorProfile(mentorId: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        id: mentorId,
        role: UserRole.MENTOR,
      },
      select: ['id', 'firstName', 'lastName', 'jobTitle', 'company', 'bio', 'expertise', 'linkedInProfile'],
    });
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return await this.usersRepository.save(newUser);
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, user);
    return this.usersRepository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
