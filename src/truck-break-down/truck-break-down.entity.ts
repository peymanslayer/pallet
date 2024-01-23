import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class TruckBreakDown extends Model {
  @Column
  truckBreakDownItemsId: number;

  @Column
  driverId: string;

  @Column
  carNumber: string;

  @Column
  driverName: string;

  @Column
  carLife: number;

  @Column
  hoursDriverRegister: string;

  @Column
  historyDriverRegister: string;

  @Column
  repairComment: string;

  @Column
  hoursRepairComment: string;

  @Column
  historyRepairComment: string;

  @Column
  hoursSendToRepair: string;

  @Column
  historySendToRepair: string;

  @Column
  hoursReciveToRepair: string;

  @Column
  historyReciveToRepair: string;
}
