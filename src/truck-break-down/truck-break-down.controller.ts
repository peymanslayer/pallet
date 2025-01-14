import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { TruckBreakDownService } from './truck-break-down.service';

@Controller()
export class TruckBreakDownController {
  constructor(private truckBreakDownService: TruckBreakDownService) {}
  // list breakdown of panel "Driver"
  @Get('/api/truckbreakdown/')
  async getByUserId(@Query('userId') userId: any, @Res() response: Response) {
    try {
      const res = await this.truckBreakDownService.getByDriverId(userId);
      response.status(res.status).json(res.data);
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }

  @Get('/api/truckbreakdown/pieces')
  async getAllCarNumbers(
    @Res() response: Response
  ){
    const res = await this.truckBreakDownService.getAllPieces()
    response
        .status(res.status)
        .json({ data: res.data, message: res.message});
  }

  @Get('/api/truckbreakdown/driver/notify')
  async driverNotifyReplay(
    @Query('userId') userId: any,
    @Res() response: Response,
  ) {
    try {
      const res = await this.truckBreakDownService.driverNotifyReplay(userId);
      response.status(200).json(res);
    } catch (err) {
      response.status(500).json(err);
    }
  }

  @Get('/api/truckbreakdown/transport/replay')
  async replayTransportAdmin(
    @Query('userId') userId: any,
    @Res() response: Response,
  ) {
    try {
      const res = await this.truckBreakDownService.replayTransportAdmin(userId);
      response.status(res.status).json(res.data);
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }

  @Get('/api/truckbreakdown/all')
  async getAll(@Res() response: Response) {
    try {
      const res = await this.truckBreakDownService.getAll();
      response.status(res.status).json(res.data);
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }

  @Get('/api/truckbreakdown/transport')
  async getAllBreakDownTransport(
    @Res() response: Response,
    @Query('beforeHistory') beforeHistory: string,
    @Query('afterHistory') afterHistory: string,
    @Query('carNumber') carNumber: string,
    @Query('company') company: string,
    @Query('transportComment') transportComment: string,
    @Query('repairDone') repairDone: string,
    @Query('count') count: string,
    @Query('zone') zone: string,
  ) {
    try {
      const res = await this.truckBreakDownService.transportUserGetAll(
        transportComment,
        repairDone,
        count,
        beforeHistory,
        afterHistory,
        carNumber,
        company,
        zone,
      );
      if (count) {
        response.status(res.status).json({ data: res.data , count: res.count});
      } else {
        response.status(res.status).json({ data: res.data, count: res.count });
      }
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }

  @Get('/api/truckbreakdown/transport/countlist')
  async transportUserCountListState() {
    return await this.truckBreakDownService.transportUserCountListState();
  }

  @Get('/api/truckbreakdown/transport/export')
  async exportReportTransportAdmin(
    @Res() response: Response,
    @Query('beforeHistory') beforeHistory: string,
    @Query('afterHistory') afterHistory: string,
    @Query('carNumber') carNumber: string,
    @Query('company') company: string,
    @Query('transportComment') transportComment: string,
    @Query('repairDone') repairDone: string,
    @Query('count') count: string,
    @Query('zone') zone: string,
  ) {
    try {
      const exportExcel =
        await this.truckBreakDownService.exportReportTransportAdmin(
          transportComment,
          repairDone,
          count,
          beforeHistory,
          afterHistory,
          carNumber,
          company,
          zone,
        );
      response.setHeader(
        'Content-Disposition',
        'attachment; filename="exported-data.xlsx"',
      );
      response.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      response.send(exportExcel);
    } catch (err) {
      response.status(500).json('internal server error');
    }
  }
  @Get('/api/truckbreakdown/logistic')
  async getAllBreakDownLogistic(
    @Res() response: Response,
    @Query('beforeHistory') beforeHistory: string,
    @Query('afterHistory') afterHistory: string,
    @Query('carNumber') carNumber: string,
    @Query('company') company: string,
    @Query('logisticComment') logisticComment: string,
    @Query('repairDone') repairDone: string,
    @Query('historyReciveToRepair') reciveToRepair: string,
    @Query('zone') zone: string,
    @Query('count') count: string,
  ) {
    try {
      const res = await this.truckBreakDownService.logisticUserGetAll(
        logisticComment,
        repairDone,
        reciveToRepair,
        count,
        beforeHistory,
        afterHistory,
        carNumber,
        company,
        zone,
      );

      if (count) {
        response.status(res.status).json({ data: res.data });
      } else {
        response.status(res.status).json({ data: res.data, count: res.count });
      }
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }

  // not use now - reserved
  // @Get('/api/truckbreakdown/carPiecesHistory/:carNumber')
  // async getCarPiecesHistory(@Param('carNumber') carNumber: string) {
  //   console.log('carNumber: ', carNumber);
  //   try {
  //     return await this.truckBreakDownService.getCarPiecesHistory(carNumber);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  @Get('/api/truckbreakdown/logistic/export')
  async exportReportLogisticAdmin(
    @Res() response: Response,
    @Query('beforeHistory') beforeHistory: string,
    @Query('afterHistory') afterHistory: string,
    @Query('carNumber') carNumber: string,
    @Query('company') company: string,
    @Query('logisticComment') logisticComment: string,
    @Query('repairDone') repairDone: string,
    @Query('historyReciveToRepair') reciveToRepair: string,
    @Query('zone') zone: string,
    @Query('count') count: string,
  ) {
    try {
      const exportExcel =
        await this.truckBreakDownService.exportReportLogisticAdmin(
          logisticComment,
          repairDone,
          reciveToRepair,
          count,
          beforeHistory,
          afterHistory,
          carNumber,
          company,
          zone,
        );
      response.setHeader(
        'Content-Disposition',
        'attachment; filename="exported-data.xlsx"',
      );
      response.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      response.send(exportExcel);
    } catch (err) {
      response.status(500).json('internal server error');
    }
  }

  @Get('/api/truckbreakdown/repairShop')
  async getAllBreakDownRepairShop(
    @Res() response: Response,
    @Query('beforeHistory') beforeHistory: string,
    @Query('afterHistory') afterHistory: string,
    @Query('carNumber') carNumber: string,
    @Query('company') company: string,
    @Query('transportComment') transportComment: string,
    // @Query('historyReciveToRepair') reciveToRepair: string, // not used
    @Query('deliveryDriver') deliveryDriver: string,
    @Query('count') count: string,
  ) {
    try {
      const res = await this.truckBreakDownService.repairShopGetAll(
        transportComment,
        // reciveToRepair,
        deliveryDriver,
        count,
        beforeHistory,
        afterHistory,
        carNumber,
        company,
      );
      if (count) {
        response.status(res.status).json({ data: res.data });
      } else {
        response.status(res.status).json({ data: res.data, count: res.count });
      }
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }

  @Get('/api/truckbreakdown/:name')
  async getbyId(@Param('name') name: string, @Res() response: Response) {
    try {
      const res = await this.truckBreakDownService.get(name);
      response.status(res.status).json(res.data);
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }

  @Delete('/api/truckbreakdown/all')
  async deleteAll(@Res() response: Response) {
    try {
      const res = await this.truckBreakDownService.deleteAll();
      response.status(res.status).json(res.message);
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }

  @Delete('/api/truckbreakdown/:id')
  async deleteById(@Param('id') id: number, @Res() response: Response) {
    try {
      const res = await this.truckBreakDownService.delete(id);
      response.status(res.status).json(res.message);
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }

  @Put('/api/truckbreakdown/:id')
  async updateTruckBreakDown(
    @Param('id') id: number,
    @Body() body: any,
    @Res() response: Response,
  ) {
    try {
      const res = await this.truckBreakDownService.update(id, body);
      response.status(res.status).json(res.message);
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }

  @Get('/api/truckbreakdown/GetRepairDetails')
  async getRepairDetail(@Body() body: any,@Res() response: Response){
    try{
     const getRepairDetail=await this.truckBreakDownService.getRepairDetail(body)
    }catch(err){
     response.status(500).json('ارور سرور')
    }
  }

  @Post('/api/truckbreakdown/sendToRepair')
  async truckBreakDownSendToRepair(@Body() body: any,@Res() response: Response){
   try{
    
   }catch(err){
    response.status(500).json('ارور سرور')
   }
  }
}
