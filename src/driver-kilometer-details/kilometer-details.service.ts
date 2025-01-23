import { Inject, Injectable } from '@nestjs/common';
import { TruckInfo } from 'src/truck-info/truck-info.entity';
import { KilometerDetails } from './entities/kilometer-detail.entity';
import { Op } from 'sequelize';

@Injectable()
export class KilometerDetailsService {
    constructor(
        @Inject('TRUCKINFO_REPOSITORY')
        private truckInfoRepository: typeof TruckInfo,
        @Inject('KILOMETER_DETAIL_REPOSITORY')
        private driverKilometerDetailRepository: typeof KilometerDetails,
    ){}
    async create(truckId: number, driverId: number, kilometer: number) {
      const truck = await this.truckInfoRepository.findOne({ where: { id: +truckId } });

      console.log(kilometer);
      

      if (!truck) {
          return {
              status: 200,
              data: [],
              message: "ماشین مورد نظر یافت نشد"
          };
      }
      
      let kilometerDetails = await this.driverKilometerDetailRepository.findOne({ where: { driverId } });
      
      if (!kilometerDetails) {

          kilometerDetails = await this.driverKilometerDetailRepository.create({
              driverId,
              truckId,
              carNumber: truck.carNumber,
              kilometer,
              totalKilometer: kilometer
          });
          return {
              status: 200,
              data: kilometerDetails,
              message: "رکورد جدید با موفقیت ایجاد شد"
          };
      }
      
      kilometerDetails.totalKilometer += kilometer;
      await kilometerDetails.save();
      
      return {
          status: 200,
          data: kilometerDetails,
          message: "با موفقیت آپدیت شد"
      };
  }
  

    async getKilometerDetailsByFilter(
        driverIds: number[], 
        truckIds: number[], 
        startDate: string, 
        endDate: string
      ) {
        const filter: any = {};
      
        if (driverIds && driverIds.length > 0) {
          filter.driverId = { [Op.in]: driverIds };
        }
      
        if (truckIds && truckIds.length > 0) {
          filter.truckId = { [Op.in]: truckIds };
        }

        if (startDate && endDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0); 
      
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999); 
      
          filter.createdAt = {
            [Op.between]: [start, end],
          };
        }
      
        const kilometerDetails = await this.driverKilometerDetailRepository.findAll({
          where: filter,
        });
      
        if(!kilometerDetails){
            return {
                status: 201,
                data: [] ,
                message: "داده ای با این جزئیات پیدا نشد"
            }
        }

        return {
            status: 200,
            data: kilometerDetails ,
            message: "داده ها با موفقیت یافت شدند"
        }
      }


      async deleteKilometerDetails(id: number){
        const kilometerDetails = await this.driverKilometerDetailRepository.findByPk(id)
        if(!kilometerDetails){
            return {
                status: 201,
                data: [] ,
                message: "داده ای با این جزئیات پیدا نشد"
            }
        }
        await this.driverKilometerDetailRepository.destroy({
            where : {id}
        })

        return {
            status: 200,
            data: kilometerDetails ,
            message: "داده با موفقیت حذف شد"
        }
      }
      
}
