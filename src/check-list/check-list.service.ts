import { Inject, Injectable } from '@nestjs/common';
import { CheckList } from './check-list.entity';
import { CheckListComment } from 'src/check-list-comment/check-list-comment.entity';
import { TruckInfo } from 'src/truck-info/truck-info.entity';
import { CarNumber } from '../enum';
@Injectable()
export class CheckListService {
  constructor(
    @Inject('CHECKLIST_REPOSITORY')
    private readonly checkListRepository: typeof CheckList,
    @Inject('CHECKLISTCOMMENT_REPOSITORY')
    private readonly checkListCommentRepository: typeof CheckListComment,
    @Inject('TRUCKINFO_REPOSITORY')
    private readonly truckInfoRepository: typeof TruckInfo,
  ) {}
  async insertCheckList(body: Object) {
    const checkList = {};
    const checkListComment = {};
    const answers: [] = body['answers'];

    checkList['userId'] = body['id'];
    checkList['name'] = body['name'];
    checkList['hours'] = body['hours'];
    checkList['history'] = body['date'];
    //check key name and generate new record
    for (let item of answers) {
      checkList['answer_' + item['number']] = item['question'];
      //check answer have comment and initite checkListComment
      if (item['comment']) {
        checkListComment['comment_' + item['number']] = item['comment'];
      }
    }

    const insertCheckList =
      await this.checkListRepository.create<CheckList>(checkList);
    // console.log(checkListComment); //debug
    if (Object.entries(checkListComment).length != 0) {
      // add data for inset to relation model "checkListComment"
      // console.log(checkList); // debug
      checkListComment['checkListId'] = insertCheckList.id;
      // console.log(checkListComment); //debug
      const insertCheckListComment =
        await this.checkListCommentRepository.create<CheckListComment>(
          checkListComment,
        );

      // update lastCarLife  in "truck_info"
      // check answered kilometer ; "answer_0" is kilometer number of truck
      // console.log(CarNumber[`id${checkList['userId']}`]); // debug
      const updateTruckInfo = await this.truckInfoRepository.update(
        {
          lastCarLife: checkList['answer_0'],
          carNumber: CarNumber[`id${checkList['userId']}`],
        },
        {
          where: {
            driverId: checkList['userId'],
          },
        },
      );
      // console.log(updateTruckInfo[0]); // debug "updateTruckInfo[0]" number of affected on row's with this update
      if (updateTruckInfo[0] == 0) {
        const createTruckInfo = await this.truckInfoRepository.create({
          lastCarLife: checkList['answer_0'],
          carNumber: CarNumber[`id${checkList['userId']}`],
          driverId: checkList['userId'],
        });
      }

      return {
        status: 200,
        message: 'insert check list successfully',
      };
    }
  }

  async getllByDriverId(userId: number) {
    // return data : [{date,hours,answers[orderby number]}]
    let data = [];
    let check = {};
    let answers = [];
    //get all of checklist of user checklists
    const res = await this.checkListRepository.findAndCountAll({
      where: { userId: userId },
      order: [['id', 'DESC']],
    });
    const allCheckList = res.rows;

    // for each chklst add answers to data[x].answers
    for (let checkList of allCheckList) {
      // console.log(Object.entries(checkList));

      // const allComment = await this.checkListCommentRepository.findOne({
      //   where: { checkListId: checkList.id },
      // });
      // make answers and comments of question
      // for (let item = 1; item <= 21; item++) {
      //   let answer = {};
      //   // console.log(items[`answer_${item}`]);
      //   answer['answer'] = checkList[`answer_${item}`];
      //   answer['comment'] = allComment[`comment_${item}`];
      //   answer['number'] = item;
      //   answers.push(answer);
      // }
      const info = checkList.dataValues;

      // check = info;
      check['id'] = info['id'];
      check['date'] = info['history'];
      check['hours'] = info['hours'];
      check['userId'] = info['userId'];
      check['name'] = info['name'];
      // check['answers'] = answers;

      data.push(check);
    }

    return {
      status: 200,
      data: data,
      message: `get all check list of driver : ${check['name']}`,
    };
  }
}
