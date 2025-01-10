import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger'; // برای استفاده از دکوریتورهای Swagger
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';

@Table
export class TruckBreakDownItems extends Model<TruckBreakDownItems> {
  
  @HasMany(() => TruckBreakDown)
  truckBreakDowns: TruckBreakDown[];

  @ApiProperty({ description: 'Answer to question 1' })
  @Column({ type: DataType.TEXT })
  answer_1: string;

  @ApiProperty({ description: 'Type of answer for question 1' })
  @Column({ type: DataType.TEXT })
  type_1: string;

  @ApiProperty({ description: 'Question 1, e.g., "Fuel system"', default: 'سیستم سوخت رسانی' })
  @Column({ type: DataType.TEXT, defaultValue: 'سیستم سوخت رسانی' })
  question_1: string;

  @ApiProperty({ description: 'Answer to question 2' })
  @Column({ type: DataType.TEXT })
  answer_2: string;

  @ApiProperty({ description: 'Type of answer for question 2' })
  @Column({ type: DataType.TEXT })
  type_2: string;

  @ApiProperty({ description: 'Question 2, e.g., "Front and rear springs"', default: 'فنرهای جلو و عقب' })
  @Column({ type: DataType.TEXT, defaultValue: 'فنرهای جلو و عقب' })
  question_2: string;

  @ApiProperty({ description: 'Answer to question 3' })
  @Column({ type: DataType.TEXT })
  answer_3: string;

  @ApiProperty({ description: 'Type of answer for question 3' })
  @Column({ type: DataType.TEXT })
  type_3: string;

  @ApiProperty({ description: 'Question 3, e.g., "Oil service"', default: 'سرویس روغن' })
  @Column({ type: DataType.TEXT, defaultValue: 'سرویس روغن' })
  question_3: string;

  @ApiProperty({ description: 'Answer to question 4' })
  @Column({ type: DataType.TEXT })
  answer_4: string;

  @ApiProperty({ description: 'Type of answer for question 4' })
  @Column({ type: DataType.TEXT })
  type_4: string;

  @ApiProperty({ description: 'Question 4, e.g., "Suspension system"', default: 'جلوبندی' })
  @Column({ type: DataType.TEXT, defaultValue: 'جلوبندی' })
  question_4: string;

  @ApiProperty({ description: 'Answer to question 5' })
  @Column({ type: DataType.TEXT })
  answer_5: string;

  @ApiProperty({ description: 'Type of answer for question 5' })
  @Column({ type: DataType.TEXT })
  type_5: string;

  @ApiProperty({ description: 'Question 5, e.g., "Gearbox (disc plate)"', default: 'گیربکس (دیسک صفحه)' })
  @Column({ type: DataType.TEXT, defaultValue: 'گیربکس (دیسک صفحه)' })
  question_5: string;

  @ApiProperty({ description: 'Answer to question 6' })
  @Column({ type: DataType.TEXT })
  answer_6: string;

  @ApiProperty({ description: 'Type of answer for question 6' })
  @Column({ type: DataType.TEXT })
  type_6: string;

  @ApiProperty({ description: 'Question 6, e.g., "Engine"', default: 'موتور' })
  @Column({ type: DataType.TEXT, defaultValue: 'موتور' })
  question_6: string;

  @ApiProperty({ description: 'Answer to question 7' })
  @Column({ type: DataType.TEXT })
  answer_7: string;

  @ApiProperty({ description: 'Type of answer for question 7' })
  @Column({ type: DataType.TEXT })
  type_7: string;

  @ApiProperty({ description: 'Question 7, e.g., "Bodywork (painting)"', default: 'صافکاری - نقاشی' })
  @Column({ type: DataType.TEXT, defaultValue: 'صافکاری - نقاشی' })
  question_7: string;

  @ApiProperty({ description: 'Answer to question 8' })
  @Column({ type: DataType.TEXT })
  answer_8: string;

  @ApiProperty({ description: 'Type of answer for question 8' })
  @Column({ type: DataType.TEXT })
  type_8: string;

  @ApiProperty({ description: 'Question 8, e.g., "Advertising stickers"', default: 'استیکر تبلیغاتی' })
  @Column({ type: DataType.TEXT, defaultValue: 'استیکر تبلیغاتی' })
  question_8: string;

