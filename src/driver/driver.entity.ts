import {
  Table,
  Column,
  Model,
  AllowNull,
  BelongsTo,
  ForeignKey,
  BelongsToMany,
} from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';
import { Order } from 'src/order/order,entity';
import { OrderDriver } from 'src/order/orderDriver.entity';

@Table
export class Driver extends Model {
  @BelongsToMany(() => Order, () => OrderDriver)
  order: Order[];

  @Column({ type: DataType.INTEGER })
  driverPassword: number;

  @Column({ type: DataType.STRING })
  driverName: string;


  @Column({type:DataType.INTEGER})
  orderId: number;
}
