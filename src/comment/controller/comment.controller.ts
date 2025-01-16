<<<<<<< HEAD
import { Controller, Get,Body,Res ,Post, Delete } from '@nestjs/common';
import { CommentService } from '../services/comment.service';
import { InsertCommentDto } from '../dto/insert.comment.dto';
import { Response } from 'express';

@Controller()
export class CommentController{
  constructor(private readonly commentService:CommentService) {}
  @Post('/api/insertComment')
  async insertComment(@Body() body:InsertCommentDto,@Res() response:Response ){
  try{
   const insertComment=await this.commentService.insertComment(body.comment,body.shopId);
   response.status(insertComment.status).json(insertComment.message)
  }catch(err){
    response.status(500).json('internal server errror')
  }
}

=======
import { Controller, Get,Body,Res ,Post, Delete } from '@nestjs/common';
import { CommentService } from '../services/comment.service';
import { InsertCommentDto } from '../dto/insert.comment.dto';
import { Response } from 'express';

@Controller()
export class CommentController{
  constructor(private readonly commentService:CommentService) {}
  @Post('/api/insertComment')
  async insertComment(@Body() body:InsertCommentDto,@Res() response:Response ){
  try{
   const insertComment=await this.commentService.insertComment(body.comment,body.shopId);
   response.status(insertComment.status).json(insertComment.message)
  }catch(err){
    response.status(500).json('internal server errror')
  }
}

>>>>>>> 06d6f4c440da2b182c6703835946f16d97950290
}