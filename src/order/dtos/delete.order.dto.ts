import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DeleteOrderDto{
 @IsNotEmpty()
 @IsNumber()
 id:number;

 @IsNotEmpty()
 @IsString()
 comment:string;

 @IsNotEmpty()
 @IsNumber()
 userId:number

 @IsNotEmpty()
 deletedAt:Date
}