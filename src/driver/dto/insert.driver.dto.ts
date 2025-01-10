import { IsNotEmpty,IsNumber,IsString } from "class-validator";

export class InsertDriverDto{
 @IsNotEmpty()
 @IsString()
 driverName:string


}