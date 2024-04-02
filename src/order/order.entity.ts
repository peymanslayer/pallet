import {
  Table,
  Column,
  Model,
  HasMany,
  BelongsToMany,
  HasOne,
  AutoIncrement,
  PrimaryKey,
} from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';
import { Driver } from 'src/driver/driver.entity';
import { OrderDriver } from './orderDriver.entity';
import { Comment } from 'src/comment/comment..entity';

@Table
export class Order extends Model {
  @Column({ type: DataType.INTEGER })
  woodPallet: number;

  @Column({ type: DataType.STRING })
  woodPalletCode: string;

  @Column({ type: DataType.INTEGER })
  plasticPallet: number;

  @Column({ type: DataType.STRING })
  plasticPalletCode: string;

  @Column({ type: DataType.INTEGER })
  basketOfPegahYogurt: number;

  @Column({ type: DataType.STRING })
  basketOfPegahYogurtCode: string;

  @Column({ type: DataType.INTEGER })
  basketOfPegahِDough: number;

  @Column({ type: DataType.STRING })
  basketOfPegahِDoughCode: String;

  @Column({ type: DataType.INTEGER })
  dominoBasket: number;

  @Column({ type: DataType.STRING })
  dominoBasketCode: String;

  @Column({ type: DataType.INTEGER })
  harazBasket: number;

  @Column({ type: DataType.STRING })
  harazBasketCode: String;

  @Column({ type: DataType.INTEGER })
  kallehBasket: number;

  @Column({ type: DataType.STRING })
  history: string;

  @Column({ type: DataType.STRING })
  kallehBasketCode: String;

  @Column({ type: DataType.INTEGER })
  boxBasket: number;

  @Column({ type: DataType.STRING })
  shopId: string;

  @Column({ type: DataType.INTEGER })
  orderNumber: number;

  @Column({ type: DataType.INTEGER })
  Password5Number: number;

  @HasOne(() => Comment)
  comment: Comment;

  @BelongsToMany(() => Driver, () => OrderDriver)
  driverId: Driver[];

  @Column
  userId: number;

  @Column({ type: DataType.INTEGER })
  registeredPassword: number;

  @Column({ type: DataType.DATE })
  deletedAt?: Date;

  @Column({ type: DataType.BOOLEAN })
  isDeletedByDriver: boolean;

  @Column({ type: DataType.INTEGER })
  driver: number;

  @Column({ type: DataType.INTEGER })
  isRegisteredByDriver: number;

  @Column({ type: DataType.INTEGER })
  numberOfOrder: number;

  @Column({ type: DataType.INTEGER })
  isRegisteredByStock: number;

  @Column({ type: DataType.INTEGER })
  stockId: number;

  @Column({ type: DataType.STRING })
  driverName: string;

  @Column({ type: DataType.STRING })
  stockName: string;

  @Column({ type: DataType.STRING })
  historyOfDriver: string;

  @Column({ type: DataType.STRING })
  historyOfStock: string;

  @Column({ type: DataType.STRING })
  hoursOfRegisterDriver: string;

  @Column({ type: DataType.STRING })
  hoursOfRegisterStock: string;

  @Column({ type: DataType.STRING })
  hours: string;

  @Column({ type: DataType.STRING })
  commentText: string;

  @Column({ type: DataType.STRING })
  shopUser: string;

  @Column({ type: DataType.BOOLEAN })
  woodPalletCheckDriver: boolean;

  @Column({ type: DataType.BOOLEAN })
  plasticPalletCheckDriver: boolean;

  @Column({ type: DataType.BOOLEAN })
  basketOfPegahYogurtCheckDriver: boolean;

  @Column({ type: DataType.BOOLEAN })
  basketOfPegahِDoughCheckDriver: boolean;

  @Column({ type: DataType.BOOLEAN })
  dominoBasketCheckDriver: boolean;

  @Column({ type: DataType.BOOLEAN })
  harazBasketCheckDriver: boolean;

  @Column({ type: DataType.BOOLEAN })
  kallehBasketCheckDriver: boolean;

  @Column({ type: DataType.BOOLEAN })
  boxBasketCheckDriver: boolean;

  @Column({ type: DataType.BOOLEAN })
  woodPalletCheckStock: boolean;

  @Column({ type: DataType.BOOLEAN })
  plasticPalletCheckStock: boolean;

  @Column({ type: DataType.BOOLEAN })
  basketOfPegahYogurtCheckStock: boolean;

  @Column({ type: DataType.BOOLEAN })
  basketOfPegahِDoughCheckStock: boolean;

  @Column({ type: DataType.BOOLEAN })
  dominoBasketCheckStock: boolean;

  @Column({ type: DataType.BOOLEAN })
  harazBasketCheckStock: boolean;

  @Column({ type: DataType.BOOLEAN })
  kallehBasketCheckStock: boolean;

  @Column({ type: DataType.BOOLEAN })
  boxBasketCheckStock: boolean;

  @Column({ type: DataType.INTEGER })
  basketOfpaakDough: number;

  @Column({ type: DataType.STRING })
  basketOfpaakDoughCode: string;

  @Column({ type: DataType.INTEGER })
  basketOfpaakyogurt: number;

  @Column({ type: DataType.BOOLEAN })
  basketOfpaakDoughCheckDriver: boolean;

  @Column({ type: DataType.BOOLEAN })
  basketOfpaakyogurtCheckDriver: boolean;

  @Column({ type: DataType.BOOLEAN })
  basketOfpaakyogurtCheckStock: boolean;

  @Column({ type: DataType.BOOLEAN })
  basketOfpaakDoughCheckStock: boolean;

  @Column({ type: DataType.BOOLEAN })
  isGeneratedPasswordByDriver: boolean;

  @Column({ type: DataType.STRING })
  orderSub: string;
}
