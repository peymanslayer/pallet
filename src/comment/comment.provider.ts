import { Comment } from "./comment..entity";

export const CommentProviders = [
  {
    provide: 'COMMENT_REPOSITORY',
    useValue: Comment,
  },
];