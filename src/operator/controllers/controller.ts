import { Body, Controller, Post, Res } from '@nestjs/common';
import { OperatorService } from '../services/operator.service';
import { InsertOperatorDto } from '../dtos/insertDto';
import { Response } from 'express';
import { FindDto } from '../dtos/findDto';
@Controller()
export class OperatorController {
  constructor(private readonly operatorService: OperatorService) {}

  @Post('/api/signUpOperator')
  async signUpOperator(
    @Body() body: InsertOperatorDto,
    @Res() response: Response,
  ) {
    try {
      const signUpOperator = await this.operatorService.insertOperator(body);
      response.status(signUpOperator.status).json(signUpOperator.message);
    } catch (err) {
      console.log(err);

      response.status(500).json('internal server error');
    }
  }

  @Post('/api/getOperatorByName')
  async getOperatorByName(
    @Body() body: InsertOperatorDto,
    @Res() response: Response,
  ) {
    try {
      const getOperatorByName = await this.operatorService.findOneOperator(
        body.name,
      );
      response.status(getOperatorByName.status).json(getOperatorByName.message);
    } catch (err) {
      response.status(500).json('internal server error');
    }
  }

  @Post('/api/findOneOperatorWithAssociaton')
  async findOneOperatorWithAssociaton(
    @Body() body: FindDto,
    @Res() response: Response,
  ) {
    try {
      const findOneOperatorWithAssociaton =
        await this.operatorService.findOneOperatorWithAssociaton(body.id);
      response
        .status(findOneOperatorWithAssociaton.status)
        .json(findOneOperatorWithAssociaton.message);
    } catch (err) {
      response.status(500).json('internal server error');
    }
  }
}
