import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { CheckListService } from './check-list.service';
import { Response } from 'express';

@Controller()
export class CheckListController {
  constructor(private readonly checkListService: CheckListService) {}

  @Get('/api/checklist/:driverId')
  async getAllCheckList(
    @Param('driverId') driverId: number,
    @Res() response: Response,
  ) {
    try {
      const res = await this.checkListService.getllByDriverId(driverId);
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
