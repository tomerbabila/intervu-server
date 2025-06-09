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

  async searchMentors(query: string): Promise<User[]> {
    const searchTerm = `%${query}%`;

    return await this.usersRepository.find({
      where: [
        { role: UserRole.MENTOR, firstName: ILike(searchTerm) },
        { role: UserRole.MENTOR, lastName: ILike(searchTerm) },
        { role: UserRole.MENTOR, jobTitle: ILike(searchTerm) },
        { role: UserRole.MENTOR, company: ILike(searchTerm) },
        { role: UserRole.MENTOR, expertise: ILike(searchTerm) },
      ],
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

  async updateProfile(userId: string, profileData: Partial<User>): Promise<User> {
    await this.usersRepository.update(userId, profileData);
    return this.usersRepository.findOne({ where: { id: userId } });
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
