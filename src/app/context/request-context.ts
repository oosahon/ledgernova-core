import { AsyncLocalStorage } from 'node:async_hooks';
import IRequestContextData from '../../shared/types/request-context.types';
import ILogger from '../../app/contracts/infra/logger.contract';
import IRequestContext from '../../app/contracts/app/request-context.contract';

const asyncLocalStorage = new AsyncLocalStorage<IRequestContextData>();

export default function storageService(logger: ILogger): IRequestContext {
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
