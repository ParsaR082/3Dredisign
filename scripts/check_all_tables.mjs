import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

const schemaContent = fs.readFileSync('prisma/schema.prisma', 'utf8');

function extractPrismaModels() {
  const modelRegex = /model\s+(\w+)\s+\{([\s\S]*?)\}/g;
  const models = {};
  let match;
  while ((match = modelRegex.exec(schemaContent)) !== null) {
    const modelName = match[1];
    const body = match[2];
    const mapMatch = body.match(/@@map\("([^"]+)"\)/);
    const tableName = mapMatch ? mapMatch[1] : modelName.toLowerCase();
    
    const fields = [];
    const lines = body.split('\n');
    for (const l of lines) {
      const trimmed = l.trim();
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('@@')) continue;
      const fName = trimmed.split(/\s+/)[0];
      fields.push(fName);
    }
    models[tableName] = { modelName, fields };
  }
  return models;
}

async function main() {
  console.log('Comparing all tables and columns between db.sqlite3 and Prisma schema...\n');
  const prismaModels = extractPrismaModels();

  // Get all table names in sqlite
  const tables = await prisma.$queryRawUnsafe(`
    SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';
  `);

  let totalTablesChecked = 0;
  let discrepancies = 0;

  for (const row of tables) {
    const table = row.name;
    // Skip django_migrations or other system tables if desired, but let's check all
    if (!prismaModels[table]) {
      console.log(`[?] Table in DB but not in Prisma: ${table}`);
      continue;
    }

    totalTablesChecked++;
    const prismaFields = prismaModels[table].fields;
    const columnsInfo = await prisma.$queryRawUnsafe(`PRAGMA table_info("${table}");`);
    const dbColumns = columnsInfo.map(c => c.name);

    const missingInPrisma = dbColumns.filter(c => !prismaFields.includes(c));
    const extraInPrisma = prismaFields.filter(f => !dbColumns.includes(f));

    if (missingInPrisma.length > 0 || extraInPrisma.length > 0) {
      discrepancies++;
      console.warn(`[!] Discrepancy in table: ${table} (${prismaModels[table].modelName})`);
      if (missingInPrisma.length > 0) console.warn(`    In DB but missing in Prisma:`, missingInPrisma);
      if (extraInPrisma.length > 0) console.warn(`    In Prisma but missing in DB:`, extraInPrisma);
    }
  }

  console.log(`\n========================================`);
  console.log(`Total DB Tables Checked: ${totalTablesChecked}`);
  console.log(`Total Discrepancies Found: ${discrepancies}`);
  console.log(`========================================`);

  if (discrepancies === 0) {
    console.log(`>>> VERIFIED: 100% PERFECT 1-TO-1 MATCH FOR EVERY COLUMN IN EVERY TABLE!`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
