
  import {size} from 'lodash';
  export const processBehaviour = (keys: any, values: any) => {
    const length = size(keys) - 1;
    let arrayValues = [];
    let arrayKeys = [];
    for (let i = 0, j = 0; i < length / 2; i++, j = j + 2) {
      let val: any = {};
      let labels: any = [];
      const label1 = keys[j];
      const label2 = keys[j + 1];
      val = {
        id: i + 1,
        first: values[j],
        second: values[j + 1],
      };
      arrayValues.push(val);
      arrayKeys.push([label1, label2]);
    }
    return arrayValues;
  };