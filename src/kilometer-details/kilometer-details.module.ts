import { Module } from '@nestjs/common';
import { TruckInfoProviders } from 'src/truck-info/truck-info.provider';
import { KilometerDetailsController } from 'src/driver-kilometer-details/kilometer-details.controller';
import { KilometerDetailsService } from 'src/driver-kilometer-details/kilometer-details.service';
import { DriverKilometerDetailsProviders } from 'src/driver-kilometer-details/kilometer-detail.provider';

@Module({
  controllers: [KilometerDetailsController],
  providers: [KilometerDetailsService ,
    ...TruckInfoProviders ,
    ...DriverKilometerDetailsProviders
  ],
  exports : [KilometerDetailsService]
})
export class KilometerDetailsModule {}
