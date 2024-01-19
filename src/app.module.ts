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

@Module({
  imports: [DatabaseModule,AuthModule,OrderModule,CommentModule,DriverModule,OperatorModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
