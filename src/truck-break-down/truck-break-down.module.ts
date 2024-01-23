import { Module } from '@nestjs/common';
import { TruckBreakDownController } from './truck-break-down.controller';
import { TruckBreakDownService } from './truck-break-down.service';

@Module({
  controllers: [TruckBreakDownController],
  providers: [TruckBreakDownService],
})
export class TruckBreakDownModule {}
