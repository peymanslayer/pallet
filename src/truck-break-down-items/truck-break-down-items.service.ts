import { Inject, Injectable } from '@nestjs/common';
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';
import { TruckBreakDownItems } from './truck-break-down-items.entity';
import { TruckInfo } from 'src/truck-info/truck-info.entity';

@Injectable()
export class TruckBreakDownItemsService {
  constructor(
    @Inject('TRUCKBREAKDOWN_REPOSITORY')
    private readonly truckBreakDownRepository: typeof TruckBreakDown,
    @Inject('TRUCKBREAKDOWNITEMS_REPOSITORY')
    private readonly truckBreakDownItemsRepository: typeof TruckBreakDownItems,
    @Inject('TRUCKINFO_REPOSITORY')
    private readonly truckInfoRepository: typeof TruckInfo,
  ) {}

  async insertTruckBreakDownItems(body: Object) {
    const breakDownItems = {};
    const breakDown = {};
    const answers: [] = body['answers'];
    const truckInfo = await this.truckInfoRepository.findOne({
      where: { driverId: body['id'] },
    });
    console.log(Object.entries(truckInfo));
    breakDown['hoursDriverRegister'] = body['hours'];
    breakDown['historyDriverRegister'] = body['date'];
    breakDown['driverName'] = body['name'];
    breakDown['driverId'] = body['id'];
    breakDown['carLife'] = truckInfo.lastCarLife || null;
    breakDown['carNumber'] = truckInfo.number || null;
    breakDown['numberOfBreakDown'] = (await this.lastNumberOfBreakDown()) + 1;

    // console.log(breakDown['numberOfBreakDown']);
    for (let item of answers) {
      breakDownItems['answer_' + item['number']] = item['comment'];
      breakDownItems['type_' + item['number']] = item['type'];
    }
    const insertItems =
      await this.truckBreakDownItemsRepository.create<TruckBreakDownItems>(
        breakDownItems,
      );
    if (insertItems) {
      breakDown['truckBreakDownItemsId'] = insertItems.id;
      const insertBreakDown =
        await this.truckBreakDownRepository.create<TruckBreakDown>(breakDown);
    }
    return {
      status: 200,
      message: 'insert report truck breakdown  successfully',
    };
  }

  async updateByDriver(id: number, body: any) {
    let message: string;
    let status: number;
    const breakDownItems = {};
    const answers: [] = body['answers'];
    // for frontEnd developer solution !!!!
    for (let item = 0; item <= 20; item++) {
      breakDownItems['answer_' + item] = null;
      breakDownItems['type_' + item] = null;
    }
    const restToNullBreakDown = await this.truckBreakDownItemsRepository.update(
      breakDownItems,
      { where: { id: id } },
    );

    for (let item of answers) {
      breakDownItems['answer_' + item['number']] = item['comment'];
      breakDownItems['type_' + item['number']] = item['type'];
    }
    const updateBreakDown = await this.truckBreakDownItemsRepository.update(
      breakDownItems,
      { where: { id: id } },
    );

    if (updateBreakDown) {
      message = `update breakDown id = ${id} successfully`;
      status = 200;
    } else {
      message = `update item id = ${id} failed`;
      status = 400;
    }
    return {
      status: status,
      message: message,
    };
  }

  async lastNumberOfBreakDown() {
    const lastBreakDown = await this.truckBreakDownRepository.findOne({
      where: {},
      include: [{ all: true }],
      order: [['numberOfBreakDown', 'DESC']],
      limit: 1,
    });
    if (!lastBreakDown) {
      return 100;
    } else {
      return lastBreakDown.numberOfBreakDown;
    }
  }
}
