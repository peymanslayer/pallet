import { Test, TestingModule } from '@nestjs/testing';
import { KilometerDetailsService } from './kilometer-details.service';

describe('KilometerDetailsService', () => {
  let service: KilometerDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KilometerDetailsService],
    }).compile();

    service = module.get<KilometerDetailsService>(KilometerDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
