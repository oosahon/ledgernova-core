import { TCreationOmits } from '../../../shared/types/creation-omits.types';
import { IPITDeductionUserInput } from '../types/pit.types';

function make(payload: TCreationOmits<IPITDeductionUserInput>) {
  const timeStamp = Date.now();

  return Object.freeze({
    ...payload,
    createdAt: timeStamp,
    updatedAt: timeStamp,
  });
}
