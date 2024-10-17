import { HttpException, Injectable } from '@nestjs/common';
import { HttpStatusCode } from 'axios';
import { CheckListService } from './check-list/check-list.service';
import { OrderService } from './order/services/order.service';
import { TruckBreakDownService } from './truck-break-down/truck-break-down.service';

@Injectable()
export class AppService {
  constructor(
    private readonly checklistService: CheckListService,
    private readonly orderService: OrderService,
    private readonly truckBreakDownService: TruckBreakDownService,
  ) {}
  //PND: cron implement for end of day
  async calculateStatistics() {
    try {
      const today = this.orderService.getTime().message.result; // formate sample date: 2022/1/23
      //CHK: result
      const checkListStatistic = await this.checklistService.dailyCheckCount(
        today,
        undefined,
        undefined,
      ); // return both "register" and "unregistered" checkList
      //CHK: result
      const necessaryTruckBreakDownDaily =
        await this.truckBreakDownService.transportUserGetAll(
          'false',
          'false',
          'true',
          today,
          today,
        );

      //CHK: result
      const inprogressTruckBreakDownDaily =
        await this.truckBreakDownService.transportUserGetAll(
          'true',
          'false',
          'true',
          today,
          today,
        );
      //CHK: result
      const doneTruckBreakDownDaily =
        await this.truckBreakDownService.transportUserGetAll(
          'false',
          'true',
          'true',
          today,
          today,
        );

      return {
        checklist: checkListStatistic.data,
        truckbreakdownNecessary: necessaryTruckBreakDownDaily.data,
        truckbreakdownInprogress: inprogressTruckBreakDownDaily.data,
        truckbreakdownDone: doneTruckBreakDownDaily.data,
      };
      // PND: update result of calculates in "memcache"
      //PND: store last 7 days
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatusCode.InternalServerError);
    }
  }
}
