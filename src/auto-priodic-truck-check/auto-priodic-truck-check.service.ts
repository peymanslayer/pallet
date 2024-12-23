import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize';
import { alertKilometer, PeriodicTruckCheckTypes } from 'src/common/constants';
import { PeriodicType } from 'src/periodic-type/periodic-type.entity';
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';
import { TruckBreakDownService } from 'src/truck-break-down/truck-break-down.service';
import { TruckInfo } from 'src/truck-info/truck-info.entity';
import { AutoAdd } from './dto/add.dto';
import { Auth } from 'src/auth/auth.entity';

@Injectable()
export class AutoPriodicTruckCheckService {
    constructor(
        @Inject('TRUCKBREAKDOWN_REPOSITORY') private truckBreakDownModel: typeof TruckBreakDown,
        @Inject('PERIODIC_TYPE_REPOSITORY') private priodicTypeModel: typeof PeriodicType,
        @Inject('TRUCKINFO_REPOSITORY') private truckInfoModel: typeof TruckInfo,
        @Inject('PERIODIC_TRUCK_CHECK_REPOSITORY') private PriodicTruckCheckModel: typeof TruckInfo,
        @Inject('AUTH_REPOSITORY') private readonly authModel: typeof Auth,
        // private readonly truckBreakDownService: TruckBreakDownService ,
    ){}
    async autoAdd(breakDownId: number, autoAdd: AutoAdd) {  
        try {
            const {types , endDate} = autoAdd
            const breakDown = await this.truckBreakDownModel.findOne({ where: { id: breakDownId } });
            if (!breakDown) {
                return { status: 200, data: [], message: 'خرابی یافت نشد' };
            }
    
            const truck = await this.truckInfoModel.findOne({ where: { driverId: breakDown.driverId, carNumber: breakDown.carNumber } });
            if (!truck) {
                return { status: 200, data: [], message: 'ماشین یافت نشد' };
            }
    
            if (!truck.lastCarLife || !truck.id) {
                return { status: 500, data: [], message: 'اطلاعات ماشین ناقص است' };
            }
    
            let lastEndKilometer = Number(truck.lastCarLife); 
    
            for (const type of types) {
                const periodicKilometer = await this.priodicTypeModel.findOne({
                    attributes: ['periodicKilometer'],
                    where: { type: type },
                });
            
                if (!periodicKilometer) {
                    console.log(`نوع دوره‌ای ${type} یافت نشد`);
                    continue;
                }
            
                const newEndKilometer = periodicKilometer.periodicKilometer + lastEndKilometer;
            
                const payload = {
                    truckInfoId: truck.id,
                    type: type,
                    endKilometer: newEndKilometer,
                    endDate : endDate
                };
    
                console.log('Payload:', payload);
            
                try {
                    const result = await this.PriodicTruckCheckModel.create(payload);
            
                    if (!result) {
                        console.log(`ثبت نوع دوره‌ای ${type} انجام نشد`);
                    } else {
                        console.log(`نوع دوره‌ای ${type} با مقدار ${payload.endKilometer} با موفقیت ثبت شد`);
                    }
                } catch (error) {
                    console.error('Validation error:', error.message);
                }
                lastEndKilometer = newEndKilometer;
            }
            
            await this.truckInfoModel.update(
                { lastCarLife: lastEndKilometer.toString()},
                { where: { id: truck.id } }
            );
    
            return { 
               status: 200,
               data: [], 
               message: 'عملیات با موفقیت انجام شد' 
              };
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async getAlertPeriodicTruckCheck() {
        try {
          const data = [];
    
          const periodicInfo = await this.PriodicTruckCheckModel.findAll({
            include: [
              {
                model: TruckInfo,
              },
            ],
          });
    
          const periodicTypes = await this.priodicTypeModel.findAll({
            attributes: ['name', 'type'],
          });
    
          for (let periodic of periodicInfo) {
            periodic.type = periodicTypes.find(
              (item) => item.type === periodic.type,
            ).name;
            if (
              periodic.endKilometer - Number(periodic.truckInfo.lastCarLife) <=
              alertKilometer
            ) {
              const itemData = {};
              const user = await this.authModel.findOne({
                where: {
                  id: periodic.dataValues.truckInfo.driverId,
                },
              });
              if (user?.id) {
                itemData['id'] = periodic.id;
                itemData['driverName'] = user.name;
                itemData['driverMobile'] = user.mobile;
                itemData['endDate'] = periodic.endDate;
                itemData['endKilometer'] = periodic.endKilometer;
                itemData['carNumber'] = periodic.truckInfo.carNumber;
                itemData['type'] = periodic.type;
                itemData['calculateKilometer'] =
                  periodic.endKilometer - Number(periodic.truckInfo.lastCarLife);
    
                data.push(itemData);
              }
            }
          }
    
          return { 
            data: data, 
            status: 200, 
            message: 'successfully' 
          };
    
          //2.2 check  diff ("periodic.endDate" - "new date")  <= 5 ==> alert
        } catch (err) {
          console.log(err);
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
    
    
}
