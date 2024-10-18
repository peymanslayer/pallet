import { HttpException, Injectable } from '@nestjs/common';
import { HttpStatusCode } from 'axios';
import { CheckListService } from './check-list/check-list.service';
import { OrderService } from './order/services/order.service';
import { TruckBreakDownService } from './truck-break-down/truck-break-down.service';
import { statistics } from './static/constant';

@Injectable()
export class AppService {
  constructor(
    private readonly checklistService: CheckListService,
    private readonly orderService: OrderService,
    private readonly truckBreakDownService: TruckBreakDownService,
  ) {}
  //PND: cron implement for end of day test
  async calculateStatistics(day: string, dateFront: string) {
    try {
      // const today = this.orderService.getTime().message.result; // formate sample date: 2022/1/23
      //CHK: result test

      const checkListStatistic = await this.checklistService.dailyCheckCount(
        day,
        undefined,
        undefined,
      ); // return both "register" and "unregistered" checkList
      //CHK: result
      const necessaryTruckBreakDownDaily =
        await this.truckBreakDownService.transportUserGetAll(
          'false',
          'false',
          'true',
          day,
          day,
        );

      //CHK: result
      const inprogressTruckBreakDownDaily =
        await this.truckBreakDownService.transportUserGetAll(
          'true',
          'false',
          'true',
          day,
          day,
        );
      //CHK: result
      const doneTruckBreakDownDaily =
        await this.truckBreakDownService.transportUserGetAll(
          'false',
          'true',
          'true',
          day,
          day,
        );

      statistics.checklistRegistered.push({
        date: dateFront,
        statistics: checkListStatistic.data['countRegister'],
      });
      statistics.checklistUnRegistered.push({
        date: dateFront,
        statistics: checkListStatistic.data['countUnRegister'],
      });
      statistics.requiredActivities.push({
        date: dateFront,
        statistics: necessaryTruckBreakDownDaily.data as number,
      });
      statistics.activitiesInProgress.push({
        date: dateFront,
        statistics: inprogressTruckBreakDownDaily.data as number,
      });
      statistics.activitiesPerformed.push({
        date: dateFront,
        statistics: doneTruckBreakDownDaily.data as number,
      });
      // return {
      //   checklist: checkListStatistic.data,
      //   truckbreakdownNecessary: necessaryTruckBreakDownDaily.data,
      //   truckbreakdownInprogress: inprogressTruckBreakDownDaily.data,
      //   truckbreakdownDone: doneTruckBreakDownDaily.data,
      // };
      // PND: update result of calculates in "memcache"
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatusCode.InternalServerError);
    }
  }

  async calculateSevenLastDayStatistics() {
    // const lastSevenDaysDate: string[] = [];
    const today = new Date();
    let customDay = new Date();
    if (!statistics.checklistRegistered.length) {
      for (let dayOffset = 6; dayOffset > -1; dayOffset--) {
        customDay.setDate(today.getDate() - dayOffset);
        // console.log('generate custom day: ', customDay);
        const date = this.orderService.getTime(customDay).message.result;
        await this.calculateStatistics(date, customDay.toISOString());
        // lastSevenDaysDate.push(date);
      }
    }

    return statistics;
  }
}
