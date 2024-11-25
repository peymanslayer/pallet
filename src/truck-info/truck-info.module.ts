import { Module } from '@nestjs/common';
import { TruckInfoController } from './truck-info.controller';
import { TruckInfoService } from './truck-info.service';
import { TruckInfoProviders } from './truck-info.provider';
import { Auth } from 'src/auth/auth.entity';
import { AuthProviders } from 'src/auth/auth.provider';

@Module({
  imports: [Auth],
  controllers: [TruckInfoController],
  providers: [TruckInfoService, ...TruckInfoProviders, ...AuthProviders],
  exports: [TruckInfoService],
})
export class TruckInfoModule {}
