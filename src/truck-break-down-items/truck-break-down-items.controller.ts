import { Body, Controller, Param, Patch, Post, Put, Res } from '@nestjs/common';
import { TruckBreakDownItemsService } from './truck-break-down-items.service';
import { Response } from 'express';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActiveBreakDownErrorResponse, InsertTruckBreakDownSuccessResponse, NoCheckListErrorResponse } from './interface/response';
import { SwaggerConsumes } from 'src/common/enum';

@ApiTags('TrukBreakDownItems')
@Controller()
export class TrukBreakDownItemsController {
  constructor(
    private readonly truckBreakDownItemsService: TruckBreakDownItemsService,
  ) {}
  @Post('/api/truckbreakdown')
  @ApiConsumes(SwaggerConsumes.Urlencoded, SwaggerConsumes.Json)
  @ApiOperation({ summary: 'Insert a new truck breakdown report' })
  @ApiResponse({
    status: 201,
    description: 'Breakdown report successfully inserted',
    type: InsertTruckBreakDownSuccessResponse,
  })
  @ApiResponse({
    status: 200,
    description: 'An active breakdown already exists',
    type: ActiveBreakDownErrorResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'No checklist found for today',
    type: NoCheckListErrorResponse,
  })
  async generateDriverCode(@Body() body: any, @Res() response: Response) {
    try {
      const res =
        await this.truckBreakDownItemsService.insertTruckBreakDownItems(body);
      response.status(res.status).json(res.message);
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }

  @Put('/api/truckbreakdown/driver/:id')
  async updateById(
    @Param('id') id: number,
    @Body() body: any,
    @Res() response: Response,
  ) {
    try {
      const res = await this.truckBreakDownItemsService.updateByDriver(
        id,
        body,
      );
      response.status(res.status).json(res.message);
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }

  @Patch('/api/truckbreakdown/add-question')
  async addQuestion(){
    
  }
}
