import { Module } from '@nestjs/common';
import { CheckListCommentController } from './check-list-comment.controller';
import { CheckListCommentService } from './check-list-comment.service';

@Module({
  controllers: [CheckListCommentController],
  providers: [CheckListCommentService],
})
export class CheckListCommentModule {}
