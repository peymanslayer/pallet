import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class CheckListComment extends Model<CheckListComment> {
  @Column
  checkListId: number;

  @Column({type: DataType.BOOLEAN ,defaultValue : false})
  isDeleted: boolean;

  @Column
  comment_0: number;

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
