import { Module } from '@nestjs/common';
import { TrukBreakDownItemsController } from './truck-break-down-items.controller';
import { TruckBreakDownItemsService } from './truck-break-down-items.service';
import { TruckBreakDownProviders } from 'src/truck-break-down/truck-break-down.provider';
import { TruckInfoProviders } from 'src/truck-info/truck-info.provider';
import { TruckBreakDownItemsProviders } from './truck-break-down-items.provider';
import { CheckListProviders } from 'src/check-list/check-list.provider';

@Module({
  controllers: [TrukBreakDownItemsController],
  providers: [
    TruckBreakDownItemsService,
    ...TruckBreakDownProviders,
    ...TruckBreakDownItemsProviders,
    ...TruckInfoProviders,
    ...CheckListProviders
  ],
})
export class TruckBreakDownItemsModule {}
