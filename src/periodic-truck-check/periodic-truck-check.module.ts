import { Module } from '@nestjs/common';
import { PeriodicTruckCheckController } from './periodic-truck-check.controller';
import { PeriodicTruckCheckService } from './periodic-truck-check.service';
import { PeriodicTruckCheckProviders } from './periodic-truck-check.provider';
import { AuthProviders } from 'src/auth/auth.provider';
import { TruckInfoModule } from 'src/truck-info/truck-info.module';
import { TruckInfoService } from 'src/truck-info/truck-info.service';
import { PeriodicTypeProvider } from 'src/periodic-type/periodic-type.provider';

@Module({
  imports: [TruckInfoModule],
  controllers: [PeriodicTruckCheckController],
  providers: [
    PeriodicTruckCheckService,
    // TruckInfoService,
    ...PeriodicTruckCheckProviders,
    ...AuthProviders,
    ...PeriodicTypeProvider,
  ],
})
export class PeriodicTruckCheckModule {}
