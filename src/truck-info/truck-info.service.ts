import { Inject, Injectable } from '@nestjs/common';
import { TruckInfo } from './truck-info.entity';
import { TruckInfoInsertDto } from './dto/truck-info.insert.dto';
import { Auth } from 'src/auth/auth.entity';
import { Op } from 'sequelize';
import { PeriodicTruckCheck } from 'src/periodic-truck-check/periodic-truck-check.entity';
import { PersianLetterMap } from './enum/truck.enum';
@Injectable()
export class TruckInfoService {
  constructor(
    @Inject('TRUCKINFO_REPOSITORY')
    private truckInfoRepository: typeof TruckInfo,
    @Inject('AUTH_REPOSITORY')
    private authRepository: typeof Auth,
  ) {}

  async get(driverId: number) {
    try {
      const truckInfoDriver = await this.truckInfoRepository.findOne({
        where: {
          driverId: driverId,
        },
      });
      return truckInfoDriver;
    } catch (err) {
      console.log(err);
    }
  }
  async add(body: TruckInfoInsertDto) {
    try {
      const {driverId , state , type , zone , carNumber} = body
      const truckInfoAdd = await this.truckInfoRepository.create({driverId , state , type , zone , carNumber });
    } catch (err) {
      console.log(err);
    }
  }

  async update(driverId: number, body: any) {
    try {
      const currentDriverCarNumber = await this.truckInfoRepository.findOne({where : {carNumber : body['carNumber']}})
      const oldDriverCarNumber = await this.truckInfoRepository.findOne({where : {carNumber : body['updateCarNumber']}})
      let driverName = null ;
      if(oldDriverCarNumber) {
        oldDriverCarNumber.carNumber = null;
        await oldDriverCarNumber.save()
        const driver = await this.authRepository.findOne({where : {id : oldDriverCarNumber.driverId}})
        if(driver) {
          driverName = driver.name
        }
      }
      if(currentDriverCarNumber) {
        currentDriverCarNumber.carNumber = null;
        await currentDriverCarNumber.save()
      }
      console.log(body.updateCarNumber);
      
      const infoUpdate = await this.truckInfoRepository.update({carNumber:body.updateCarNumber}, {
        where: {
          driverId: driverId,
        },
      });
console.log(infoUpdate.length);

      return { status: 200, data: driverId , message: ` پلاک با موفقیت تغییر یافت لطفا برای کاربر با نام ${driverName} تعیین پلاک کنید.` };
    } catch (err) {
      console.log(err);
    }
  }

  async getByCarNumber(carNumber: string) {
    try {
      const data = [];
      const truckInfos = await this.truckInfoRepository.findAll({
        attributes: ['id', 'carNumber', 'lastCarLife', 'driverId'],
        where: {
          carNumber: { [Op.like]: `%${carNumber}%` },
        },
      });

      if (truckInfos.length) {
        for (let item of truckInfos) {
          const itemData = {};

          const user = await this.authRepository.findOne({
            attributes: ['name', 'mobile'],
            where: {
              id: item.dataValues.driverId,
            },
          });
          if (user) {
            Object.assign(itemData, user.dataValues);
            Object.assign(itemData, item.dataValues);
            data.push(itemData);
          }
        }

        return {
          data: data,
          status: 200,
          message: 'successfully operation',
        };
      } else {
        return {
          data: truckInfos,
          status: 200,
          message: 'ماشین با این مشخصات یافت نشد',
        };
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getById(id: number) {
    try {
      const res = await this.truckInfoRepository.findOne({
        where: {
          id: id,
        },
        include: [PeriodicTruckCheck],
      });
      if (res.id) return { data: res, status: 200, message: 'successfully' };
      else return { data: {}, status: 200, message: 'ماشین یافت نشد' };
    } catch (err) {
      console.log(err);
    }
  }

  async getLogisticManagerDriverList(zone: string, company: string) {
    try {
      const result = [];
      if (!zone) zone = '';
      if (!company) company = '';

      const truckInfos = await this.truckInfoRepository.findAll({
        attributes: ['driverId', 'carNumber', 'zone'],
        where: {
          zone: zone,
        },
      });

      for (let truckInfo of truckInfos) {
        const data = {};
        const auth = await this.authRepository.findOne({
          attributes: ['personelCode', 'originalPassword', 'name', 'company'],
          where: {
            id: truckInfo.dataValues.driverId,
          },
        });

        if (auth?.dataValues.company == company) {
          Object.assign(data, truckInfo.dataValues);
          Object.assign(data, auth.dataValues);
        }

        if (data['driverId']) result.push(data);
      }

      return { status: 200, data: result };
    } catch (err) {
      console.log(err);
    }
  }

  async getAllCarNumbers(){
    try {
      const carNumbers = await this.truckInfoRepository.findAll({
        attributes: ['carNumber'],
      })
      if(!carNumbers) {
        return {
          status : 200 ,
          data : [] ,
          message: "پلاکی یافت نشد"
        }
      }
      return {
        status : 200 ,
        data : carNumbers ,
        message: "پلاک ها یا موفقیت یافت شدند"
      }
    } catch (error) {
      console.log(error);
    }
  }
}
