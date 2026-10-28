import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const info = await prisma.$queryRawUnsafe('PRAGMA table_info(abner_abnercitytvmodel);');
  console.log('Columns in actual db.sqlite3 for abner_abnercitytvmodel:');
  console.log(info.map(c => `${c.name} (${c.type})`));
}

main().finally(() => prisma.$disconnect());
