import { IsDate, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
// CHK: #DTO checked and pass
export class CreatePeriodicTruckCheckDto {
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  engineOilEndDate?: Date;

  @IsNumber()
  @IsOptional()
  engineOilEndKilometer?: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  technicalInspectionEndDate?: Date;

  @IsNumber()
  @IsOptional()
  technicalInspectionEndKilometer?: number;

  @IsNumber()
  @IsOptional()
  tireEndKilometer?: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  tireEndDate?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  sparkPlugEndDate?: Date;

  @IsNumber()
  @IsOptional()
  sparkPlugEndKilometer?: number;

  @IsNumber()
  @IsOptional()
  padEndKilometer?: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  padEndDate?: Date;

  @IsNumber()
  @IsOptional()
  gearboxOilEndKilometer?: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  gearboxOilEndDate?: Date;

  @IsNumber()
  @IsOptional()
  brakeDiscEndKilometer?: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  brakeDiscEndDate?: Date;

  @IsNumber()
  @IsOptional()
  beltEndKilometer?: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  beltEndDate?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  clutchEndDate?: Date;

  @IsNumber()
  @IsOptional()
  clutchEndKilometer?: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  padBowlEndDate?: Date;

  @IsNumber()
  @IsOptional()
  padBowlEndKilometer?: number;

  @IsNumber()
  truckInfoId: number; // relation field
}
