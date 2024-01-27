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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
