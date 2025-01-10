import { Inject, Injectable } from "@nestjs/common";
import { Stock } from "../stock.entity";

@Injectable()

export class StockService{
 constructor(@Inject('STOCK_REPOSITORY') private readonly stockRepository:typeof Stock ){}

 async insertStockReciever(RecieveName:string){
  const insertStockReciever=await this.stockRepository.create({RecieveName:RecieveName});
  return{
    status:200,
    message:insertStockReciever
  }
 }
}