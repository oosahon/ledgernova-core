import { TCreationOmits } from '../../../shared/types/creation-omits.types';
import { IIndividualTaxPromptResponse } from '../types/personal-income-tax.types';

function makeIndividual(payload: TCreationOmits<IIndividualTaxPromptResponse>) {
  const timeStamp = Date.now();

  return Object.freeze({
    ...payload,
    createdAt: timeStamp,
    updatedAt: timeStamp,
  });
}
