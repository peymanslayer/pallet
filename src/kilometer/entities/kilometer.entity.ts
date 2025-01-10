import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    PrimaryKey,
    AutoIncrement,
  } from 'sequelize-typescript';
import { TruckInfo } from 'src/truck-info/truck-info.entity';

@Table({
    tableName: 'Kilometers',
    timestamps: true,
})
export class Kilometer extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => TruckInfo)
    @Column(DataType.INTEGER)
    truckId: number;

    @Column(DataType.STRING)
    carNumber: string

    @Column(DataType.INTEGER)
    currenrKilometer: number;

    @Column(DataType.INTEGER)
    previousKilometer: number;

    @BelongsTo(() => TruckInfo, 'truckId')
    truck: TruckInfo;
}
