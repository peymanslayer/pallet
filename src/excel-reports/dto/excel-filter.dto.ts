import { IsArray, IsDateString, IsOptional, IsString } from "class-validator";

export class ExcelFilterDto {
    @IsOptional()
    @IsArray({ message: 'نام راننده باید یک آرایه باشد.' })
    @IsString({ each: true, message: 'هر مقدار در نام راننده باید از نوع رشته باشد.' })
    driverNames?: string[];

    @IsOptional()
    @IsArray({ message: 'نام شرکت باید یک آرایه باشد.' })
    @IsString({ each: true, message: 'هر مقدار در نام شرکت باید از نوع رشته باشد.' })
    companies?: string[];

    @IsOptional()
    @IsArray({ message: 'نام منطقه باید یک آرایه باشد.' })
    @IsString({ each: true, message: 'هر مقدار در نام منطقه باید از نوع رشته باشد.' })
    zones?: string[];

    @IsOptional()
    @IsArray({ message: 'پلاک باید یک آرایه باشد.' })
    @IsString({ each: true, message: 'هر مقدار در پلاک باید از نوع رشته باشد.' })
    carNumbers?: string[];
    
    @IsOptional()
    @IsDateString()
    startDate?: Date;
    
    
    @IsOptional()
    @IsDateString()
    endDate?: Date;
    
    @IsOptional()
    @IsArray({ message: 'نام قطعه باید یک آرایه باشد.' })
    @IsString({ each: true, message: 'هر مقدار در نام قطعه باید از نوع رشته باشد.' })
    pieces?: string[]


    @IsOptional()
    @IsArray({ message: 'نوع سرویس دوره ای باید یک آرایه باشد.' })
    @IsString({ each: true, message: 'هر مقدار در نوع سرویس دوره ای باید از نوع رشته باشد.' })
    types?: string[]
}