import { Test, TestingModule } from '@nestjs/testing';
import { KilometerService } from './kilometer.service';

describe('KilometerService', () => {
  let service: KilometerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KilometerService],
    }).compile();

    service = module.get<KilometerService>(KilometerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
