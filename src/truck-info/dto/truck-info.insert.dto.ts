import { Type } from "class-transformer";
import { IsNumber, IsObject, IsString, ValidateNested } from "class-validator";


export class TruckInfoInsertDto {
  @IsNumber()
  driverId: number;

  carNumber: string;

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
