import { Table, Column, Model, Unique } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';

@Table
export class Auth extends Model {
  // @Unique // name not unique in data sample
  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  password: string;

  @Column({ type: DataType.STRING })
  email: string;

  @Column
  token: string;

  @Column
  role: string;

  @Column
  mobile: string;

  @Unique
  @Column
  personelCode: string;

  // @Unique // check with "pm" it not necessary
  @Column
  shopCode: number;

  @Column
  originalPassword: string;

  @Column
  subscriber: string;
}
