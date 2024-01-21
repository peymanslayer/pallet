import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  HasOne,
  Table,
} from 'sequelize-typescript';
import { CheckList } from 'src/check-list/check-list.entity';

@Table
export class CheckListComment extends Model<CheckListComment> {
  // @ForeignKey(() => CheckList)
  // @Column
  // checkListId: number;
  // @BelongsTo(() => CheckList)
  // checkList: CheckList;

  @Column
  comment_1: string;
  @Column
  comment_2: string;
  @Column
  comment_3: string;
  @Column
  comment_4: string;
  @Column
  comment_5: string;
  @Column
  comment_6: string;
  @Column
  comment_7: string;
  @Column
  comment_8: string;
  @Column
  comment_9: string;
  @Column
  comment_10: string;
  @Column
  comment_11: string;
  @Column
  comment_12: string;
  @Column
  comment_13: string;
  @Column
  comment_14: string;
  @Column
  comment_15: string;
  @Column
  comment_16: string;
  @Column
  comment_17: string;
  @Column
  comment_18: string;
  @Column
  comment_19: string;
  @Column
  comment_20: string;
  @Column
  comment_21: string;
}
