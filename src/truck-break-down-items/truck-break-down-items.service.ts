import { Inject, Injectable } from '@nestjs/common';
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';
import { TruckBreakDownItems } from './truck-break-down-items.entity';

@Injectable()
export class TruckBreakDownItemsService {
  constructor(
    @Inject('TRUCKBREAKDOWN_REPOSITORY')
    private readonly truckBreakDownRepository: typeof TruckBreakDown,
    @Inject('TRUCKBREAKDOWNITEMS_REPOSITORY')
    private readonly truckBreakDownItemsRepository: typeof TruckBreakDownItems,
  ) {}

  async insertTruckBreakDownItems(body: Object) {
    const breakDownItems = {};
    const breakDown = {};
    const answers: [] = body['answers'];

    breakDown['hoursDriverRegister'] = body['hours'];
    breakDown['historyDriverRegister'] = body['date'];
    breakDown['driverName'] = body['name'];
    breakDown['driverId'] = body['id'];
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
