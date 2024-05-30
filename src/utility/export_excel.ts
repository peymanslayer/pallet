/**
 @Params "fields" list of field's to column of excel file ; Array<string>
 @Params "rows" data fetch from db ; Array<any>
 @output  data insert to excel file ; Array<object>
 @hint key name and key name of fields in data adaptation
 * 
 */

export function generateDataExcel(fields: Array<string>, rows: Array<any>) {
  const data = [];

  for (let row of rows) {
    let recordExcel = {};
    for (let key of fields) {
      recordExcel[key] = row[key];
    }
    data.push(recordExcel);
  }

  return data;
}
