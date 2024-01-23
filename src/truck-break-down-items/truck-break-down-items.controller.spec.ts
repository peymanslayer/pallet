import { Test, TestingModule } from '@nestjs/testing';
import { TrukBreakDownItemsController } from './truck-break-down-items.controller';

describe('TrukBreakDownItemsController', () => {
  let controller: TrukBreakDownItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrukBreakDownItemsController],
    }).compile();

    controller = module.get<TrukBreakDownItemsController>(
      TrukBreakDownItemsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
