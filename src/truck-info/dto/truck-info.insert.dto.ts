import { Type } from "class-transformer";
import { IsNumber, IsObject, IsString, ValidateNested } from "class-validator";

export class CarNumberPartsDto {
  @IsNumber()
  firstPart: number;

  @IsNumber()
  secondPart: number;

  @IsNumber()
  thirdPart: number;

  @IsNumber()
  fourthPart: number;
}


export class TruckInfoInsertDto {
  @IsNumber()
  driverId: number;

  @IsObject()
  @ValidateNested()
  @Type(() => CarNumberPartsDto)
  carNumber: CarNumberPartsDto;

  type: string;

  state: string

  zone: string
}


export class TruckInfoDto {
  @IsNumber()
  driverId: number;


  @IsString()
  carNumber: string;

  @IsString()
  type: string;

  @IsString()
  state: string

  @IsString()
  zone: string
}
