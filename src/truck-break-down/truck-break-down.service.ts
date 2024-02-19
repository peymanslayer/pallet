import { Inject, Injectable } from '@nestjs/common';
import { TruckBreakDownItems } from 'src/truck-break-down-items/truck-break-down-items.entity';
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';
import { TruckInfo } from 'src/truck-info/truck-info.entity';
import { UpdateTruckBreakDownDto } from './dto/update.truck-breakdown.dto';
import { Op } from 'sequelize';
@Injectable()
export class TruckBreakDownService {
  constructor(
    @Inject('TRUCKBREAKDOWN_REPOSITORY')
    private readonly truckBreakDownRepository: typeof TruckBreakDown,
    @Inject('TRUCKBREAKDOWNITEMS_REPOSITORY')
    private readonly truckBreakDownItemsRepository: typeof TruckBreakDownItems,
    @Inject('TRUCKINFO_REPOSITORY')
    private readonly truckInfoRepository: typeof TruckInfo,
    //comment : better solution inject "truckBreakDownItem Service" instead inject "truckBreakDownItemsRepository"
    // @Inject('TRUCKBREAKDOWNITEMS_REPOSITORY')
    // private truckBreakDownItemService: typeof TruckBreakDownService,
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

  async repairUserGetAll(repairComment: string) {
    let data = [];
    let breakDowns: {
      rows: TruckBreakDown[];
      count: number;
    };

    if (repairComment === 'true') {
      breakDowns = await this.truckBreakDownRepository.findAndCountAll({
        where: { repairComment: { [Op.ne]: null } },
        order: [['id', 'DESC']],
      });
    } else {
      breakDowns = await this.truckBreakDownRepository.findAndCountAll({
        where: { repairComment: { [Op.eq]: null } },
        order: [['id', 'DESC']],
      });
    }
    console.log(breakDowns);
    for (let item of breakDowns.rows) {
      let breakDown = {};
      let row = {};

      breakDown = item.dataValues;
      row['id'] = breakDown['id'];
      row['numberOfBreakDown'] = breakDown['numberOfBreakDown'];
      row['hours'] = breakDown['hoursDriverRegister'];
      row['history'] = breakDown['historyDriverRegister'];
      row['driverName'] = breakDown['driverName'];
      row['driverMobile'] = breakDown['driverMobile'];
      row['carNumber'] = breakDown['carNumber'];
      row['kilometer'] = breakDown['carLife']; // carLife set value when driver register daily check list
      // console.log('itemsId to fetch: ', breakDown['truckBreakDownItemsId']); // debug
      row['answers'] = await this.getBreakDownItemsById(
        breakDown['truckBreakDownItemsId'],
      );
      // row['carType'] = breakDown['type']; // depricated
      // row['checkListStatus'] = breakDown['state']; // depricated
      // row['breakDownStatus'] = breakDown['repairComment']; // depricated

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
          // comment: break aim just return one of item's
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
  // comment: better solution impelement in "truckBreakDownItems" service and inject this here
  async getBreakDownItemsById(id: number) {
    let data = [];

    const res = await this.truckBreakDownItemsRepository.findOne({
      where: {
        id: id,
      },
    });
    const items = res.dataValues;
    // console.log('items fetch: ', items);

    // due to keys of field have unique number , answer_1, answer_2, ..., answe_20
    for (let item = 1; item <= 20; item++) {
      let report = {};
      //  console.log(items[`answer_${item}`]); // debug
      if (items[`answer_${item}`] != null) {
        report['type'] = items[`type_${item}`];
        report['comment'] = items[`answer_${item}`];
        report['number'] = item;
        // console.log('reoprt: ', report); // debug
        data.push(report);
      }
    }

    return data;
  }

  async update(id: number, body: UpdateTruckBreakDownDto) {
    const res = await this.truckBreakDownRepository.update(
      {
        ...body,
      },
      {
        where: { id: id },
      },
    );

    if (res[0] > 0) {
      return {
        status: 200,
        message: 'update successfully',
      };
    } else {
      return {
        status: 500,
        message: 'update failed',
      };
    }
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
