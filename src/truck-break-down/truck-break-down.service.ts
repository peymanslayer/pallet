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

  async get(id: number) {
    let data = {};

    let arrAns = [];
    const breakDown = await this.truckBreakDownRepository.findOne({
      where: {
        id: id,
      },
    });
    // create report for each breakdwon
    const res = await this.truckBreakDownItemsRepository.findOne({
      where: {
        id: breakDown.truckBreakDownItemsId,
      },
    });
    data = breakDown.dataValues;
    data['dateDriver'] = breakDown.dataValues.historyDriverRegister;
    data['hoursDriver'] = breakDown.dataValues.hoursDriverRegister;
    data['driverName'] = breakDown.dataValues.driverName;
    data['carNumber'] = breakDown.dataValues.carNumber;
    data['carLife'] = breakDown.dataValues.carLife;
    const answers = Object.entries(res.dataValues);
    for (let answer of answers) {
      let ans = {};

      let indx = answers.indexOf(answer);

      if (answer[0].includes('type_') && answer[1] != null) {
        ans['comment'] = answers[indx - 1][1];
        ans['type'] = answer[1];
        ans['number'] = indx / 2;
        arrAns.push(ans);
      }
    }
    data['answers'] = arrAns;
    //   console.log(data);
    return {
      status: 200,
      data: data,
    };
  }

  async getByDriverId(driverId: any) {
    let data = [];
    const breakDown = await this.truckBreakDownRepository.findAndCountAll({
      where: {
        driverId: driverId,
      },
      order: [['id', 'DESC']],
    });
    // create report for each breakdwon
    for (let item of breakDown.rows) {
      let report = {};
      const res = await this.truckBreakDownItemsRepository.findOne({
        where: {
          id: item.truckBreakDownItemsId,
        },
      });
      const items = res.dataValues;
      // console.log(items);
      report = item.dataValues;

      // due to keys of field have unique number , answer_1, answer_2, ..., answe_20
      for (let item = 1; item <= 20; item++) {
        // console.log(items[`answer_${item}`]);
        if (items[`answer_${item}`] != null) {
          report['type'] = items[`type_${item}`];
          report['comment'] = items[`answer_${item}`];
          report['number'] = item;
          data.push(report);
          break;
        }
      }
    }
    return {
      status: 200,
      data: data,
      count: data.length,
    };
  }
}
