import { Module } from '@nestjs/common';
import { DriversIntoRepairShopController } from './drivers-into-repair-shop.controller';
import { DriversIntoRepairShopService } from './drivers-into-repair-shop.service';
import { TruckBreakDownProviders } from 'src/truck-break-down/truck-break-down.provider';
import { AuthModule } from 'src/auth/auth.module';
import { TruckBreakDownItemsProviders } from 'src/truck-break-down-items/truck-break-down-items.provider';

@Module({
  imports : [AuthModule] ,
  controllers: [DriversIntoRepairShopController],
  providers: [DriversIntoRepairShopService , ...TruckBreakDownProviders , ...TruckBreakDownItemsProviders],
  exports: [DriversIntoRepairShopService],
})
export class DriversIntoRepairShopModule {}
