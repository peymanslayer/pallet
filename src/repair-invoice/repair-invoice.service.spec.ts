import { Test, TestingModule } from '@nestjs/testing';
import { RepairInvoiceService } from './repair-invoice.service';

describe('RepairInvoiceService', () => {
  let service: RepairInvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepairInvoiceService],
    }).compile();

    service = module.get<RepairInvoiceService>(RepairInvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
