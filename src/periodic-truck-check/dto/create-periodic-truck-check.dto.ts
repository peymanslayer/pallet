import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PeriodicTruckCheckType } from 'src/common/enum';

// CHK: #DTO checked and pass
export class CreatePeriodicTruckCheckDto {
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @IsNumber()
  @IsOptional()
  endKilometer?: number;

  @IsString()
  type: PeriodicTruckCheckType;

  @IsNumber()
  truckInfoId: number; // relation field
}

// @Type(() => Date)
// @IsDate()
// @IsOptional()
// technicalInspectionEndDate?: Date;

// @IsNumber()
// @IsOptional()
// technicalInspectionEndKilometer?: number;

// @IsNumber()
// @IsOptional()
// tireEndKilometer?: number;

// @Type(() => Date)
// @IsDate()
// @IsOptional()
// tireEndDate?: Date;

// @Type(() => Date)
// @IsDate()
// @IsOptional()
// sparkPlugEndDate?: Date;

// @IsNumber()
// @IsOptional()
// sparkPlugEndKilometer?: number;

// @IsNumber()
// @IsOptional()
// padEndKilometer?: number;

// @Type(() => Date)
// @IsDate()
// @IsOptional()
// padEndDate?: Date;

// @IsNumber()
// @IsOptional()
// gearboxOilEndKilometer?: number;

// @Type(() => Date)
// @IsDate()
// @IsOptional()
// gearboxOilEndDate?: Date;

// @IsNumber()
// @IsOptional()
// brakeDiscEndKilometer?: number;

// @Type(() => Date)
// @IsDate()
// @IsOptional()
// brakeDiscEndDate?: Date;

// @IsNumber()
// @IsOptional()
// beltEndKilometer?: number;

// @Type(() => Date)
// @IsDate()
// @IsOptional()
// beltEndDate?: Date;

// @Type(() => Date)
// @IsDate()
// @IsOptional()
// clutchEndDate?: Date;

// @IsNumber()
// @IsOptional()
// clutchEndKilometer?: number;

// @Type(() => Date)
// @IsDate()
// @IsOptional()
// padBowlEndDate?: Date;

// @IsNumber()
// @IsOptional()
// padBowlEndKilometer?: number;
