import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class Chat extends Model {
  @Column
  dialog: Array<object>;
}
