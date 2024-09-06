import { HUMANREADABLE_EXCEL_VALUE } from 'src/static/enum';
/**
 @Params "fields" list of field's to column of excel file ; Array<string>
 @Params "rows" data fetch from db ; Array<any>
 @output  data insert to excel file ; Array<object>
 @hint key name and key name of fields in data adaptation
 * 
 */

export function generateDataExcel(
  fieldsToExport: Array<string>,
  rows: Array<any>,
) {
  const data = [];
  const fieldMustReadable = [
    'logisticConfirm',
    'transportComment',
    'history', // ~= "historyDriverRegister" in rows ( name of field in schema)
    'state',
    'historySendToRepair',
    'historyReciveToRepair',
    'historyDeliveryDriver',
  ];
  for (let row of rows) {
    console.log(row);
    let recordExcel = {};
    for (let field of fieldsToExport) {
      //console.log('row[key]:', field); // #debug
      if (fieldMustReadable.includes(field)) {
        recordExcel[field] = convertToReadable(row[field]);
      } else recordExcel[field] = row[field];
    }
    data.push(recordExcel);
  }

  return data;
}

function convertToReadable(value: string) {
  let replaceValue: string;
  // console.log('value pass to convert', value); // #DEBUG
  //hint; "'' + value "  convert boolean value to string
  const valueStr = '' + value;
  switch (valueStr) {
    case 'false':
      replaceValue = HUMANREADABLE_EXCEL_VALUE.false;
      break;

    case 'true':
      replaceValue = HUMANREADABLE_EXCEL_VALUE.true;
      break;

    case 'necessary':
      replaceValue = HUMANREADABLE_EXCEL_VALUE.necessary;
      break;

    case 'notNecessary':
      replaceValue = HUMANREADABLE_EXCEL_VALUE.notNecessary;
      break;

    case 'immediately':
      replaceValue = HUMANREADABLE_EXCEL_VALUE.immediately;
      break;

    case String(valueStr.match(/.*\/.*\/.*/)):
      replaceValue = new Date(`'${valueStr}'`).toLocaleDateString('fa-IR');
      break;

    case 'weak':
      replaceValue = 'بد';
      break;

    case 'medium':
      replaceValue = 'متوسط';
      break;

    case 'good':
      replaceValue = 'خوب';
      break;

    default:
      replaceValue = value;
  }

  return replaceValue;
}
