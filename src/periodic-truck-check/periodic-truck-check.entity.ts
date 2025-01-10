import {
  Table,
  Model,
  Column,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { PeriodicType } from 'src/periodic-type/periodic-type.entity';

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

  @Column({ defaultValue: false })
  autoAdd: boolean;

  @Column({ defaultValue: false })
  alert: boolean; // #HINT: maybe use later

  @ForeignKey(() => TruckInfo)
  @Column({ allowNull: false })
  truckInfoId: number;

  @BelongsTo(() => TruckInfo)
  truckInfo: TruckInfo;

  @ForeignKey(() => PeriodicType)  
  @Column
  periodicTypeId: number;  

  @BelongsTo(() => PeriodicType)  
  periodicType: PeriodicType;


}
