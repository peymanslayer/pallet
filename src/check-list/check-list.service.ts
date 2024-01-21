import { Inject, Injectable } from '@nestjs/common';
import { CheckList } from './check-list.entity';
// import { InsertCheckListDto } from './dto/inser.checkList.tDto';

@Injectable()
export class CheckListService {
  // constructor(
  //   @Inject('CHECKLIST_REPOSITORY')
  //   private readonly checkListRepository: typeof CheckList,
  // ) {}
  // async insertCheckList(body: Array<object>) {
  //   const checkList = {};
  //   const checkListComment = {};
  //   //check key name and generate new record
  //   for (let item of body) {
  //     checkList['answer_' + body.indexOf(item)] =
  //       item['question_' + body.indexOf(item)];
  //     checkListComment['comment_' + body.indexOf(item)] = item['comment'];
  //   }
  //   const insertCheckList =
  //     await this.checkListRepository.create<CheckList>(checkList);
  // }
}
