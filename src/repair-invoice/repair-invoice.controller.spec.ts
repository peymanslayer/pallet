import { Test, TestingModule } from '@nestjs/testing';
import { RepairInvoiceController } from './repair-invoice.controller';

describe('RepairInvoiceController', () => {
  let controller: RepairInvoiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepairInvoiceController],
    }).compile();

    controller = module.get<RepairInvoiceController>(RepairInvoiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
