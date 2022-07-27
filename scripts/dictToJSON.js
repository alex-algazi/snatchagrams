const fs = require('fs');

const input = './assets/NWL2020.txt';
const output = './assets/NWL2020.json';
// const input = './assets/CSW21.txt';
// const output = './assets/CSW21.json';

const arr = fs.readFileSync(input).toString().split('\n');
const obj = {};

for (i in arr) {
  let def = arr[i];
  obj[`${def.split(' ')[0]}`] = `${def.substring(def.indexOf(' ')+1, def.length-1)}`;
}

let data = JSON.stringify(obj, null, 2);
fs.writeFileSync(output, data);
