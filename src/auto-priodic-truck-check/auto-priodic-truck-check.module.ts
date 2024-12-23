import { Module } from '@nestjs/common';
import { AutoPriodicTruckCheckService } from './auto-priodic-truck-check.service';
import { AutoPriodicTruckCheckController } from './auto-priodic-truck-check.controller';
import { AuthProviders } from 'src/auth/auth.provider';
import { PeriodicTypeProvider } from 'src/periodic-type/periodic-type.provider';
import { PeriodicTruckCheckModule } from 'src/periodic-truck-check/periodic-truck-check.module';
import { TruckBreakDownModule } from 'src/truck-break-down/truck-break-down.module';
import { TruckBreakDownProviders } from 'src/truck-break-down/truck-break-down.provider';
import { PeriodicTypeModule } from 'src/periodic-type/periodic-type.module';
import { TruckInfoProviders } from 'src/truck-info/truck-info.provider';
import { TruckInfoModule } from 'src/truck-info/truck-info.module';
import { PeriodicTruckCheckProviders } from 'src/periodic-truck-check/periodic-truck-check.provider';

@Module({
  imports : [PeriodicTruckCheckModule , TruckBreakDownModule , PeriodicTypeModule , TruckInfoModule , PeriodicTruckCheckModule] ,
  controllers: [AutoPriodicTruckCheckController],
  providers: [AutoPriodicTruckCheckService ,
              ...AuthProviders,
              ...PeriodicTypeProvider,
              ...TruckBreakDownProviders  ,
              ...TruckInfoProviders,
              ...PeriodicTruckCheckProviders
  ],
})
export class AutoPriodicTruckCheckModule {}
