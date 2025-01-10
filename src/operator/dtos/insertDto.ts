import { Type } from "class-transformer";
import { IsObject, ValidateNested } from "class-validator";
import { CarNumberPartsDto } from "src/truck-info/dto/truck-info.insert.dto";

export class InsertOperatorDto {
  name: string;
  password: string;
  email: string;
  originalPassword: string;
  shopCode: number;
  personelCode: string;
  mobile: string;
  role: string;
  userId: number;
  subscriber: string;
  zone: string;
  @IsObject()
  @ValidateNested()
  @Type(() => CarNumberPartsDto)
  carNumber: CarNumberPartsDto; // not used just aim integrate with model auth
  type: string; // not used just aim integrate with model auth
  carNumberCombined: string
}
