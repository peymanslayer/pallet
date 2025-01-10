import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { CheckList } from 'src/check-list/check-list.entity';
import { PeriodicTruckCheck } from 'src/periodic-truck-check/periodic-truck-check.entity';
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';

@Table
// comment: used for info truck in "truck-break-down"
export class TruckInfo extends Model<TruckInfo> {
  // comment: driverId in this model derived from "id" of driver model !!!
  // comment: this implement by peyman(first developer of project)
  @Column
  driverId: number;

  @Column({ defaultValue: '0' })
  lastCarLife: string;

  @Column({ defaultValue: '0' })
  lastCarLifeBackup: string;

  // comment: store last state of truck based on lowest answer's of checkList daily
  @Column
  state: string;

  @Column
  carNumber: string;

  @Column
  type: string;

  @Column
  zone: string;

  @Column
  company: string;

  @Column({ defaultValue: false })
  updateCarNumber: boolean;

  @HasMany(() => CheckList)
  checklists: CheckList[];

  @HasMany(() => PeriodicTruckCheck)
  periodicTruckCheck: PeriodicTruckCheck[];
    truckInfo: any;
    endKilometer: number;
    endDate: any;
}
