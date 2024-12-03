import {
  Table,
  Model,
  Column,
  ForeignKey,
  AllowNull,
} from 'sequelize-typescript';
import { TruckInfo } from 'src/truck-info/truck-info.entity';

@Table
export class PeriodicTruckCheck extends Model<PeriodicTruckCheck> {
  @Column
  engineOilEndDate: Date;

  @Column
  engineOilEndKilometer: number;

  @Column
  technicalInspectionEndDate: Date;

  @Column
  technicalInspectionEndKilometer: number;

  @Column
  tireEndKilometer: number;

  @Column
  tireEndDate: Date;

  @Column
  sparkPlugEndDate: Date;

  @Column
  sparkPlugEndKilometer: number;

  @Column
  padEndKilometer: number;

  @Column
  padEndDate: Date;

  @Column
  gearboxOilEndKilometer: number;

  @Column
  gearboxOilEndDate: Date;

  @Column
  brakeDiscEndKilometer: number;

  @Column
  brakeDiscEndDate: Date;

  @Column
  beltEndKilometer: number;

  @Column
  beltEndDate: Date;

  @Column
  clutchEndDate: Date;

  @Column
  clutchEndKilometer: number;

  @Column
  padBowlEndDate: Date;

  @Column
  padBowlEndKilometer: number;

  @ForeignKey(() => TruckInfo)
  @Column({ allowNull: true })
  truckInfoId: number | null;
}
