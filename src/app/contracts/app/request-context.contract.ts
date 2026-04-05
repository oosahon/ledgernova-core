import IRequestContextData from '../../../shared/types/request-context.types';

export default interface IRequestContext {
  init: (store: IRequestContextData, callback: () => void) => void;
  get(): IRequestContextData;
}
