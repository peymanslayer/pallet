import { Inject, Injectable } from '@nestjs/common';
import { CheckList } from './check-list.entity';
import { CheckListComment } from 'src/check-list-comment/check-list-comment.entity';

@Injectable()
export class CheckListService {
  constructor(
    @Inject('CHECKLIST_REPOSITORY')
    private readonly checkListRepository: typeof CheckList,
    @Inject('CHECKLISTCOMMENT_REPOSITORY')
    private readonly checkListCommentRepository: typeof CheckListComment,
  ) {}
  async insertCheckList(body: Object) {
    const checkList = {};
    const checkListComment = {};
    // console.log(`body: ${Object.entries(body)}`);
    const answers: [] = body['answers'];

    checkList['userId'] = body['id'];
    checkList['name'] = body['name'];
    //check key name and generate new record
    for (let item of answers) {
      checkList['answer_' + item['number']] = item['question'];
      //check answer have comment and initite checkListComment
      if (item['comment']) {
        checkListComment['comment_' + item['number']] = item['comment'];
      }
    }
    // console.log(checkListComment);
    if (Object.entries(checkListComment).length != 0) {
      // add data for inset to relation model "checkListComment"

      // console.log(checkList);
      const insertCheckList =
        await this.checkListRepository.create<CheckList>(checkList);
      checkListComment['checkListId'] = insertCheckList.id;
      console.log(checkListComment);
      const insertCheckListComment =
        await this.checkListCommentRepository.create<CheckListComment>(
          checkListComment,
        );
    } else {
      const insertCheckList =
        await this.checkListRepository.create<CheckList>(checkList);
    }

    return {
      status: 200,
      message: 'insert check list successfully',
    };
  }
}
