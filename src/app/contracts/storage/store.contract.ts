import { IStore } from '../../../shared/types/store.types';

export default interface IStorage {
  init: (store: IStore, callback: () => void) => void;
  get(): IStore;
}
