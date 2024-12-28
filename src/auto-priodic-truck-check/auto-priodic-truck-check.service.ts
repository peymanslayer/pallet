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
          const { types, endDate } = autoAdd;
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
  
          const initialCarLife = Number(truck.lastCarLife);
          console.log(initialCarLife);
           
          let responseData = []
          for (const type of types) {
              if (type === 'technicalInspection') {
                  const oneYearLater = new Date();
                  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
  
                  const payload = {
                      truckInfoId: truck.id,
                      type: type,
                      endDate: oneYearLater, 
                  };
  
                  console.log('Payload for technicalInspection:', payload);
  
                  try {
                      const result = await this.PriodicTruckCheckModel.create(payload);
                      responseData.push(result)
                      if (!result) {
                          console.log(`ثبت نوع دوره‌ای ${type} انجام نشد`);
                      } else {
                          console.log(`نوع دوره‌ای ${type} با تاریخ ${oneYearLater} با موفقیت ثبت شد`);
                      }
                  } catch (error) {
                      console.error('Validation error for technicalInspection:', error.message);
                  }
                  continue; 
              }
  
              const periodicKilometer = await this.priodicTypeModel.findOne({
                  attributes: ['periodicKilometer'],
                  where: { type: type },
              });
  
              if (!periodicKilometer) {
                  console.log(`نوع دوره‌ای ${type} یافت نشد`);
                  continue;
              }
  
              const newEndKilometer = periodicKilometer.periodicKilometer + initialCarLife;
  
              const payload = {
                  truckInfoId: truck.id,
                  type: type,
                  endKilometer: newEndKilometer,
                  endDate: endDate,
              };
  
              console.log('Payload:', payload);
  
              try {
                  const result = await this.PriodicTruckCheckModel.create(payload);
                  responseData.push(result)
  
                  if (!result) {
                      console.log(`ثبت نوع دوره‌ای ${type} انجام نشد`);
                  } else {
                      console.log(`نوع دوره‌ای ${type} با مقدار ${payload.endKilometer} با موفقیت ثبت شد`);
                  }
              } catch (error) {
                  console.error('Validation error:', error.message);
              }
          }
  
          await this.truckInfoModel.update(
              { lastCarLife: initialCarLife.toString() },
              { where: { id: truck.id } }
          );
  
          return { 
              status: 200,
              data: responseData, 
              message: 'عملیات با موفقیت انجام شد' 
          };
      } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }
  
    
}
