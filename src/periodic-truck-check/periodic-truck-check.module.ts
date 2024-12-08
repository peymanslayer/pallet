import { Module } from '@nestjs/common';
import { PeriodicTruckCheckController } from './periodic-truck-check.controller';
import { PeriodicTruckCheckService } from './periodic-truck-check.service';
import { PeriodicTruckCheckProviders } from './periodic-truck-check.provider';
import { AuthProviders } from 'src/auth/auth.provider';

@Module({
  controllers: [PeriodicTruckCheckController],
  providers: [
    PeriodicTruckCheckService,
    ...PeriodicTruckCheckProviders,
    ...AuthProviders,
  ],
})
export class PeriodicTruckCheckModule {}
