import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';

@UseGuards(AuthGuard)
@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) { }

  @Post()
  async create(@CurrentUser() user: any, @Body() createBillDto: CreateBillDto) {
    await this.billsService.create(user.sub, createBillDto);
    return { message: 'Bill created successfully' };
  }

  @Get()
  getBillsFromUser(
    @CurrentUser() user: any,
    @Query('month') month?: number,
    @Query('year') year?: number,
    @Query('title') title?: string,
  ) {
    return this.billsService.getBillsFromUser(user.sub, month, year, title);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateBillDto: UpdateBillDto,
  ) {
    return this.billsService.update(+id, user.sub, updateBillDto);
  }

  @Delete('/:id')
  async remove(@CurrentUser() user: any, @Param('id') id: string) {
    await this.billsService.remove(+id, user.sub);
    return { message: 'Bill deleted successfully' };
  }
}
