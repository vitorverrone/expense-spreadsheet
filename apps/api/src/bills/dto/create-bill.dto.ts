import { IsString, IsDate, IsNumber } from 'class-validator';

export class CreateBillDto {
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
