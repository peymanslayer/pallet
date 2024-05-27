import { IsEmail, IsNotEmpty } from 'class-validator';

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
}
