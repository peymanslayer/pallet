import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';
import { TruckInfo } from 'src/truck-info/truck-info.entity';

@Table
export class RepairInvoice extends Model {
  @Column
  piece: string;

  @Column
  typeActivity: string;

  @Column({type : DataType.TEXT})
  comment:string

  @Column
  carNumber: string;

  @Column
  carNumberSystem: string;

  @Column
  providerCode: string;

  @Column
  providerName: string;

  @Column
  amount: string;

  @ForeignKey(() => TruckBreakDown)
  @Column({ allowNull: true })
  truckBreakDownId: number;

  @BelongsTo(() => TruckBreakDown, 'truckBreakDownId')
  truckBreakDown: TruckBreakDown;
}

