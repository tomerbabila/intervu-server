import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { AvailabilitySlot } from '../availability/availability-slot.entity';

@Entity('interviews')
export class Interview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => User)
  mentor: User;

  @ManyToOne(() => User)
  mentee: User;

  @OneToOne(() => AvailabilitySlot)
  @JoinColumn()
  slot: AvailabilitySlot;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ default: false })
  isCompleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
