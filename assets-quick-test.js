// Quick verification test
const fs = require('fs');
console.log('📊 Assets Canonical Ontology Verification');
console.log('File size:', fs.statSync('generated/moneyworks-assets-canonical-ontology.ts').size, 'bytes');
const content = fs.readFileSync('generated/moneyworks-assets-canonical-ontology.ts', 'utf8');
console.log('Field definitions:', (content.match(/fieldName:/g) || []).length);
console.log('Relationships:', (content.match(/relationshipType:/g) || []).length);
console.log('Business rules:', (content.match(/ruleType:/g) || []).length);
console.log('Usage patterns:', (content.match(/scenario:/g) || []).length);
console.log('Validation functions:', (content.match(/export function/g) || []).length);
console.log('✅ Assets ontology verification complete');
