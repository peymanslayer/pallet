import { ApiProperty } from '@nestjs/swagger';

export class CheckListResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  history: string;

  @ApiProperty()
  hours: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: Number })
  answer_0: number;
  @ApiProperty({ type: String })
  answer_1: string;
  @ApiProperty({ type: String })
  answer_2: string;
  @ApiProperty({ type: String })
  answer_3: string;
  @ApiProperty({ type: String })
  answer_4: string;
  @ApiProperty({ type: String })
  answer_5: string;
  @ApiProperty({ type: String })
  answer_6: string;
  @ApiProperty({ type: String })
  answer_7: string;
  @ApiProperty({ type: String })
  answer_8: string;
  @ApiProperty({ type: String })
  answer_9: string;
  @ApiProperty({ type: String })
  answer_10: string;
  @ApiProperty({ type: String })
  answer_11: string;
  @ApiProperty({ type: String })
  answer_12: string;
  @ApiProperty({ type: String })
  answer_13: string;
  @ApiProperty({ type: String })
  answer_14: string;
  @ApiProperty({ type: String })
  answer_15: string;
  @ApiProperty({ type: String })
  answer_16: string;
  @ApiProperty({ type: String })
  answer_17: string;
  @ApiProperty({ type: String })
  answer_18: string;
  @ApiProperty({ type: String })
  answer_19: string;
  @ApiProperty({ type: String })
  answer_20: string;
}


export class ApiResponse<T> {
    @ApiProperty()
    status: number;
  
    @ApiProperty()
    message: string;
  
    @ApiProperty({ isArray: true, type: CheckListResponse })
    data: T[];
}
  



export class SuccessResponse {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'ok!' })
  message: string;
}

export class KilometerErrorResponse {
    @ApiProperty({ example: 200 })
    status: number;
  
    @ApiProperty({ example: [] })
    data: any[];
  
    @ApiProperty({
      example: 'مقدار کیلومتر جاری باید حداقل ۵۰ واحد بیشتر از مقدار آخرین رکورد باشد',
    })
    message: string;
}


export class InsertCheckListSuccessResponse {
    @ApiProperty({ example: 201 })
    status: number;
  
    @ApiProperty({ example: 'چک‌لیست با موفقیت ثبت شد' })
    message: string;
}

export class InsertCheckListErrorResponse {
    @ApiProperty({ example: 200 })
    status: number;
  
    @ApiProperty({ example: [] })
    data: any[];
  
    @ApiProperty({
      example: 'مقدار کیلومتر جاری باید حداقل ۵۰ واحد بیشتر از مقدار آخرین رکورد باشد',
    })
    message: string;
  }
  
  

