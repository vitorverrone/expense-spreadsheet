import { IsString, IsDate, IsNumber } from "class-validator";
import { CreateDateColumn } from "typeorm";

export class CreateBillDto {
    @IsNumber()
    userId: number;

    @IsString()
    title: string;

    @IsNumber()
    value: number;

    @IsNumber()
    installments: number;

    @IsString()
    billType: string;

    @IsDate()
    finalDate: Date;

    @IsDate()
    billDate: Date;
}
