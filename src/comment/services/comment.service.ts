<<<<<<< HEAD
import { Inject, Injectable } from '@nestjs/common';
import { Comment } from '../comment..entity';
import { InsertCommentDto } from '../dto/insert.comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @Inject('COMMENT_REPOSITORY')
    private readonly commentRepository: typeof Comment,
  ) {}

  async insertComment(comment:string,id:number) {
    const insertComment = await this.commentRepository.create({
     shopId:id,
     comment:comment
  });
    if (insertComment) {
      return {
        status: 200,
        message: insertComment,
      };
    } else {
      return {
        status: 400,
        message: 'comment not created',
      };
    }
  }

  async findCommentByShopId(shopId:number){
    const find=await this.commentRepository.findOne({where:{shopId:shopId}});
    return find
  }

}
=======
import { Inject, Injectable } from '@nestjs/common';
import { Comment } from '../comment..entity';
import { InsertCommentDto } from '../dto/insert.comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @Inject('COMMENT_REPOSITORY')
    private readonly commentRepository: typeof Comment,
  ) {}

  async insertComment(comment:string,id:number) {
    const insertComment = await this.commentRepository.create({
     shopId:id,
     comment:comment
  });
    if (insertComment) {
      return {
        status: 200,
        message: insertComment,
      };
    } else {
      return {
        status: 400,
        message: 'comment not created',
      };
    }
  }

  async findCommentByShopId(shopId:number){
    const find=await this.commentRepository.findOne({where:{shopId:shopId}});
    return find
  }

}
>>>>>>> 06d6f4c440da2b182c6703835946f16d97950290
