import { IsNotEmpty } from "class-validator";

export class InsertStockDto{
 @IsNotEmpty()
 RecieveName:string
}