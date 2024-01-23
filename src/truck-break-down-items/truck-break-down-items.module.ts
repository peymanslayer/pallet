import { Module } from '@nestjs/common';
import { TrukBreakDownItemsController } from './truck-break-down-items.controller';
import { TruckBreakDownItemsService } from './truck-break-down-items.service';
import { TruckBreakDownItemsProviders } from './truck-break-down-items.provider';
import { TruckBreakDownProviders } from 'src/truck-break-down/truck-break-down.provider';

@Module({
  controllers: [TrukBreakDownItemsController],
  providers: [
    TruckBreakDownItemsService,
    ...TruckBreakDownProviders,
    ...TruckBreakDownItemsProviders,
  ],
})
export class TruckBreakDownItemsModule {}
