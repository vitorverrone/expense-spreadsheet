import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { Bill } from './entities/bill.entity';
import { ILike, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class BillsService {
    constructor(
        @InjectRepository(Bill)
        private billsRepo: Repository<Bill>
    ) { }

    async create(createBillDto: CreateBillDto) {
        const bill = await this.billsRepo.create(createBillDto);

        if (!bill) {
            throw new BadRequestException('Error creating bill');
        }

        return this.billsRepo.save(bill);
    }

    findAll() {
        return `This action returns all bills`;
    }

    async getBillsFromUser(userId: number, month?: number, year?: number, title?: string) {
        const today = new Date();
        const targetYear = year ? Number(year) : today.getFullYear();
        const targetMonth = month ? Number(month - 1) : today.getMonth();
        const startOfMonth = new Date(targetYear, targetMonth, 1);
        const endOfMonth = new Date(targetYear, targetMonth + 1, 0);

        const query = this.billsRepo.createQueryBuilder('bill').where('bill.userId = :userId', { userId });
 
        query.andWhere(
        `(
            (bill.billType = 'normal' AND bill.billDate >= :startOfMonth AND bill.billDate <= :endOfMonth)
            OR
            (bill.billType = 'installment' AND bill.billDate <= :endOfMonth AND bill.finalDate >= :startOfMonth)
            OR
            (bill.billType = 'recurrent')
        )`,
            {
                startOfMonth,
                endOfMonth,
            }
        );

        if (title) {
            query.andWhere('bill.title ILike :title', { title: `%${title}%` });
        }

        return await query.orderBy('bill.title', 'ASC').getMany();
    }

    update(id: number, updateBillDto: UpdateBillDto) {
        return `This action updates a #${id} bill`;
    }

    async remove(id: number) {
        const bill = await this.billsRepo.findOne({ where: { id } });

        if (!bill) {
            throw new NotFoundException('Bill');
        }

        return this.billsRepo.remove(bill);
    }
}
