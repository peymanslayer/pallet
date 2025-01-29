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
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enum';
import { CheckListResponse, InsertCheckListErrorResponse, InsertCheckListSuccessResponse, KilometerErrorResponse, SuccessResponse } from './interface/response';
import { CheckKilometerDto, CreateCheckListDto } from './dto/inser.checkList.tDto';

@ApiTags('CheckLists')
@Controller()
export class CheckListController {
  constructor(private readonly checkListService: CheckListService) {}

  @Get('/api/checklist/dailycheck/')
  @ApiOperation({ summary: 'Get daily checklist for drivers' }) 
  @ApiQuery({ name: 'userId', required: false, type: Number, description: 'ID of the user' }) 
  @ApiQuery({ name: 'date', required: false, type: String, description: 'Date for the checklist' }) 
  @ApiQuery({ name: 'done', required: true, type: String, description: 'Filter by done status (true/false)' }) 
  @ApiQuery({ name: 'beforeHistory', required: false, type: String, description: 'Filter by history before this date' }) 
  @ApiQuery({ name: 'afterHistory', required: false, type: String, description: 'Filter by history after this date' }) 
  @ApiQuery({ name: 'zone', required: false, type: String, description: 'Zone of the drivers' })
  @ApiQuery({ name: 'company', required: false, type: String, description: 'Company of the drivers' }) 
  @ApiQuery({ name: 'isDeleted', required: false, type: Boolean, description: 'Filter by deletion status' }) 
  @ApiResponse({ status: 200, description: 'Successful retrieval of daily checklist.', type: Object }) 
  @ApiResponse({ status: 500, description: 'Internal server error.' })
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
  @ApiOperation({ summary: 'Get total kilometer of checklist by car number' })
  @ApiParam({ name: 'carNumber', required: true, description: 'The car number to retrieve the total kilometer' }) 
  @ApiResponse({ status: 200, description: 'Total kilometer retrieved successfully.', type: Object }) 
  @ApiResponse({ status: 201, description: 'answer_0 not found.' }) 
  async getTotalKilometerByCarNumber(@Param('carNumber') carNumber: string , @Res() response: Response){
    const res = await this.checkListService.getTotalKilometerOfChecklist(carNumber)
    response
        .status(res.status)
        .json({ data: res.data, message: res.message});
  }


  @Get('/api/checklist/dailycheck/count')
  @ApiOperation({ summary: 'Get daily checklist count' })
  @ApiQuery({ name: 'date', required: false, type: String, description: 'Date for the checklist' }) 
  @ApiQuery({ name: 'done', required: true, type: String, description: 'Filter by done status (true/false)' }) 
  @ApiQuery({ name: 'zone', required: false, type: String, description: 'Zone of the drivers' }) 
  @ApiQuery({ name: 'company', required: false, type: String, description: 'Company of the drivers' }) 
  @ApiResponse({ status: 200, description: 'Successfully retrieved checklist count.', type: Object }) 
  @ApiResponse({ status: 500, description: 'Internal server error.' })
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
  @ApiOperation({ summary: 'Get answers for a specific checklist by ID' }) 
  @ApiParam({ name: 'id', required: true, description: 'ID of the checklist to retrieve answers for', type: Number }) 
  @ApiResponse({ status: 200, description: 'Successfully retrieved answers.', type: Object }) 
  @ApiResponse({ status: 404, description: 'Checklist not found.' }) 
  @ApiResponse({ status: 500, description: 'Internal server error.' })
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



  @Get('/api/checklist/checkTodayChecklist/:userId/:truckId')
  @ApiOperation({ summary: 'بررسی اینکه آیا چک‌لیست امروز ثبت شده است' }) 
  @ApiParam({ name: 'userId', required: true, description: 'شناسه کاربر' })
  @ApiParam({ name: 'truckId', required: true, description: 'شناسه کامیون' }) 
  @ApiResponse({ status: 200, description: 'چک‌لیست امروز قبلاً ثبت شده است.', type: Object })
  @ApiResponse({ status: 201, description: 'مجاز برای ثبت چک‌لیست امروز.', type: Object })
  @ApiResponse({ status: 500, description: 'خطای داخلی سرور.' })
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
  @ApiConsumes('application/json', 'application/x-www-form-urlencoded') 
  @ApiOperation({ summary: 'ثبت یک چک‌لیست جدید' }) 
  @ApiBody({ type: CreateCheckListDto }) 
  @ApiResponse({
    status: 201,
    description: 'چک‌لیست با موفقیت ثبت شد',
    type: InsertCheckListSuccessResponse,
  })
  @ApiResponse({
    status: 200,
    description: 'مقدار کیلومتر نامعتبر است',
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
  @ApiOperation({ summary: 'حذف تمام چک‌لیست‌ها' })
  @ApiResponse({ status: 200, description: 'چک‌لیست‌ها با موفقیت حذف شدند.' }) 
  @ApiResponse({ status: 500, description: 'خطای داخلی سرور.' })
  @ApiResponse({ status: 400, description: 'درخواست نامعتبر است.' }) 
  @ApiResponse({ status: 404, description: 'چک‌لیستی برای حذف یافت نشد.' }) 
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
  @ApiOperation({ summary: 'Remove a checklist by ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the checklist to remove' })
  @ApiResponse({ status: 200, description: 'CheckList removed successfully' })
  @ApiResponse({ status: 201, description: 'شما فقط قادر به حذف چک لیست امروز هستید' })
  @ApiResponse({ status: 404, description: 'چک لیست یافت نشد' })
  @ApiResponse({ status: 500, description: 'An error occurred while removing the checklist' })
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
  @ApiConsumes('application/json', 'application/x-www-form-urlencoded') 
  @ApiBody({ type: CheckKilometerDto })
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
  async checkKilometer(@Body() body: Object, @Res() response: Response){
    const checkedKilometer= await this.checkListService.checkKilometer(body);
    response.status(checkedKilometer.status).json(checkedKilometer.message);
  }

  // @Get('checkNumberOfCheckList/:id')
  // async numberOfCheckList(@Param('id') id: number, @Res() response: Response){
  //   try{
  //     const numberOfCheckList=await this.checkListService.checkNumberOfCheckList(id);
  //     response.status(numberOfCheckList.status).json(numberOfCheckList.message);
  //   }catch(err){
  //     console.log(err);
      
  //     response.status(500).json("ارور سرور")
  //   }
  // }
  @Get('/api/checkNumberOfCheckList')
  @ApiOperation({ summary: 'Get the number of missed workdays for a user' })
  @ApiQuery({ name: 'userId', required: true, description: 'ID of the user to check missed workdays' })
  @ApiResponse({
    status: 200,
    description: 'تعداد روزهای کاری که چک‌لیست ثبت نشده است',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        message: { type: 'string', example: 'تعداد روزهای کاری که چک‌لیست ثبت نشده است: 3' },
        missedDays: { type: 'number', example: 3 },
      },
    },
  })
  async getMissedWorkDays(@Query('userId') userId: number): Promise<any> {
    const today = new Date();
    const formattedToday = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;

    const missedDays = await this.checkListService.calculateMissedCheckListDays(userId, formattedToday);

    return {
      status: 200,
      message: `تعداد روزهای کاری که چک‌لیست ثبت نشده است: ${missedDays}`,
      missedDays,
    };
  }
}
