import {
  Table,
  ForeignKey,
  Column,
  Model,
  DataType,
} from 'sequelize-typescript';
import { Order } from './order.entity';
import { Driver } from 'src/driver/driver.entity';

@Table
export class OrderDriver extends Model {
  @ForeignKey(() => Driver)
  @Column
  driverId: number;

  @ForeignKey(() => Order)
  @Column
  orderId: number;

  @Column({ type: DataType.DATE })
  deletedAt?: Date;
}
