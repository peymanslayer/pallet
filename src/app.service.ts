import { HttpException, Injectable } from '@nestjs/common';
import { HttpStatusCode } from 'axios';
import { CheckListService } from './check-list/check-list.service';
import { OrderService } from './order/services/order.service';
import { TruckBreakDownService } from './truck-break-down/truck-break-down.service';
import { CalculateStatistics, Statistics, statistics } from './static/constant';

@Injectable()
export class AppService {
  constructor(
    private readonly checklistService: CheckListService,
    private readonly orderService: OrderService,
    private readonly truckBreakDownService: TruckBreakDownService,
  ) {}
  //PND: cron implement for end of day test

  async calculateStatisticsOnDateCustomFormat(
    dateCustomFormat: string,
  ): Promise<CalculateStatistics> {
    try {
      const checkListStatistic = await this.checklistService.dailyCheckCount(
        dateCustomFormat,
        undefined,
        undefined,
      ); // return both "register" and "unregistered" checkList

      const necessaryTruckBreakDownDaily =
        await this.truckBreakDownService.transportUserGetAll(
          'false',
          'false',
          'true',
          dateCustomFormat,
          dateCustomFormat,
        );

      const inprogressTruckBreakDownDaily =
        await this.truckBreakDownService.transportUserGetAll(
          'true',
          'false',
          'true',
          dateCustomFormat,
          dateCustomFormat,
        );

      const doneTruckBreakDownDaily =
        await this.truckBreakDownService.transportUserGetAll(
          'false',
          'true',
          'true',
          dateCustomFormat,
          dateCustomFormat,
        );
      return {
        checklist: checkListStatistic.data,
        activitiesInProgress: inprogressTruckBreakDownDaily.data as number,
        activitiesPerformed: doneTruckBreakDownDaily.data as number,
        requiredActivities: necessaryTruckBreakDownDaily.data as number,
      };
    } catch (err) {
      console.log(err);
    }
  }
  async insertStatistics(
    dateIsoFormat: string,
    calculateStatistics: CalculateStatistics,
  ) {
    try {
      // const today = this.orderService.getTime().message.result; // formate sample date: 2022/1/23

      statistics.checklistRegistered.push({
        date: dateIsoFormat,
        statistics: calculateStatistics.checklist['countRegister'],
      });
      statistics.checklistUnRegistered.push({
        date: dateIsoFormat,
        statistics: calculateStatistics.checklist['countUnRegister'],
      });
      statistics.requiredActivities.push({
        date: dateIsoFormat,
        statistics: calculateStatistics.requiredActivities,
      });
      statistics.activitiesInProgress.push({
        date: dateIsoFormat,
        statistics: calculateStatistics.activitiesInProgress,
      });
      statistics.activitiesPerformed.push({
        date: dateIsoFormat,
        statistics: calculateStatistics.activitiesPerformed,
      });

      statistics.lastDate = new Date();

      // PND: update result of calculates in "memcache"
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatusCode.InternalServerError);
    }
  }

  async updateLatestStatistics(
    dateIsoFormat: string,
    calculateStatistics: CalculateStatistics,
  ) {
    try {
      statistics.checklistRegistered[6] = {
        date: dateIsoFormat,
        statistics: calculateStatistics.checklist['countRegister'],
      };
      statistics.checklistUnRegistered[6] = {
        date: dateIsoFormat,
        statistics: calculateStatistics.checklist['countUnRegister'],
      };
      statistics.requiredActivities[6] = {
        date: dateIsoFormat,
        statistics: calculateStatistics.requiredActivities,
      };
      statistics.activitiesInProgress[6] = {
        date: dateIsoFormat,
        statistics: calculateStatistics.activitiesInProgress,
      };
      statistics.activitiesPerformed[6] = {
        date: dateIsoFormat,
        statistics: calculateStatistics.activitiesPerformed,
      };
    } catch (err) {
      console.log(err);
    }
  }

  shiftfirstestStatistics() {
    try {
      //CHK: is correct this ?
      // Object.keys(statistics).forEach((item) => {
      //   statistics[item].shift();
      // });
      statistics.checklistRegistered.shift();
      statistics.checklistUnRegistered.shift();
      statistics.requiredActivities.shift();
      statistics.activitiesInProgress.shift();
      statistics.activitiesPerformed.shift();
    } catch (err) {
      console.log(err);
    }
  }

  async calculateSevenLastDayStatistics() {
    let customDay = new Date();
    const tody = new Date();
    if (statistics.checklistRegistered.length) {
      if (tody.getDay() === statistics.lastDate.getDay()) {
        console.log('generate update last day');
        const dateCustomFormat =
          this.orderService.getTime(customDay).message.result;
        const calculateStatistics =
          await this.calculateStatisticsOnDateCustomFormat(dateCustomFormat);
        await this.updateLatestStatistics(
          customDay.toISOString(),
          calculateStatistics,
        );
      } else {
        console.log('generate shift date');
        const dateCustomFormat =
          this.orderService.getTime(customDay).message.result;
        const calculateStatistics =
          await this.calculateStatisticsOnDateCustomFormat(dateCustomFormat);

        this.shiftfirstestStatistics();
        await this.insertStatistics(
          customDay.toISOString(),
          calculateStatistics,
        );
        //pop first index and push new statistics
      }
    } else {
      console.log('generate last 7 days');
      for (let dayOffset = 6; dayOffset > -1; dayOffset--) {
        customDay.setDate(tody.getDate() - dayOffset);
        // console.log('generate custom day: ', customDay);
        const dateCustomFormat =
          this.orderService.getTime(customDay).message.result;
        const calculateStatistics =
          await this.calculateStatisticsOnDateCustomFormat(dateCustomFormat);
        await this.insertStatistics(
          customDay.toISOString(),
          calculateStatistics,
        );
      }
    }

    return statistics;
  }
}
