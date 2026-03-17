import { AsyncLocalStorage } from 'node:async_hooks';
import IStorage from '../../app/contracts/storage/store.contract';
import { IStore } from '../../shared/types/store.types';
import ILogger from '../../app/contracts/infra-services/logger.contract';

const asyncLocalStorage = new AsyncLocalStorage<IStore>();

export default function storageService(logger: ILogger): IStorage {
  return {
    init(store, callback) {
      asyncLocalStorage.run(store, callback);
    },

    get() {
      const store = asyncLocalStorage.getStore();

      if (!store) {
        logger.error('Store not found');
        throw new Error('Store not found');
      }

      return store;
    },
  };
}
