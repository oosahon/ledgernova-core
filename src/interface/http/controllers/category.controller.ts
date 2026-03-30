import {
  Controller,
  Get,
  Header,
  Middlewares,
  OperationId,
  Query,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa';
import categoryUseCase from '../../../app/usecases/category';
import middlewares from '../middlewares';
import { ULedgerType } from '../../../domain/ledger/types/index.types';
import { UJournalDirection } from '../../../domain/journal-entry/types/journal-entry.types';
import { UAccountingDomain } from '../../../domain/accounting/types/accounting.types';

@Route('categories')
@Tags('Category')
export class CategoryController extends Controller {
  /**
   * Gets the categories for an individual, sole trader or organization.
   */
  @Get('/')
  @OperationId('getCategories')
  @SuccessResponse('200')
  @Middlewares(middlewares.isOptionalAuthenticatedUser)
  public async getCategories(
    @Header('x-accounting-domain') _: UAccountingDomain,

    @Query() ledgerType?: ULedgerType,
    @Query() transactionDirection?: UJournalDirection
  ) {
    return categoryUseCase.getAll({ ledgerType, transactionDirection });
  }
}
