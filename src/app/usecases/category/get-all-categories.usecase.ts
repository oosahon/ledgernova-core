import accountingRules from '../../../domain/accounting/rules';
import { EAccountingDomain } from '../../../domain/accounting/types/accounting.types';
import ICategoryRepo from '../../../domain/category/repos/category.repo';
import { ECategoryType } from '../../../domain/category/types/category.types';
import { UJournalDirection } from '../../../domain/journal-entry/types/journal-entry.types';
import { ULedgerType } from '../../../domain/ledger/types/index.types';
import IRequestContext from '../../contracts/storage/request-context.contract';

interface IPayload {
  ledgerType?: ULedgerType;
  transactionDirection?: UJournalDirection;
}

export default function getAllCategoriesUseCase(
  categoryRepo: ICategoryRepo,
  requestContext: IRequestContext
) {
  /**
   * ========= USECASE EXECUTOR =========
   *
   * DOMAIN: personal | sole trader | organization
   *
   * This usecase is used to get all categories for an individual, sole trader or organization
   *
   * If no ledgerType is provided, it returns all categories
   * If no transactionDirection is provided, it returns all categories for the given ledgerType
   *
   * // TODO: pagination
   */
  return async ({ ledgerType, transactionDirection }: IPayload) => {
    const { user, correlationId, accountingDomain } = requestContext.get();

    const getType = () => {
      if (!ledgerType) {
        return Object.values(ECategoryType);
      }
      const categories = accountingRules.getApplicationCategories(ledgerType);

      if (transactionDirection) {
        return categories[transactionDirection];
      }

      return [...new Set([...categories.debit, ...categories.credit])];
    };

    const repoParams = { correlationId };

    const userId =
      accountingDomain === EAccountingDomain.Organization
        ? undefined
        : user?.id;

    const filterParams = {
      accountingDomain,
      types: getType(),
      userId,
    };

    return await categoryRepo.findAll(filterParams, repoParams);
  };
}
