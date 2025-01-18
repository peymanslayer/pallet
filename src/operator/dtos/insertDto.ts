import { Type } from "class-transformer";
import { IsObject, ValidateNested } from "class-validator";

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
  carNumber: string; // not used just aim integrate with model auth
  type: string; // not used just aim integrate with model auth
  carNumberCombined: string
}
