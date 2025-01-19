import { latinToPersianMap, persianToLatinMap } from "./enum";

export function convertPersianToLatin(input) {
    return input.split('').map(char => persianToLatinMap[char] || char).join('');
}

export function convertLatinToPersian(input) {
    let output = input;
    for (const [latin, persian] of Object.entries(latinToPersianMap)) {
      output = output.split(latin).join(persian);
    }
    return output;
  }
  