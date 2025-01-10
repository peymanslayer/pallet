import { ApiProperty } from '@nestjs/swagger';

export class AnswerDto {
  @ApiProperty({ description: 'Number of the answer' })
  number: number;

  @ApiProperty({ description: 'The answer to the question' })
  question: string;

  @ApiProperty({ description: 'Additional comment for the answer', required: false })
  comment?: string;

  @ApiProperty({ description: 'Type of the answer', required: false })
  type?: string;
}

export class InsertCheckListDto {
  @ApiProperty({ description: 'User ID' })
  id: number;

  @ApiProperty({ description: 'Truck ID' })
  truckId: number;

  @ApiProperty({ description: 'Driver name' })
  name: string;

  @ApiProperty({ description: 'Driver mobile number' })
  mobile: string;

  @ApiProperty({ description: 'The hours of the checklist' })
  hours: string;

  @ApiProperty({ description: 'Date of the checklist' })
  date: string;

  @ApiProperty({ description: 'List of answers', type: [AnswerDto] })
  answers: AnswerDto[];
}
