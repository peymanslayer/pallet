import { Module } from '@nestjs/common';
import { PeriodicTypeService } from './periodic-type.service';
import { PeriodicTypeController } from './periodic-type.controller';
import { PeriodicTypeProvider } from './periodic-type.provider';

@Module({
  providers: [PeriodicTypeService, ...PeriodicTypeProvider],
  controllers: [PeriodicTypeController],
})
export class PeriodicTypeModule {}
