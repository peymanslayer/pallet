import { Module } from '@nestjs/common';
import { KilometerDetailsService } from './kilometer-details.service';
import { KilometerDetailsController } from './kilometer-details.controller';
import { TruckInfoProviders } from 'src/truck-info/truck-info.provider';
import { KilometerDetailsProviders } from './kilometer-detail.provider';

@Module({
  controllers: [KilometerDetailsController],
  providers: [KilometerDetailsService ,
    ...TruckInfoProviders ,
    ...KilometerDetailsProviders
  ],
  exports : [KilometerDetailsService]
})
export class KilometerDetailsModule {}
