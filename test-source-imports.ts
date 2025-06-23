import { d, p } from '@moneyworks/utilities';

console.log('Testing source imports...');

const date = d`20250115`;
console.log('Date:', date.toString());
console.log('Add 30 days:', date.addDays(30).toString());

const period = p`202501`;
console.log('Period:', period.valueOf());

console.log('Source imports work correctly!');