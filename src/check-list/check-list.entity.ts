import {
  BelongsTo,
  HasOne,
  Column,
  Table,
  Model,
  ForeignKey,
} from 'sequelize-typescript';
import { CheckListComment } from 'src/check-list-comment/check-list-comment.entity';
import { Driver } from 'src/driver/driver.entity';

@Table
export class CheckList extends Model<CheckList> {
  // @HasOne(() => CheckListComment)
  // checkListComment: CheckListComment;
  // @ForeignKey(() => CheckListComment)
  // @Column
  // checklistCommentId: number

  @Column
  answer_1: string;
  @Column
  answer_2: string;
  @Column
  answer_3: string;
  @Column
  answer_4: string;
  @Column
  answer_5: string;
  @Column
  answer_6: string;
  @Column
  answer_7: string;
  @Column
  answer_8: string;
  @Column
  answer_9: string;
  @Column
  answer_10: string;
  @Column
  answer_11: string;
  @Column
  answer_12: string;
  @Column
  answer_13: string;
  @Column
  answer_14: string;
  @Column
  answer_15: string;
  @Column
  answer_16: string;
  @Column
  answer_17: string;
  @Column
  answer_18: string;
  @Column
  answer_19: string;
  @Column
  answer_20: string;
  @Column
  answer_21: string;
}
