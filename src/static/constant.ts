interface DateStatistic {
  date?: string;
  statistics?: number;
}

export interface CalculateStatistics {
  checklist: Object;
  requiredActivities: number;
  activitiesInProgress: number;
  activitiesPerformed: number;
}

export interface Statistics {
  lastDate?: Date;
  checklistRegistered: Array<DateStatistic>;
  checklistUnRegistered: Array<DateStatistic>;
  requiredActivities: Array<DateStatistic>;
  activitiesInProgress: Array<DateStatistic>;
  activitiesPerformed: Array<DateStatistic>;
}

export const statistics: Statistics = {
  checklistRegistered: [],
  checklistUnRegistered: [],
  requiredActivities: [],
  activitiesInProgress: [],
  activitiesPerformed: [],
};
