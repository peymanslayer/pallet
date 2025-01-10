import { IsNotEmpty, IsArray, IsString, IsDate } from 'class-validator';

export class AutoAdd {
    @IsNotEmpty()
    @IsArray() 
    @IsString({ each: true })
    types: string[]; 

    @IsDate() 
    endDate: Date;  
}