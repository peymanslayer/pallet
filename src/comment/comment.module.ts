<<<<<<< HEAD
import { Module } from '@nestjs/common';
import { CommentController } from './controller/comment.controller';
import { CommentService } from './services/comment.service';
import { CommentProviders } from './comment.provider';

@Module({
  imports: [],
  controllers: [CommentController],
  providers: [CommentService,...CommentProviders],
  exports:[CommentService]
})
export class CommentModule {}
=======
import { Module } from '@nestjs/common';
import { CommentController } from './controller/comment.controller';
import { CommentService } from './services/comment.service';
import { CommentProviders } from './comment.provider';

@Module({
  imports: [],
  controllers: [CommentController],
  providers: [CommentService,...CommentProviders],
  exports:[CommentService]
})
export class CommentModule {}
>>>>>>> 06d6f4c440da2b182c6703835946f16d97950290
