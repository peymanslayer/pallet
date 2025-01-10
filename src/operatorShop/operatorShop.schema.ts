
import { Table, Column, Model, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Operator } from 'src/operator/operator.schema';

@Table
export class OperatorShop extends Model {
  @Column
  shopCode: string;
  
  @ForeignKey(()=>Operator)
  @Column
  operatorId: number;

  @Column
  driver:string
  
  @BelongsTo(()=>Operator)
  operator:Operator

  @Column
  woodPallet:string

  @Column
  plasticPallet:string

  @Column
  typeOfDriver:string

  @Column
  registerTime:string

  @Column
  registerHistory:string

  @Column
  name:string
}
