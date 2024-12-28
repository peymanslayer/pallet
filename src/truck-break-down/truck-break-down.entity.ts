import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Auth } from 'src/auth/auth.entity';
import { TruckBreakDownStatus } from 'src/common/enum';
import { RepairInvoice } from 'src/repair-invoice/rapair-invoice.entity';
import { ROLES } from 'src/static/enum';

@Table
export class TruckBreakDown extends Model {
  @Column
  truckBreakDownItemsId: number;

  @ForeignKey(() => Auth)
  @Column
  driverId: number;

  @Column
  driverName: string;

  @Column
  driverMobile: string;

  @Column
  numberOfBreakDown: number;

  //this field in truckInfo not used in this report(maybe) FALSE
  // for not join in each report add this model
  @Column
  carNumber: string;

  @Column
  carLife: number;

  @Column
  hoursDriverRegister: string;

  @Column
  historyDriverRegister: string;

  @Column({ defaultValue: false })
  logisticConfirm: boolean;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      const confirm = this.getDataValue('logisticConfirm') ?? false;
      return confirm === true;
    },
  })
  isLogisticConfirmed: boolean;

  @Column
  logisticComment: string;

  @Column(DataType.ENUM('necessary', 'notNecessary', 'immediately'))
  transportComment: string;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      return this.getDataValue('transportComment') !== null;
    },
  })
  isTransportCommentValid: boolean;

  @Column
  transportCommentHistory: string;

  @Column({ defaultValue: false })
  notifyTransportComment: boolean;

  @Column
  repairmanComment: string;

  @Column({ defaultValue: false })
  notifyRepairmanComment: boolean;

  @Column
  hoursRepairComment: string;

  @Column
  historyRepairComment: string;

  @Column
  historySendToRepair: string;

  @Column
  historyReciveToRepair: string;

  @Column
  histroyDeliveryTruck: string;

  // history of register repairman "deliver truck to driver after repair"
  @Column
  historyDeliveryDriver: string;

  @Column
  piece: string;

  @Column
  lastFetch: Date;

  @Column(DataType.ENUM('insideCompany', 'outsideCompany'))
  cartexType: string

  @Column({ defaultValue: false })
  moveToCenter: boolean;

  @Column({ defaultValue: false })
  repairShopOutside: boolean;

  @HasMany(() => RepairInvoice)
  repairInvoice: RepairInvoice[];

  // MID: manage filter "TruckBreakDown"
  // @Column
  // status: TruckBreakDownStatus;
}
