import {
  Table,
  Column,
  Model,
  AllowNull,
  ForeignKey,
} from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';
import { Order } from 'src/order/order.entity';

@Table
export class Comment extends Model {
  @AllowNull(false)
  @Column({ type: DataType.STRING })
  comment: string;
  @ForeignKey(() => Order)
  @Column({ type: DataType.INTEGER })
  shopId: number;
}
