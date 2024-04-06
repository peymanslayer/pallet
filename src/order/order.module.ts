import { Module, forwardRef } from '@nestjs/common';
import { OrderController } from './controller/order.controller';
import { OrderService } from './services/order.service';
import { OrderProviders } from './order.provider';
import { CommentService } from 'src/comment/services/comment.service';
import { HttpModule } from '@nestjs/axios';
import { CommentModule } from 'src/comment/comment.module';
import { DriverModule } from 'src/driver/driver.module';
import { OrderDriverProviders } from './orderDriver.provider';
import { GenerateCode } from './services/generate.code';
import { OrderDriverService } from './services/orderDriver.service';
import { AuthProviders } from 'src/auth/auth.provider';

@Module({
  imports: [CommentModule, forwardRef(() => DriverModule), HttpModule],
  providers: [
    OrderService,
    GenerateCode,
    OrderDriverService,
    ...OrderProviders,
    ...OrderDriverProviders,
    ...AuthProviders,
  ],
  controllers: [OrderController],
  exports: [OrderService, OrderDriverService],
})
export class OrderModule {}
