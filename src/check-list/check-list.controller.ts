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
import { ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enum';
import { CheckListResponse, InsertCheckListErrorResponse, InsertCheckListSuccessResponse, KilometerErrorResponse, SuccessResponse } from './interface/response';

@ApiTags('CheckLists')
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
    @Query('isDeleted') isDeleted: boolean,
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
        isDeleted
      );
      response
        .status(res.status)
        .json({ data: res.data, message: res.message });
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

  @Get('/api/checklist/:carNumber')
  async getTotalKilometerByCarNumber(@Param('carNumber') carNumber: string , @Res() response: Response){
    const res = await this.checkListService.getTotalKilometerOfChecklist(carNumber)
    response
        .status(res.status)
        .json({ data: res.data, message: res.message});
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
      const res = await this.checkListService.dailyCheckCount(
        date,
        done,
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
    @Query('isDeleted') isDeleted: boolean,
  ) {
    try {
      const exportExcel = await this.checkListService.exportReport(
        beforeHistory,
        afterHistory,
        zone,
        done,
        company,
        isDeleted
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
  @Get('/api/checklist/All/:driverId')
  @ApiConsumes(SwaggerConsumes.Urlencoded, SwaggerConsumes.Json)
  @ApiOperation({ summary: 'Get all checklists for a driver' })
  @ApiResponse({
    status: 404,
    description: 'User or checklists not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiQuery({
    name: 'beforHistory',
    required: false, 
    type: String,
    description: 'تاریخ شروع (اختیاری)',
  })
  @ApiQuery({
    name: 'afterHistory',
    required: false, 
    type: String,
    description: 'تاریخ پایان (اختیاری)',
  })
  async getAllCheckList(
    @Param('driverId') driverId: number,
    @Res() response: Response,
    @Query('beforHistory') beforHistory?: string,
    @Query('afterHistory') afterHistory?: string,

  ) {
    try {
      console.log('poo');
      
      const res = await this.checkListService.getAllByDriverId(
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



  @Get('/api/checklist/checkTodayChecklist/:id')
  async checkTodayChecklist(@Param('userId') userId: number , @Param('truckId') truckId: number , @Res() response: Response){
    try {
      const res = await this.checkListService.checkTodayChecklist(userId , truckId);
      response.status(res.status).json({ data: res.date , message: res.message });
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }


  @Post('/api/checklist')
  @ApiConsumes(SwaggerConsumes.Urlencoded, SwaggerConsumes.Json)
  @ApiOperation({ summary: 'Insert a new checklist' })
  @ApiResponse({
    status: 201,
    description: 'Checklist successfully inserted',
    type: InsertCheckListSuccessResponse,
  })
  @ApiResponse({
    status: 200,
    description: 'Invalid kilometer value',
    type: InsertCheckListErrorResponse,
  })
  async insertCheckListDriver(@Body() body: any, @Res() response: Response) {
    try {
      const res = await this.checkListService.insertCheckList(body);
      response.status(res.status).json( res.message);
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }

  @Delete('/api/checklist/all')
  async removeAllCheckLists(@Res() response: Response) {
    try {
      const res = await this.checkListService.removeAllCheckLists();
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

  @Post('/api/checkKilometer')
  @ApiConsumes(SwaggerConsumes.Urlencoded, SwaggerConsumes.Json)
  @ApiOperation({ summary: 'Check the kilometer value' })
  @ApiResponse({
    status: 200,
    description: 'Kilometer value is valid',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 200,
    description:
      'Kilometer value does not meet the required conditions for validation',
    type: KilometerErrorResponse,
  })
  async checkKilometer(@Body() body: any, @Res() response: Response){
    const checkedKilometer= await this.checkListService.checkKilometer(body);
    response.status(checkedKilometer.status).json(checkedKilometer.message);
  }

  @Get('checkNumberOfCheckList/:id')
  async numberOfCheckList(@Param('id') id: number, @Res() response: Response){
    try{
      const numberOfCheckList=await this.checkListService.checkNumberOfCheckList(id);
      response.status(numberOfCheckList.status).json(numberOfCheckList.message);
    }catch(err){
      console.log(err);
      
      response.status(500).json("ارور سرور")
    }
  }
}
