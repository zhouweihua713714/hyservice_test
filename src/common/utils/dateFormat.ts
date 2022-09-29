import { Picker_Enum } from '../enums/common.enum';

export const dateFormat = (date: Date, type: string): string => {
  const d = new Date(date),
    year = d.getFullYear();
  let month;
  let day;
  month = '' + (d.getMonth() + 1);
  day = '' + d.getDate();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  if (type === Picker_Enum.Month) {
    return [year, month].join('-');
  }
  return [year, month, day].join('-');
};
