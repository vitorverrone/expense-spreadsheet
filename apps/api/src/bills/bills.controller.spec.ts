import { Test, TestingModule } from '@nestjs/testing';
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { AuthGuard } from '../guards/auth.guard';

const mockBillsService = {
  create: jest.fn(),
  getBillsFromUser: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('BillsController', () => {
  let controller: BillsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillsController],
      providers: [
        { provide: BillsService, useValue: mockBillsService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<BillsController>(BillsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
