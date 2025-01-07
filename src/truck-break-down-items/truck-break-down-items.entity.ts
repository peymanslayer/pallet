import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';

@Table
export class TruckBreakDownItems extends Model<TruckBreakDownItems> {
  //   @Column({ type: DataType.TEXT })
  //   truckBreakDownId: number;
  @HasMany(() => TruckBreakDown)
  truckBreakDowns: TruckBreakDown[];

  @Column({ type: DataType.TEXT })
  answer_1: string;

  @Column({ type: DataType.TEXT })
  type_1: string;

  @Column({ type: DataType.TEXT })
  answer_2: string;

  @Column({ type: DataType.TEXT })
  type_2: string;

  @Column({ type: DataType.TEXT })
  answer_3: string;

  @Column({ type: DataType.TEXT })
  type_3: string;

  @Column({ type: DataType.TEXT })
  answer_4: string;

  @Column({ type: DataType.TEXT })
  type_4: string;

  @Column({ type: DataType.TEXT })
  answer_5: string;

  @Column({ type: DataType.TEXT })
  type_5: string;

  @Column({ type: DataType.TEXT })
  answer_6: string;

  @Column({ type: DataType.TEXT })
  type_6: string;

  @Column({ type: DataType.TEXT })
  answer_7: string;

  @Column({ type: DataType.TEXT })
  type_7: string;

  @Column({ type: DataType.TEXT })
  answer_8: string;

  @Column({ type: DataType.TEXT })
  type_8: string;

  @Column({ type: DataType.TEXT })
  answer_9: string;

  @Column({ type: DataType.TEXT })
  type_9: string;

  @Column({ type: DataType.TEXT })
  answer_10: string;

  @Column({ type: DataType.TEXT })
  type_10: string;

  @Column({ type: DataType.TEXT })
  answer_11: string;

  @Column({ type: DataType.TEXT })
  type_11: string;

  @Column({ type: DataType.TEXT })
  answer_12: string;

  @Column({ type: DataType.TEXT })
  type_12: string;

  @Column({ type: DataType.TEXT })
  answer_13: string;

  @Column({ type: DataType.TEXT })
  type_13: string;

  @Column({ type: DataType.TEXT })
  answer_14: string;

  @Column({ type: DataType.TEXT })
  type_14: string;

  @Column({ type: DataType.TEXT })
  answer_15: string;

  @Column({ type: DataType.TEXT })
  type_15: string;

  @Column({ type: DataType.TEXT })
  answer_16: string;

  @Column({ type: DataType.TEXT })
  type_16: string;

  @Column({ type: DataType.TEXT })
  answer_17: string;

  @Column({ type: DataType.TEXT })
  type_17: string;

  @Column({ type: DataType.TEXT })
  answer_18: string;

  @Column({ type: DataType.TEXT })
  type_18: string;

  @Column({ type: DataType.TEXT })
  answer_19: string;

  @Column({ type: DataType.TEXT })
  type_19: string;

  @Column({ type: DataType.TEXT })
  answer_20: string;

  @Column({ type: DataType.TEXT })
  type_20: string;

  @Column({ type: DataType.TEXT })
  answer_21: string;

  @Column({ type: DataType.TEXT })
  type_21: string;

  @Column({ type: DataType.TEXT })
  answer_22: string;

  @Column({ type: DataType.TEXT })
  type_22: string;
  @Column({ type: DataType.TEXT })
  answer_23: string;

  @Column({ type: DataType.TEXT })
  type_23: string;
  @Column({ type: DataType.TEXT })
  answer_24: string;

  @Column({ type: DataType.TEXT })
  type_24: string;
  @Column({ type: DataType.TEXT })
  answer_25: string;

  @Column({ type: DataType.TEXT })
  type_25: string;
  @Column({ type: DataType.TEXT })
  answer_26: string;

  @Column({ type: DataType.TEXT })
  type_26: string;
  @Column({ type: DataType.TEXT })
  answer_27: string;

  @Column({ type: DataType.TEXT })
  type_27: string;
  @Column({ type: DataType.TEXT })
  answer_28: string;

  @Column({ type: DataType.TEXT })
  type_28: string;
  @Column({ type: DataType.TEXT })
  answer_29: string;

  @Column({ type: DataType.TEXT })
  type_29: string;
  @Column({ type: DataType.TEXT })
  answer_30: string;

  @Column({ type: DataType.TEXT })
  type_30: string;
  @Column({ type: DataType.TEXT })
  answer_31: string;

  @Column({ type: DataType.TEXT })
  type_31: string;
  @Column({ type: DataType.TEXT })
  answer_32: string;

  @Column({ type: DataType.TEXT })
  type_32: string;
  @Column({ type: DataType.TEXT })
  answer_33: string;

  @Column({ type: DataType.TEXT })
  type_33: string;
  @Column({ type: DataType.TEXT })
  answer_34: string;

  @Column({ type: DataType.TEXT })
  type_34: string;
}
