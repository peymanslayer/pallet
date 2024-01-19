import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { OperatorShopService } from "../services/operatorShop.service";
import { InsertOperatorShopDto } from "../dtos/insert.operatorShop";
import { Response } from "express";
import { FindAllOperatorShopById } from "../dtos/findAllOperatorById";

@Controller()
export class OperatorShopController{
 constructor(private readonly operatorShopService:OperatorShopService){}

 @Post('/api/insertOperatorShop')
 async insertOperatorShop(@Body() body:InsertOperatorShopDto,@Res() response:Response){
  try{
    const insertOperatorShop= await this.operatorShopService.insertOperatorShop(body);
    response.status(insertOperatorShop.status).json(insertOperatorShop.message)
  }catch(err){
    console.log(err);
    
    response.status(500).json('internal server error')
  }
 }

 @Get('/api/ExportExcelOfOperator')
async ExportExcelOfOperator(@Req() body:any,@Res() response: Response){
 try{
 const ExportExcelOfOperator=await this.operatorShopService.exportExcelOfOperator(body.query);
 response.setHeader('Content-Disposition', 'attachment; filename="exported-data.xlsx"');
 response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
 response.send(ExportExcelOfOperator)
 }catch(err){
 response.status(500).json('internal server error')
 }
}


@Post('/api/findAllOperatorShopById')
async findAllOperatorShopById(@Body() body:FindAllOperatorShopById,@Res() response: Response){
 try{
  const findAllOperatorShopById=await this.operatorShopService.findAllOperatorShopById(body);
  response.status(findAllOperatorShopById.status).json(findAllOperatorShopById.message)
 }catch(err){
  response.status(500).json('internal server error')
 }
}

@Post('/api/getOperatorShopOrderById')
async getOperatorShopOrderById(@Body() body:FindAllOperatorShopById,@Res() response: Response){
  try{
    const getOperatorShopOrderById=await this.operatorShopService.getOperatorShopOrderById(body.id);
    response.status(getOperatorShopOrderById.status).json(getOperatorShopOrderById.message)
  }catch(err){
    response.status(500).json('internal server error')
  }

}
}