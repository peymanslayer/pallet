import { Module } from "@nestjs/common";
import { StockController } from "./controller/controller";
import { StockService } from "./services/stock.service";
import { StockProviders } from "./stock.provider";

@Module({
 imports:[],
 controllers:[StockController],
 providers:[StockService,...StockProviders],
 exports:[StockService]
})

export class StockModule{}
