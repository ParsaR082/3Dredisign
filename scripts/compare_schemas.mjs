import fs from 'fs';

const sqliteSchema = fs.readFileSync('prisma/schema.prisma', 'utf8');
const pgSchema = fs.readFileSync('prisma/schema.postgresql.prisma', 'utf8');

function extractModels(content) {
  const modelRegex = /model\s+(\w+)\s+\{([\s\S]*?)\}/g;
  const models = {};
  let match;
  while ((match = modelRegex.exec(content)) !== null) {
    const modelName = match[1];
    const body = match[2];
    const fields = [];
    const lines = body.split('\n');
    for (const l of lines) {
      const trimmed = l.trim();
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('@@')) continue;
      const fName = trimmed.split(/\s+/)[0];
      fields.push(fName);
    }
    models[modelName] = fields;
  }
  return models;
}

const sqliteModels = extractModels(sqliteSchema);
const pgModels = extractModels(pgSchema);

console.log('Comparing SQLite schema and PostgreSQL schema:');
let diffCount = 0;

for (const [model, fields] of Object.entries(sqliteModels)) {
  if (!pgModels[model]) {
    console.error(`Missing model in PostgreSQL schema: ${model}`);
    diffCount++;
    continue;
  }
  const pgFields = pgModels[model];
  const missingInPg = fields.filter(f => !pgFields.includes(f));
  const extraInPg = pgFields.filter(f => !fields.includes(f));
  if (missingInPg.length > 0 || extraInPg.length > 0) {
    diffCount++;
    console.warn(`Discrepancy in model ${model}:`);
    if (missingInPg.length > 0) console.warn('  Missing in PG:', missingInPg);
    if (extraInPg.length > 0) console.warn('  Extra in PG:', extraInPg);
  }
}

console.log(`\nModels checked: ${Object.keys(sqliteModels).length}`);
console.log(`Discrepancies found: ${diffCount}`);
if (diffCount === 0) {
  console.log('>>> 100% IDENTICAL SCHEMAS ACROSS SQLITE AND POSTGRESQL!');
}
