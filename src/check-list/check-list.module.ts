import { Module } from '@nestjs/common';
import { CheckListController } from './check-list.controller';
import { CheckListService } from './check-list.service';
import { CheckListProviders } from './check-list.provider';
import { CheckListCommentProviders } from 'src/check-list-comment/check-list-comment.provider';
import { TruckInfoProviders } from 'src/truck-info/truck-info.provider';

@Module({
  controllers: [CheckListController],
  providers: [
    CheckListService,
    ...CheckListProviders,
    ...CheckListCommentProviders,
    ...TruckInfoProviders,
  ],
})
export class CheckListModule {}
