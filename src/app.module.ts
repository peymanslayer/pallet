import { Module } from '@nestjs/common';
import { DatabaseModule } from './auth/database.module';
import { AuthController } from './auth/controller/auth.controller';
import { AuthService } from './auth/services/auth.service';
import { AuthProviders } from './auth/auth.provider';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { CommentService } from './comment/services/comment.service';
import { CommentModule } from './comment/comment.module';
import { DriverModule } from './driver/driver.module';
import { OperatorModule } from './operator/operator.module';
import { CheckListModule } from './check-list/check-list.module';
import { CheckListCommentModule } from './check-list-comment/check-list-comment.module';
import { TruckBreakDownModule } from './truck-break-down/truck-break-down.module';
import { TruckBreakDownItemsModule } from './truck-break-down-items/truck-break-down-items.module';
import { ChatModule } from './chat/chat.module';
import { TruckInfoModule } from './truck-info/truck-info.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CheckListService } from './check-list/check-list.service';
import { TruckBreakDownService } from './truck-break-down/truck-break-down.service';
import { RepairInvoiceModule } from './repair-invoice/repair-invoice.module';
import { PeriodicTruckCheckModule } from './periodic-truck-check/periodic-truck-check.module';
import { PeriodicTypeModule } from './periodic-type/periodic-type.module';
import { DriversIntoRepairShopModule } from './drivers-into-repair-shop/drivers-into-repair-shop.module';
import { InternalOrExternalRepairmentModule } from './inside-or-outside-repairment/inside-or-outside-repairment.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    OrderModule,
    CommentModule,
    DriverModule,
    OperatorModule,
    CheckListModule,
    CheckListCommentModule,
    TruckBreakDownModule,
    TruckBreakDownItemsModule,
    ChatModule,
    TruckInfoModule,
    RepairInvoiceModule,
    PeriodicTruckCheckModule,
    PeriodicTypeModule,
    DriversIntoRepairShopModule,
    InternalOrExternalRepairmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
