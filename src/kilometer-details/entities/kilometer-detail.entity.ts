import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Auth } from "src/auth/auth.entity";
import { TruckInfo } from "src/truck-info/truck-info.entity";

@Table({
    tableName: 'KilometerDetails',
    timestamps: true,
})
export class KilometerDetails extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => TruckInfo)
    @Column(DataType.INTEGER)
    truckId: number;

    @Column(DataType.STRING)
    carNumber: string

    @ForeignKey(() => Auth)
    @Column(DataType.INTEGER)
    driverId: number;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
      })
    kilometer: number;
      
    @BelongsTo(() => TruckInfo, 'truckId')
    truck: TruckInfo;

    @BelongsTo(() => Auth, 'driverId')
    driver: Auth;
}
