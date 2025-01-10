import { Module, forwardRef } from '@nestjs/common';
import { DriverService } from './services/driver.service';
import { DriverProviders } from './driver.provider';
import { DriverController } from './controller/controller';
import { OrderModule } from 'src/order/order.module';
import { OrderDriverService } from 'src/order/services/orderDriver.service';

@Module({
  imports: [forwardRef(() => OrderModule)],
  controllers: [DriverController],
  providers: [DriverService, ...DriverProviders],
  exports: [DriverService],
})
export class DriverModule {}
