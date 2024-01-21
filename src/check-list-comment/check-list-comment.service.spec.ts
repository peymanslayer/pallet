import { Test, TestingModule } from '@nestjs/testing';
import { CheckListCommentService } from './check-list-comment.service';

describe('CheckListCommentService', () => {
  let service: CheckListCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckListCommentService],
    }).compile();

    service = module.get<CheckListCommentService>(CheckListCommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
