
import { Module, forwardRef } from '@nestjs/common';
import { OperatorController } from './controllers/controller';
import { OperatorService } from './services/operator.service';
import { OperatorProviders } from './opertaor.provider';
import { OrderModule } from 'src/order/order.module';
import { AuthModule } from 'src/auth/auth.module';
import { OperatorShopService } from 'src/operatorShop/services/operatorShop.service';
import { OperatorShopModule } from 'src/operatorShop/operator.module';


@Module({
  imports:[OrderModule,forwardRef(()=>AuthModule),OperatorShopModule],
  controllers: [OperatorController],
  providers: [OperatorService, ...OperatorProviders],
  exports:[OperatorService]
})
export class OperatorModule {}
