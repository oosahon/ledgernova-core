import IDbService from '../../app/contracts/infra/db.contract';
import { db } from '../db';

const dbService: IDbService = {
  async runInTransaction(fn) {
    await db.transaction(async (tx) => {
      await fn(tx);
    });
  },
};

export default dbService;
