interface DateStatistic {
  date?: string;
  statistics?: number;
}

export interface Statistics {
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
