import { eq } from 'drizzle-orm';
import { db } from '..';
import logger from '../../observability/logger';
import { seeds } from '../drizzle/schema';

const allSeeds = ['0001-categories.ts'];

async function runAllSeeds() {
  logger.info('🚀 Starting database seeding...');
  try {
    const seedsToRun = allSeeds.sort();
    for (const seed of seedsToRun) {
      await runSeed(seed);
    }

    logger.info('✅ All seeds completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

runAllSeeds();

async function runSeed(seed: string) {
  try {
    const seedModule = require(`./${seed}`);

    await db.transaction(async (tx) => {
      const seedExists = await tx
        .select()
        .from(seeds)
        .where(eq(seeds.fileName, '0001-categories'))
        .limit(1);

      if (seedExists.length > 0) {
        return;
      }

      await seedModule.default(tx);
    });
  } catch (error) {
    logger.error(`❌ Failed to run seed: ${seed}: `, error);
    process.exit(1);
  }
}
