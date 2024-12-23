import { Body, Controller, Get, Param, Patch, Query, Res } from '@nestjs/common';
import { CartexDto } from './dto/add.dto';
import { Response } from 'express';
import { InsideOrOutsideRepairmenttService } from './inside-or-outside-repairment.service';

@Controller()
export class InternalOrExternalRepairmentController {
  constructor(private readonly insideOrOutsideRepairmenttService: InsideOrOutsideRepairmenttService) {}

  @Patch('api/cartex-type/add/:breakDownId')
  async addCartexType(@Param('breakDownId') breakDownId: number , @Body() cartexDto : CartexDto , @Res() response: Response){
    const res = await this.insideOrOutsideRepairmenttService.setInOrOurRepairment(breakDownId , cartexDto)
    response.status(res.status).json({
      status: res.status,
      message : res.message
    });
  }

  @Get('api/cartex-type')
  async getInsideOrOutsideCartexType(@Query() cartexDto : CartexDto ,  @Res() response: Response ){
    const res = await this.insideOrOutsideRepairmenttService.getInsideOrOutsideCompanyRepairments(cartexDto)

    response.status(res.status).json({
      status: res.status,
      data: res.data,
      message: res.message,
      count : res.count,
    });

  }
}
