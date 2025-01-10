import { Test, TestingModule } from '@nestjs/testing';
import { CheckListCommentController } from './check-list-comment.controller';

describe('CheckListCommentController', () => {
  let controller: CheckListCommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckListCommentController],
    }).compile();

    controller = module.get<CheckListCommentController>(CheckListCommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
