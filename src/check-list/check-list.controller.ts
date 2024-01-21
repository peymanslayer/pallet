import { Body, Controller, Post, Res } from '@nestjs/common';
import { CheckListService } from './check-list.service';
import { Response } from 'express';

@Controller()
export class CheckListController {
  constructor(private readonly checkListService: CheckListService) {}

  @Post('/api/checklist')
  async generateDriverCode(@Body() body: any, @Res() response: Response) {
    try {
      const res = await this.checkListService.insertCheckList(body);
      response.status(res.status).json(res.message);
    } catch (err) {
      console.log(err);
      response.status(500).json(err);
    }
  }
}
