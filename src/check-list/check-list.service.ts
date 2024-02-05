import { Inject, Injectable } from '@nestjs/common';
import { CheckList } from './check-list.entity';
import { CheckListComment } from 'src/check-list-comment/check-list-comment.entity';
import { TruckInfo } from 'src/truck-info/truck-info.entity';
import { Op } from 'sequelize';
import { CHECKLIST_ANSWERS } from 'src/enum';
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
    //compute lowest answer's

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
          state: this.lowestValueCheckList(Object.values(checkList)),
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
          driverId: checkList['userId'],
          state: this.lowestValueCheckList(Object.values(checkList)),
        });
      }
    }
    return {
      status: 200,
      message: 'insert check list successfully',
    };
  }
  lowestValueCheckList(answers: string[]) {
    let lowest: string;
    console.log('answer list to check lowest', answers);
    if (answers.includes(CHECKLIST_ANSWERS.GOOD)) {
      lowest = CHECKLIST_ANSWERS.GOOD;
    }
    if (answers.includes(CHECKLIST_ANSWERS.MID)) {
      lowest = CHECKLIST_ANSWERS.MID;
    }
    if (answers.includes(CHECKLIST_ANSWERS.BAD)) {
      lowest = CHECKLIST_ANSWERS.BAD;
    }
    return lowest;
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
      const info = checkList.dataValues;

      check['id'] = info['id'];
      check['date'] = info['history'];
      check['hours'] = info['hours'];
      check['userId'] = info['userId'];
      check['name'] = info['name'];

      data.push(check);
    }

    return {
      status: 200,
      data: data,
      message: `get all check list of driver : ${check['name']}`,
    };
  }

  async getAnswers(checkListId: number) {
    let data = [];

    const checkList = await this.checkListRepository.findOne({
      where: {
        id: checkListId,
      },
    });
    const comment = await this.checkListCommentRepository.findOne({
      where: {
        checkListId: checkListId,
      },
    });

    for (let item = 0; item <= 20; item++) {
      let check = {};
      check['answer'] = checkList[`answer_${item}`];
      // for answer's not have record comment , user not set any comment when answered
      if (!comment) {
        check['comment'] = null;
      } else {
        check['comment'] = comment[`comment_${item}`];
      }
      check['number'] = item;
      data.push(check);
    }

    return {
      status: 200,
      data: data,
      message: `data of check list id = ${checkListId} `,
    };
  }

  async dailyCheck(userId: number, date: string) {
    let check = false; // default not register daily check

    const checkList = await this.checkListRepository.count({
      where: { [Op.and]: { userId: userId, history: date } },
    });

    if (checkList === 1) {
      check = true;
    }

    return {
      data: check,
      status: 200,
      message: `status of driver registered daily checklist, hint: false -> unregistered `,
    };
  }

  async removeCheckList(id: number) {
    const removeCheckList = await this.checkListRepository.destroy({
      where: {
        id: id,
      },
    });

    const removeComment = await this.checkListCommentRepository.destroy({
      where: {
        checkListId: id,
      },
    });

    return { status: 200, message: 'reomve checkList successfully' };
  }
}
