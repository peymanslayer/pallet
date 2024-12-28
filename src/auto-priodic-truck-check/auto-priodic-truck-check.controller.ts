import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AutoPriodicTruckCheckService } from './auto-priodic-truck-check.service';
import { PeriodicTruckCheckTypes } from 'src/common/constants';
import { AutoAdd } from './dto/add.dto';

@Controller()
export class AutoPriodicTruckCheckController {
  constructor(private readonly autoPriodicTruckCheckService: AutoPriodicTruckCheckService) {}

  @Post('/api/auto-priodic-truck-check/:breakdownId')
  async auto (@Param('breakdownId') breakdownId: number , @Body() autoAdd: AutoAdd) {
    return this.autoPriodicTruckCheckService.autoAdd(breakdownId , autoAdd)
  }

}
