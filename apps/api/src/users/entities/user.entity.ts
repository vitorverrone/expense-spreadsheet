import { AfterInsert, Entity, Column, PrimaryGeneratedColumn, AfterUpdate, AfterRemove } from "typeorm";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ select: false })
    password: string;

    @Column()
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({ type: 'decimal', scale: 2, default: 0 })
    salary: number;

    @Column({ nullable: true })
    salarySubtraction: boolean;
}
