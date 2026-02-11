import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity({ name: 'bills'})
export class Bill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

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
}
