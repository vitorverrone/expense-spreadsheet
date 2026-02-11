import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';

@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Post()
  async create(@Body() createBillDto: CreateBillDto) {
    await this.billsService.create(createBillDto);
    return { message: 'Bill created successfully' };
  }

  // @Get()
  // findAll() {
  //   return this.billsService.findAll();
  // }

  @Get('/:userId')
  getBillsFromUser(@Param('userId') userId: string, @Query('month') month?: number, @Query('year') year?: number, @Query('title') title?: string) {
    return this.billsService.getBillsFromUser(+userId, month, year, title);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBillDto: UpdateBillDto) {
    return this.billsService.update(+id, updateBillDto);
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    await this.billsService.remove(+id);
    return { message: 'Bill deleted successfully' };
  }
}
