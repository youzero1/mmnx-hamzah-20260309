import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Calculation } from './Calculation';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'integer' })
  calculationId!: number;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'text', default: 'Anonymous' })
  username!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Calculation, (calculation) => calculation.comments)
  @JoinColumn({ name: 'calculationId' })
  calculation!: Calculation;
}