  @ApiProperty({ description: 'Answer to question 9' })
  @Column({ type: DataType.TEXT })
  answer_9: string;

  @ApiProperty({ description: 'Type of answer for question 9' })
  @Column({ type: DataType.TEXT })
  type_9: string;

  @ApiProperty({ description: 'Question 9, e.g., "Tires"', default: 'لاستیک' })
  @Column({ type: DataType.TEXT, defaultValue: 'لاستیک' })
  question_9: string;

  @ApiProperty({ description: 'Answer to question 10' })
  @Column({ type: DataType.TEXT })
  answer_10: string;

  @ApiProperty({ description: 'Type of answer for question 10' })
  @Column({ type: DataType.TEXT })
  type_10: string;

  @ApiProperty({ description: 'Question 10, e.g., "Wheel service (brakes, pads, etc.)"', default: 'سرویس های چرخ (ترمز - لنت و...)' })
  @Column({ type: DataType.TEXT, defaultValue: 'سرویس های چرخ (ترمز - لنت و...)' })
  question_10: string;

  @ApiProperty({ description: 'Answer to question 11' })
  @Column({ type: DataType.TEXT })
  answer_11: string;

  @ApiProperty({ description: 'Type of answer for question 11' })
  @Column({ type: DataType.TEXT })
  type_11: string;

  @ApiProperty({ description: 'Question 11, e.g., "Wiring and battery service"', default: 'سیم کشی - باطری سازی' })
  @Column({ type: DataType.TEXT, defaultValue: 'سیم کشی - باطری سازی' })
  question_11: string;

  @ApiProperty({ description: 'Answer to question 12' })
  @Column({ type: DataType.TEXT })
  answer_12: string;

  @ApiProperty({ description: 'Type of answer for question 12' })
  @Column({ type: DataType.TEXT })
  type_12: string;

  @ApiProperty({ description: 'Question 12, e.g., "Air conditioning (cooling system)"', default: 'کولر ( سیستم خنک کننده )' })
  @Column({ type: DataType.TEXT, defaultValue: 'کولر ( سیستم خنک کننده )' })
  question_12: string;

  @ApiProperty({ description: 'Answer to question 13' })
  @Column({ type: DataType.TEXT })
  answer_13: string;

  @ApiProperty({ description: 'Type of answer for question 13' })
  @Column({ type: DataType.TEXT })
  type_13: string;

  @ApiProperty({ description: 'Question 13, e.g., "Hydraulics"', default: 'هیدرولیک' })
  @Column({ type: DataType.TEXT, defaultValue: 'هیدرولیک' })
  question_13: string;

  @ApiProperty({ description: 'Answer to question 14' })
  @Column({ type: DataType.TEXT })
  answer_14: string;

  @ApiProperty({ description: 'Type of answer for question 14' })
  @Column({ type: DataType.TEXT })
  type_14: string;

  @ApiProperty({ description: 'Question 14, e.g., "ABS system"', default: 'سیستم (ABS)' })
  @Column({ type: DataType.TEXT, defaultValue: 'سیستم (ABS)' })
  question_14: string;

  @ApiProperty({ description: 'Answer to question 15' })
  @Column({ type: DataType.TEXT })
  answer_15: string;

  @ApiProperty({ description: 'Type of answer for question 15' })
  @Column({ type: DataType.TEXT })
  type_15: string;

  @ApiProperty({ description: 'Question 15, e.g., "Windows and lift system"', default: 'شیشه و بالابر' })
  @Column({ type: DataType.TEXT, defaultValue: 'شیشه و بالابر' })
  question_15: string;

  @ApiProperty({ description: 'Answer to question 16' })
  @Column({ type: DataType.TEXT })
  answer_16: string;

  @ApiProperty({ description: 'Type of answer for question 16' })
  @Column({ type: DataType.TEXT })
  type_16: string;

  @ApiProperty({ description: 'Question 16, e.g., "Differential"', default: 'دیفرانسیل' })
  @Column({ type: DataType.TEXT, defaultValue: 'دیفرانسیل' })
  question_16: string;

  @ApiProperty({ description: 'Answer to question 17' })
  @Column({ type: DataType.TEXT })
  answer_17: string;

