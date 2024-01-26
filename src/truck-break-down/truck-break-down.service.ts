import { Inject, Injectable } from '@nestjs/common';

import { TruckBreakDownItems } from 'src/truck-break-down-items/truck-break-down-items.entity';
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';
@Injectable()
export class TruckBreakDownService {
  constructor(
    @Inject('TRUCKBREAKDOWN_REPOSITORY')
    private readonly truckBreakDownRepository: typeof TruckBreakDown,
    @Inject('TRUCKBREAKDOWNITEMS_REPOSITORY')
    private readonly truckBreakDownItemsRepository: typeof TruckBreakDownItems,
  ) {}

  async getAll() {
    let data = [];
    const res = await this.truckBreakDownRepository.findAndCountAll();

    for (let item of res.rows) {
      let breakDown = {};
      const answers = await this.truckBreakDownItemsRepository.findOne({
        where: {
          id: item.truckBreakDownItemsId,
        },
      });
      //   console.log(answers);
      breakDown = item.dataValues;
      breakDown['answers'] = answers.dataValues;
      data.push(breakDown);
      //   console.log(data);
    }
    return {
      status: 200,
      data: data,
      count: res.count,
    };
  }

  async getByUserId(driverId: number) {
    let data = [];
    const res = await this.truckBreakDownRepository.findAndCountAll({
      where: {
        driverId: driverId,
      },
    });

    for (let item of res.rows) {
      let breakDown = {};
      const answers = await this.truckBreakDownItemsRepository.findOne({
        where: {
          id: item.truckBreakDownItemsId,
        },
      });
      //   console.log(answers);
      breakDown = item.dataValues;
      breakDown['answers'] = answers.dataValues;
      data.push(breakDown);
      //   console.log(data);
    }
    return {
      status: 200,
      data: data,
      count: res.count,
    };
  }

  //   async update(breakDownid: number){
  //     const res = await this.tr

  //   }
}
