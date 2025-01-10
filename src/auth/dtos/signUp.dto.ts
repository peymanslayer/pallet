import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { CarNumberPartsDto } from 'src/truck-info/dto/truck-info.insert.dto';

export class SignUpDto {
  email: string;

  @IsNotEmpty()
  password: string;

  name: string;

  @IsNotEmpty()
  role: string;

  @IsNotEmpty()
  mobile: string;

  @IsNotEmpty()
  personelCode: string;

  shopCode: number;

  subscriber: string;

  zone: string;

  @IsObject()
  @ValidateNested()
  @Type(() => CarNumberPartsDto)
  carNumber: CarNumberPartsDto;


  type: string; //TODO : change name field to "typeTruck" and check not lost data
}
