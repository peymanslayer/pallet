import { CheckList } from './check-list.entity';

export const CheckListProviders = [
  {
    provide: 'CHECKLIST_REPOSITORY',
    useValue: CheckList,
  },
];
