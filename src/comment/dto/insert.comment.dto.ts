import { IsNotEmpty,IsNumber,IsString } from "class-validator";

export class InsertCommentDto{
 @IsNotEmpty()
 @IsString()
 comment:string

 @IsNotEmpty()
 @IsNumber()
 shopId:number
}