import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CheckListService } from './check-list.service';
import { Response } from 'express';

@Controller()
export class CheckListController {
  constructor(private readonly checkListService: CheckListService) {}

  @Get('/api/checklist/dailycheck/')
  async checkListDaily(
    @Query('userId') userId: number,
    @Query('date') date: string,
    @Query('done') done: string,
    @Query('beforeHistory') beforeHistory: string,
    @Query('afterHistory') afterHistory: string,
    @Query('zone') zone: string,
    @Query('company') company: string,
    @Res() response: Response,
  ) {
    try {
      const res = await this.checkListService.dailyCheck(
        userId,
        date,
        done,
        beforeHistory,
        afterHistory,
        zone,
        company,
      );
      response
        .status(res.status)
        .json({ data: res.data, message: res.message});
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }

  @Get('/api/checklist/checknewcarlife')
  async checkCarLifeMoreThanLast(
    @Query('driverId') driverId: number,
    @Query('answer_0') newCarLife: string,
    @Res() response: Response,
  ) {
    try {
      const res = await this.checkListService.checkCarLifeMoreThanLast(
        driverId,
        newCarLife,
      );
      response.status(res.status).json({ data: res.data });
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }

  @Get('/api/checklist/dailycheck/count')
  async checkListDailyCount(
    @Query('date') date: string,
    @Query('done') done: string,
    @Query('zone') zone: string,
    @Query('company') company: string,
    @Res() response: Response,
  ) {
    try {
      const res = await this.checkListService.dailyCheckCount(date, done, zone , company);
      response
        .status(res.status)
        .json({ data: res.data, message: res.message});
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }
  

  // @Get('/api/checklist/dailycheck/count/test')
  // async checkListDailyCountTest(
  //   @Query('date') date: string,
  //   @Query('done') done: string,
  //   @Query('zone') zone: string,
  //   @Query('company') company: string,
  //   @Res() response: Response,
  // ) {
  //   try {
  //     const res = await this.checkListService.dailyCheckCountTest(date, done, zone , company);
  //     response
  //       .status(res.status)
  //       .json({ data: res.data, message: res.message , count : res.count});
  //   } catch (err) {
  //     console.log(err);
  //     response.status(500).json(err);
  //   }
  // }



  @Get('/api/checklist/export')
  async exportReportLogisticAdmin(
    @Res() response: Response,
    @Query('beforeHistory') beforeHistory: string,
    @Query('afterHistory') afterHistory: string,
    @Query('zone') zone: string,
    @Query('done') done: string,
    @Query('company') company: string,
  ) {
    try {
      const exportExcel = await this.checkListService.exportReport(
        beforeHistory,
        afterHistory,
        zone,
        done,
        company,
      );
      response.setHeader(
        'Content-Disposition',
        'attachment; filename="checklist-export.xlsx"',
      );
      response.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      response.send(exportExcel);
    } catch (err) {
      console.log(err);
    }
  }
  @Get('/api/checklist/:driverId')
  async getAllCheckList(
    @Param('driverId') driverId: number,
    @Query('beforHistory') beforHistory: string,
    @Query('afterHistory') afterHistory: string,

    @Res() response: Response,
  ) {
    try {
      const res = await this.checkListService.getllByDriverId(
        driverId,
        beforHistory,
        afterHistory,
      );
      response
        .status(res.status)
        .json({ data: res.data, message: res.message });
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }

  @Get('/api/checklist/answers/:id')
  async getAnswers(@Param('id') id: number, @Res() response: Response) {
    try {
      const res = await this.checkListService.getAnswers(id);
      response
        .status(res.status)
        .json({ data: res.data, message: res.message });
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }

  @Post('/api/checklist')
  async insertCheckListDriver(@Body() body: any, @Res() response: Response) {
    try {
      const res = await this.checkListService.insertCheckList(body);
      response.status(res.status).json(res.message);
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }

  @Delete('/api/checklist/:id')
  async removeCheckList(@Param('id') id: number, @Res() response: Response) {
    try {
      const res = await this.checkListService.removeCheckList(id);
      response.status(res.status).json(res.message);
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }
}
