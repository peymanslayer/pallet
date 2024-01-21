import { CheckListComment } from './check-list-comment.entity';

export const CheckListCommentProviders = [
  {
    provide: 'CHECKLISTCOMMENT_REPOSITORY',
    useValue: CheckListComment,
  },
];
