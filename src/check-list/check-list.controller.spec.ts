import { Test, TestingModule } from '@nestjs/testing';
import { CheckListController } from './check-list.controller';

describe('CheckListController', () => {
  let controller: CheckListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckListController],
    }).compile();

    controller = module.get<CheckListController>(CheckListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
