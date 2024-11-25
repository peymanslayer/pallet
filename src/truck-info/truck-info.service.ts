import { Inject, Injectable } from '@nestjs/common';
import { TruckInfo } from './truck-info.entity';
import { TruckInfoInsertDto } from './dto/truck-info.insert.dto';
import { Auth } from 'src/auth/auth.entity';
import { Sequelize, where } from 'sequelize';
import { Equals } from 'sequelize-typescript';
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
      // body['driverId'] = driverId;
      const truckInfoAdd = await this.truckInfoRepository.create(body);
    } catch (err) {
      console.log(err);
    }
  }
  async update(driverId: number, body: any) {
    try {
      const infoUpdate = await this.truckInfoRepository.update(body, {
        where: {
          driverId: driverId,
        },
      });

      return { status: 200, data: {}, message: 'update successfully' };
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
}
