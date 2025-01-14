import { Column, Table, Model, Index, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { TruckInfo } from 'src/truck-info/truck-info.entity';

@Table
export class CheckList extends Model<CheckList> {
  @Column
  userId: number;

  @ForeignKey(() => TruckInfo)
  @Column(DataType.INTEGER)
  truckId: number;


  @BelongsTo(() => TruckInfo, 'truckId')
  truck: TruckInfo;

  @Column({type: DataType.INTEGER})
  carNumber: number;

  @Index
  @Column
  history: string;

  @Column
  hours: string;

  @Column({ type: DataType.BOOLEAN , defaultValue : false})
  isDeleted: boolean;

  @Column
  name: string;

  // kilometer's of truck , in "truck-break-down" used
  @Column
  answer_0: number;

  @Column({ type: DataType.TEXT })
  answer_1: string;
  @Column({ type: DataType.TEXT })
  answer_2: string;
  @Column({ type: DataType.TEXT })
  answer_3: string;
  @Column({ type: DataType.TEXT })
  answer_4: string;
  @Column({ type: DataType.TEXT })
  answer_5: string;
  @Column({ type: DataType.TEXT })
  answer_6: string;
  @Column({ type: DataType.TEXT })
  answer_7: string;
  @Column({ type: DataType.TEXT })
  answer_8: string;
  @Column({ type: DataType.TEXT })
  answer_9: string;
  @Column({ type: DataType.TEXT })
  answer_10: string;
  @Column({ type: DataType.TEXT })
  answer_11: string;
  @Column({ type: DataType.TEXT })
  answer_12: string;
  @Column({ type: DataType.TEXT })
  answer_13: string;
  @Column({ type: DataType.TEXT })
  answer_14: string;
  @Column({ type: DataType.TEXT })
  answer_15: string;
  @Column({ type: DataType.TEXT })
  answer_16: string;
  @Column({ type: DataType.TEXT })
  answer_17: string;
  @Column({ type: DataType.TEXT })
  answer_18: string;
  @Column({ type: DataType.TEXT })
  answer_19: string;
  @Column({ type: DataType.TEXT })
  answer_20: string;
}
