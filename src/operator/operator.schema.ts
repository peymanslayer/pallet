
import { Table, Column, Model, HasMany ,DataType } from 'sequelize-typescript';
import { OperatorShop } from 'src/operatorShop/operatorShop.schema';

@Table
export class Operator extends Model {
  @Column
  name: string;

  @Column
  shopCode: number;
  @HasMany(()=>OperatorShop)
  shop:OperatorShop[]

  @Column
  password: string;

  @Column
  originalPassword:string

  @Column
  email:string

  @Column
  personelCode:string
}
