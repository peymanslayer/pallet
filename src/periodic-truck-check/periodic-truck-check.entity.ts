import {
  Table,
  Model,
  Column,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { TruckInfo } from 'src/truck-info/truck-info.entity';

@Table
export class PeriodicTruckCheck extends Model<PeriodicTruckCheck> {
  @Column
  endKilometer: number;

  @Column
  endDate: Date;

  @Column
  type: string;

  @ForeignKey(() => TruckInfo)
  @Column({ allowNull: false })
  truckInfoId: number;

  @BelongsTo(() => TruckInfo)
  truckInfo: TruckInfo;
}
