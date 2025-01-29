// type check = {
//   answer: string;
//   comment: string;
// };

// export class InsertCheckListDto {
//   answer_1: string;
//   answer_2: string;
//   answer_3: string;
//   answer_4: string;
//   answer_5: string;
//   answer_6: string;
//   answer_7: string;
//   answer_8: string;
//   answer_9: string;
//   answer_10: string;
//   answer_11: string;
//   answer_12: string;
//   answer_13: string;
//   answer_14: string;
//   answer_15: string;
//   answer_16: string;
//   answer_17: string;
//   answer_18: string;
//   answer_19: string;
//   answer_20: string;
//   answer_21: string;
// }


import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCheckListDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  truckId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  hours: string;

  @IsArray()
  @IsNotEmpty()
  answers: string[];
}

export class CheckKilometerDto {
    @IsNotEmpty()
    @IsNumber()
    kilometer: number;
  
    @IsNotEmpty()
    @IsNumber()
    userId: number;
  
    @IsNotEmpty()
    @IsNumber()
    truckId: number;
  }