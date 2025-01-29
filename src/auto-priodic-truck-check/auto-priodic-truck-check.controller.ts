import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AutoPriodicTruckCheckService } from './auto-priodic-truck-check.service';
import { PeriodicTruckCheckTypes } from 'src/common/constants';
import { AutoAdd } from './dto/add.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('َAuto Truck Checks')
@Controller()
export class AutoPriodicTruckCheckController {
  constructor(private readonly autoPriodicTruckCheckService: AutoPriodicTruckCheckService) {}

  @Post('/api/auto-priodic-truck-check/:breakdownId')
  @ApiOperation({ summary: 'Add an auto periodic truck check' }) 
  @ApiParam({ name: 'breakdownId', required: true, description: 'ID of the breakdown' })
  @ApiBody({ type: AutoAdd })
  @ApiResponse({ status: 200, description: 'The operation was successful.', type: [Object] }) 
  @ApiResponse({ status: 400, description: 'Bad request.' }) 
  @ApiResponse({ status: 404, description: 'Breakdown or truck not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async auto (@Param('breakdownId') breakdownId: number , @Body() autoAdd: AutoAdd) {
    return this.autoPriodicTruckCheckService.autoAdd(breakdownId , autoAdd)
  }

}
