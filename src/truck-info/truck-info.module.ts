import { Module } from '@nestjs/common';
import { TruckInfoController } from './truck-info.controller';
import { TruckInfoService } from './truck-info.service';
import { TruckInfoProviders } from './truck-info.provider';

@Module({
  controllers: [TruckInfoController],
  providers: [TruckInfoService, ...TruckInfoProviders],
})
export class TruckInfoModule {}
