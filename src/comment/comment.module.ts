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
