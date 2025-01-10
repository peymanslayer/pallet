import { ApiProperty } from '@nestjs/swagger';

export class InsertTruckBreakDownSuccessResponse {
  @ApiProperty({ example: 201 })
  status: number;

  @ApiProperty({ example: 'گزارش خرابی کامیاب ثبت شد.' })
  message: string;
}


export class ActiveBreakDownErrorResponse {
    @ApiProperty({ example: 200 })
    status: number;
  
    @ApiProperty({
      example: 'شما در حال حاضر یک خرابی در دست انجام دارید. لطفاً آن را تکمیل کنید.',
    })
    message: string;
  }

  
  export class NoCheckListErrorResponse {
    @ApiProperty({ example: 400 })
    status: number;
  
    @ApiProperty({ example: 'شما هنوز چک لیستی ثبت نکردید' })
    message: string;
  }
  

