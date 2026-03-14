import IRepoOptions from '../../../shared/types/repo-options.types';
import { db } from '../';

export default function getDbQuery(options: IRepoOptions) {
  return options.tx ?? db;
}
