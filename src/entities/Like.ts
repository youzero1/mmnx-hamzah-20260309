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

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'integer' })
  calculationId!: number;

  @Column({ type: 'text', default: 'Anonymous' })
  username!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Calculation, (calculation) => calculation.likes)
  @JoinColumn({ name: 'calculationId' })
  calculation!: Calculation;
}
