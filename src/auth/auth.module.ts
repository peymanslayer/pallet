import { Module, forwardRef } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { StockService } from 'src/ReceiveStock/services/stock.service';
import { StockModule } from 'src/ReceiveStock/stock.module';
import { AuthProviders } from './auth.provider';
import { AuthService } from './services/auth.service';
import { AuthController } from './controller/auth.controller';
import { DriverModule } from 'src/driver/driver.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { OperatorModule } from 'src/operator/operator.module';
import { TruckInfoModule } from 'src/truck-info/truck-info.module';
@Module({
  imports: [
    JwtModule.register({
      secret: '1234rt',
    }),
    StockModule,
    DriverModule,
    forwardRef(() => OperatorModule),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: 'oshanak2022@gmail.com',
          pass: 'vylk hpbm jbku zkrq',
        },
      },
    }),
    TruckInfoModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, ...AuthProviders],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}

import { Module, forwardRef } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { StockService } from 'src/ReceiveStock/services/stock.service';
import { StockModule } from 'src/ReceiveStock/stock.module';
import { AuthProviders } from './auth.provider';
import { AuthService } from './services/auth.service';
import { AuthController } from './controller/auth.controller';
import { DriverModule } from 'src/driver/driver.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { OperatorModule } from 'src/operator/operator.module';
import { TruckInfoModule } from 'src/truck-info/truck-info.module';
@Module({
  imports: [
    JwtModule.register({
      secret: '1234rt',
    }),
    StockModule,
    DriverModule,
    forwardRef(() => OperatorModule),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: 'oshanak2022@gmail.com',
          pass: 'vylk hpbm jbku zkrq',
        },
      },
    }),
    TruckInfoModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, ...AuthProviders],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
