import { Inject, Injectable } from '@nestjs/common';
import { TruckBreakDownItems } from 'src/truck-break-down-items/truck-break-down-items.entity';
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';
import { TruckInfo } from 'src/truck-info/truck-info.entity';
@Injectable()
export class TruckBreakDownService {
  constructor(
    @Inject('TRUCKBREAKDOWN_REPOSITORY')
    private readonly truckBreakDownRepository: typeof TruckBreakDown,
    @Inject('TRUCKBREAKDOWNITEMS_REPOSITORY')
    private readonly truckBreakDownItemsRepository: typeof TruckBreakDownItems,
    @Inject('TRUCKINFO_REPOSITORY')
    private readonly truckInfoRepository: typeof TruckInfo,
  ) {}

  async getAll() {
    let data = [];
    const breakDowns = await this.truckBreakDownRepository.findAndCountAll({
      order: [['id', 'DESC']],
    });

    for (let item of breakDowns.rows) {
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
      count: breakDowns.count,
    };
  }

  async getAllRepairUser() {
    let data = [];
    const breakDowns = await this.truckBreakDownRepository.findAndCountAll({
      order: [['id', 'DESC']],
    });

    for (let item of breakDowns.rows) {
      let breakDown = {};
      let row = {};
      // const truckInfo = await this.truckInfoRepository.findOne({
      //   where: {
      //     driverId: item.driverId,
      //   },
      // });
      breakDown = item.dataValues;
      // console.log(JSON.parse(JSON.stringify(truckInfo)));
      // truckInfo.dataValues not act !!!
      // Object.assign(breakDown, JSON.parse(JSON.stringify(truckInfo)));
      row['numberOfBreakDown'] = breakDown['numberOfBreakDown'];
      row['hours'] = breakDown['hoursDriverRegister'];
      row['history'] = breakDown['historyDriverRegister'];
      row['driverName'] = breakDown['driverName'];
      row['driverMobile'] = breakDown['driverMobile'];
      row['carType'] = breakDown['type'];
      row['carNumber'] = breakDown['carNumber'];
      row['kilometer'] = breakDown['lastCarLife'];
      row['checkListStatus'] = breakDown['state'];
      row['breakDownStatus'] = breakDown['repairComment'];

      data.push(row);
    }

    return {
      status: 200,
      data: data,
      count: breakDowns.count,
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
    const truckInfo = await this.truckInfoRepository.findOne({
      where: { driverId: breakDown.dataValues.driverId },
    });
    console.log(Object.entries(truckInfo));
    data = breakDown.dataValues;
    data['dateDriver'] = breakDown.dataValues.historyDriverRegister;
    data['hoursDriver'] = breakDown.dataValues.hoursDriverRegister;
    data['driverName'] = breakDown.dataValues.driverName;
    data['carNumber'] = truckInfo.carNumber;
    data['carLife'] = truckInfo.lastCarLife;
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

  async delete(id: number) {
    let message: string;
    let status: number;
    const deleteBreakDown = await this.truckBreakDownRepository.destroy({
      where: {
        id: id,
      },
    });
    const deleteItems = await this.truckBreakDownItemsRepository.destroy({
      where: {
        id: id,
      },
    });
    if (deleteBreakDown && deleteItems) {
      message = `delete breakDown id = ${id} successfully`;
      status = 200;
    } else {
      message = `delete item id = ${id} failed`;
      status = 400;
    }

    return {
      status: status,
      message: message,
    };
  }
}