  @ApiProperty({ description: 'Type of answer for question 17' })
  @Column({ type: DataType.TEXT })
  type_17: string;

  @ApiProperty({ description: 'Question 17, e.g., "Steering system"', default: 'سیستم فرمان' })
  @Column({ type: DataType.TEXT, defaultValue: 'سیستم فرمان' })
  question_17: string;

  @ApiProperty({ description: 'Answer to question 18' })
  @Column({ type: DataType.TEXT })
  answer_18: string;

  @ApiProperty({ description: 'Type of answer for question 18' })
  @Column({ type: DataType.TEXT })
  type_18: string;

  @ApiProperty({ description: 'Question 18, e.g., "Alternator"', default: 'آلترناتور' })
  @Column({ type: DataType.TEXT, defaultValue: 'آلترناتور' })
  question_18: string;

  @ApiProperty({ description: 'Answer to question 19' })
  @Column({ type: DataType.TEXT })
  answer_19: string;

  @ApiProperty({ description: 'Type of answer for question 19' })
  @Column({ type: DataType.TEXT })
  type_19: string;

  @ApiProperty({ description: 'Question 19, e.g., "Wheel alignment"', default: 'بالانس چرخ' })
  @Column({ type: DataType.TEXT, defaultValue: 'بالانس چرخ' })
  question_19: string;

  @ApiProperty({ description: 'Answer to question 20' })
  @Column({ type: DataType.TEXT })
  answer_20: string;

  @ApiProperty({ description: 'Type of answer for question 20' })
  @Column({ type: DataType.TEXT })
  type_20: string;

  @ApiProperty({ description: 'Question 20, e.g., "Tire pressure"', default: 'فشار لاستیک' })
  @Column({ type: DataType.TEXT, defaultValue: 'فشار لاستیک' })
  question_20: string;

  @ApiProperty({ description: 'Answer to question 21' })
  @Column({ type: DataType.TEXT })
  answer_21: string;

  @ApiProperty({ description: 'Type of answer for question 21' })
  @Column({ type: DataType.TEXT })
  type_21: string;

  @ApiProperty({ description: 'Question 21, e.g., "Oil pressure"', default: 'فشار روغن' })
  @Column({ type: DataType.TEXT, defaultValue: 'فشار روغن' })
  question_21: string;

  @ApiProperty({ description: 'Answer to question 22' })
  @Column({ type: DataType.TEXT })
  answer_22: string;

  @ApiProperty({ description: 'Type of answer for question 22' })
  @Column({ type: DataType.TEXT })
  type_22: string;

  @ApiProperty({ description: 'Question 22, e.g., "Braking system"', default: 'سیستم ترمز' })
  @Column({ type: DataType.TEXT, defaultValue: 'سیستم ترمز' })
  question_22: string;

  @ApiProperty({ description: 'Answer to question 23' })
  @Column({ type: DataType.TEXT })
  answer_23: string;

  @ApiProperty({ description: 'Type of answer for question 23' })
  @Column({ type: DataType.TEXT })
  type_23: string;

  @ApiProperty({ description: 'Question 23, e.g., "Fuel consumption"', default: 'مصرف سوخت' })
  @Column({ type: DataType.TEXT, defaultValue: 'مصرف سوخت' })
  question_23: string;

  @ApiProperty({ description: 'Answer to question 24' })
  @Column({ type: DataType.TEXT })
  answer_24: string;

  @ApiProperty({ description: 'Type of answer for question 24' })
  @Column({ type: DataType.TEXT })
  type_24: string;

  @ApiProperty({ description: 'Question 24, e.g., "Clutch system"', default: 'کلاچ' })
  @Column({ type: DataType.TEXT, defaultValue: 'کلاچ' })
  question_24: string;

  @ApiProperty({ description: 'Answer to question 25' })
  @Column({ type: DataType.TEXT })
  answer_25: string;

  @ApiProperty({ description: 'Type of answer for question 25' })
  @Column({ type: DataType.TEXT })
  type_25: string;

  @ApiProperty({ description: 'Question 25, e.g., "Lights and electrical system"', default: 'چراغ و سیستم برقی' })
  @Column({ type: DataType.TEXT, defaultValue: 'چراغ و سیستم برقی' })
  question_25: string;

  @ApiProperty({ description: 'Answer to question 26' })
  @Column({ type: DataType.TEXT })
  answer_26: string;

