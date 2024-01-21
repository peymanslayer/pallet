import { Module } from '@nestjs/common';
import { CheckListController } from './check-list.controller';
import { CheckListService } from './check-list.service';

@Module({
  controllers: [CheckListController],
  providers: [CheckListService],
})
export class CheckListModule {}
