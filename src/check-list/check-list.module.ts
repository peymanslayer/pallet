import { Module } from '@nestjs/common';
import { CheckListController } from './check-list.controller';
import { CheckListService } from './check-list.service';
import { CheckListProviders } from './check-list.provider';
import { CheckListCommentProviders } from 'src/check-list-comment/check-list-comment.provider';

@Module({
  controllers: [CheckListController],
  providers: [
    CheckListService,
    ...CheckListProviders,
    ...CheckListCommentProviders,
  ],
})
export class CheckListModule {}
