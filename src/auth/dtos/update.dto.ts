import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateDto{
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  name:string
  
  @IsNotEmpty()
  role:string

  @IsNotEmpty()
  mobile:string

  @IsNotEmpty()
  personelCode:string

  @IsNotEmpty()
  shopCode:number

  @IsNotEmpty()
  id:number

}
