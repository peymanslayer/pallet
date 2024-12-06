import {
  Table,
  Model,
  Column,
  ForeignKey,
  BelongsTo,
  Unique,
  DataType,
} from 'sequelize-typescript';

import { TruckInfo } from 'src/truck-info/truck-info.entity';

@Table({
  indexes: [
    {
      name: 'unique_truckInfoId_type',
      unique: true,
      fields: ['truckInfoId', 'type'],
    },
  ],
})
export class PeriodicTruckCheck extends Model<PeriodicTruckCheck> {
  @Column
  endKilometer: number;

  @Column
  endDate: Date;

  @Column
  type: string;

  @Column({ defaultValue: false })
  alertReview: boolean;

  @ForeignKey(() => TruckInfo)
  @Column({ allowNull: false })
  truckInfoId: number;

  @BelongsTo(() => TruckInfo)
  truckInfo: TruckInfo;
}
