import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Like } from './Like';
import { Comment } from './Comment';

@Entity('calculations')
export class Calculation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  expression!: string;

  @Column({ type: 'text' })
  result!: string;

  @Column({ type: 'text', default: 'Anonymous' })
  username!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Like, (like) => like.calculation)
  likes!: Like[];

  @OneToMany(() => Comment, (comment) => comment.calculation)
  comments!: Comment[];
}
