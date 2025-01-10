import { Column,Table,Model } from "sequelize-typescript";
import { DataType } from "sequelize-typescript";
@Table
export class Stock extends Model {

  @Column({ type: DataType.STRING })
  RecieveName: string;

}