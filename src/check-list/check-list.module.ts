import { Module } from '@nestjs/common';
import { CheckListController } from './check-list.controller';
import { CheckListService } from './check-list.service';
import { CheckListProviders } from './check-list.provider';
import { CheckListCommentProviders } from 'src/check-list-comment/check-list-comment.provider';
import { TruckInfoProviders } from 'src/truck-info/truck-info.provider';
import { AuthProviders } from 'src/auth/auth.provider';
import { AuthModule } from 'src/auth/auth.module';
import { TruckBreakDownProviders } from 'src/truck-break-down/truck-break-down.provider';
import { KilometerModule } from 'src/kilometer/kilometer.module';
import { KilometerDetailsModule } from 'src/kilometer-details/kilometer-details.module';

@Module({
  imports: [AuthModule , KilometerModule , KilometerDetailsModule],
  controllers: [CheckListController],
  providers: [
    CheckListService,
    ...CheckListProviders,
    ...CheckListCommentProviders,
    ...TruckInfoProviders,
    ...AuthProviders,
    ...TruckBreakDownProviders
  ],
  exports: [CheckListService],
})
export class CheckListModule {}
