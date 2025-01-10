import { Controller,Post,Get,Res,Body } from "@nestjs/common";
import { StockService } from "../services/stock.service";
import { InsertStockDto } from "../dto/insertStock.dto";
import { Response } from "express";

@Controller()
export class StockController{
  constructor(private readonly stockService:StockService){}

  @Post('/api/addrecieveStock')
  async addRecieveStock(@Body() body:InsertStockDto,@Res() response:Response){
  try{
   const addRecieveStock=await this.stockService.insertStockReciever(body.RecieveName);
   response.status(addRecieveStock.status).json(addRecieveStock.message)
  }catch(err){
   response.status(500).json('internal server error')
  }
}


}