
import { Module, forwardRef } from '@nestjs/common';
import { OperatorShopController } from './controllers/controller';
import { OperatorShopService } from './services/operatorShop.service';
import { OperatorShopProviders } from './operatorShop.provider';
import { OperatorModule } from 'src/operator/operator.module';


@Module({
  imports:[forwardRef(()=>OperatorModule)],
  controllers: [OperatorShopController],
  providers: [OperatorShopService,...OperatorShopProviders],
})
export class OperatorShopModule {}
