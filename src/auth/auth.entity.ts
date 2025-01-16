import { Table, Column, Model, Unique, HasMany, Scopes } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';
import { getEnumsString, ROLES } from 'src/static/enum';
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';
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

  @Column({
    type: DataType.ENUM(...getEnumsString(ROLES)),
  })
  role: string;

  @Column
  mobile: string;

  // @Unique // error in "test-db"
  @Column
  personelCode: string;

  // @Unique // check with "pm" it not necessary
  @Column
  shopCode: number;

  @Column
  originalPassword: string;

  @Column
  subscriber: string;

  @Column({ defaultValue: '' })
  zone: string;

  @Column
  zoneCode: string;

  @Column
  company: string;
}

