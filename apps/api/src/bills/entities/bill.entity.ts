import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'bills' })
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  value: number;

  @Column({ default: 0 })
  installments: number;

  @Column()
  billType: string;

  @Column()
  finalDate: Date;

  @Column()
  billDate: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.bills)
  user: User;
}
