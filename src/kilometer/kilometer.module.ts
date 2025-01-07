import { Module } from '@nestjs/common';
import { KilometerService } from './kilometer.service';
import { KilometerController } from './kilometer.controller';
import { TruckInfoProviders } from 'src/truck-info/truck-info.provider';
import { KilometerProviders } from './kilometer.provider';

@Module({
  controllers: [KilometerController],
  providers: [KilometerService ,
    ...TruckInfoProviders ,
    ...KilometerProviders
  ],
  exports : [KilometerService]
})
export class KilometerModule {}
