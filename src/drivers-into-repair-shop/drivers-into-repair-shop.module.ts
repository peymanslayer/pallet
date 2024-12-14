import { Module } from '@nestjs/common';
import { DriversIntoRepairShopController } from './drivers-into-repair-shop.controller';
import { DriversIntoRepairShopService } from './drivers-into-repair-shop.service';
import { TruckBreakDownProviders } from 'src/truck-break-down/truck-break-down.provider';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports : [AuthModule] ,
  controllers: [DriversIntoRepairShopController],
  providers: [DriversIntoRepairShopService , ...TruckBreakDownProviders],
  exports: [DriversIntoRepairShopService],
})
export class DriversIntoRepairShopModule {}