  @ApiProperty({ description: 'Type of answer for question 26' })
  @Column({ type: DataType.TEXT })
  type_26: string;

  @ApiProperty({ description: 'Question 26, e.g., "Starter system"', default: 'استارتر' })
  @Column({ type: DataType.TEXT, defaultValue: 'استارتر' })
  question_26: string;

  @ApiProperty({ description: 'Answer to question 27' })
  @Column({ type: DataType.TEXT })
  answer_27: string;

  @ApiProperty({ description: 'Type of answer for question 27' })
  @Column({ type: DataType.TEXT })
  type_27: string;

  @ApiProperty({ description: 'Question 27, e.g., "Transmission system"', default: 'سیستم انتقال قدرت' })
  @Column({ type: DataType.TEXT, defaultValue: 'سیستم انتقال قدرت' })
  question_27: string;

  @ApiProperty({ description: 'Answer to question 28' })
  @Column({ type: DataType.TEXT })
  answer_28: string;

  @ApiProperty({ description: 'Type of answer for question 28' })
  @Column({ type: DataType.TEXT })
  type_28: string;

  @ApiProperty({ description: 'Question 28, e.g., "Cylinder head"', default: 'سرسیلندر' })
  @Column({ type: DataType.TEXT, defaultValue: 'سرسیلندر' })
  question_28: string;

  @ApiProperty({ description: 'Answer to question 29' })
  @Column({ type: DataType.TEXT })
  answer_29: string;

  @ApiProperty({ description: 'Type of answer for question 29' })
  @Column({ type: DataType.TEXT })
  type_29: string;

  @ApiProperty({ description: 'Question 29, e.g., "Shock absorber"', default: 'کمک فنر' })
  @Column({ type: DataType.TEXT, defaultValue: 'کمک فنر' })
  question_29: string;

  @ApiProperty({ description: 'Answer to question 30' })
  @Column({ type: DataType.TEXT })
  answer_30: string;

  @ApiProperty({ description: 'Type of answer for question 30' })
  @Column({ type: DataType.TEXT })
  type_30: string;

  @ApiProperty({ description: 'Question 30, e.g., "Battery check"', default: 'باطری' })
  @Column({ type: DataType.TEXT, defaultValue: 'باطری' })
  question_30: string;

  @ApiProperty({ description: 'Answer to question 31' })
  @Column({ type: DataType.TEXT })
  answer_31: string;

  @ApiProperty({ description: 'Type of answer for question 31' })
  @Column({ type: DataType.TEXT })
  type_31: string;

  @ApiProperty({ description: 'Question 31, e.g., "Fuel tank system"', default: 'سیستم باک سوخت' })
  @Column({ type: DataType.TEXT, defaultValue: 'سیستم باک سوخت' })
  question_31: string;

  @ApiProperty({ description: 'Answer to question 32' })
  @Column({ type: DataType.TEXT })
  answer_32: string;

  @ApiProperty({ description: 'Type of answer for question 32' })
  @Column({ type: DataType.TEXT })
  type_32: string;

  @ApiProperty({ description: 'Question 32, e.g., "Turbocharger system"', default: 'سیستم توربو' })
  @Column({ type: DataType.TEXT, defaultValue: 'سیستم توربو' })
  question_32: string;

  @ApiProperty({ description: 'Answer to question 33' })
  @Column({ type: DataType.TEXT })
  answer_33: string;

  @ApiProperty({ description: 'Type of answer for question 33' })
  @Column({ type: DataType.TEXT })
  type_33: string;

  @ApiProperty({ description: 'Question 33, e.g., "Air filter system"', default: 'فیلتر هوا' })
  @Column({ type: DataType.TEXT, defaultValue: 'فیلتر هوا' })
  question_33: string;

  @ApiProperty({ description: 'Answer to question 34' })
  @Column({ type: DataType.TEXT })
  answer_34: string;

  @ApiProperty({ description: 'Type of answer for question 34' })
  @Column({ type: DataType.TEXT })
  type_34: string;

  @ApiProperty({ description: 'Question 34, e.g., "Service fee"', default: 'اجرت خدمات' })
  @Column({ type: DataType.TEXT, defaultValue: 'اجرت خدمات' })
  question_34: string;
}
