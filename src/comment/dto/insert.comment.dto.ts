<<<<<<< HEAD
import { IsNotEmpty,IsNumber,IsString } from "class-validator";

export class InsertCommentDto{
 @IsNotEmpty()
 @IsString()
 comment:string

 @IsNotEmpty()
 @IsNumber()
 shopId:number
=======
import { IsNotEmpty,IsNumber,IsString } from "class-validator";

export class InsertCommentDto{
 @IsNotEmpty()
 @IsString()
 comment:string

 @IsNotEmpty()
 @IsNumber()
 shopId:number
>>>>>>> 06d6f4c440da2b182c6703835946f16d97950290
}