import {
  Controller,
  Get,
  Middlewares,
  OperationId,
  Query,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa';
import categoryUseCase from '../../../app/usecases/category';
import middlewares from '../middlewares';
import { ULedgerType } from '../../../domain/ledger-account/types/index.types';
import { UJournalDirection } from '../../../domain/journal-entry/types/journal-entry.types';

@Route('categories')
@Tags('Category')
export class CategoryController extends Controller {
  /**
   * Get Categories
   */
  @Get('/')
  @OperationId('getCategories')
  @SuccessResponse('200')
  @Middlewares(middlewares.isOptionalAuthenticatedUser)
  public async getCategories(
    @Query() ledgerAccountType: ULedgerType,
    @Query() transactionDirection: UJournalDirection
  ) {
    return categoryUseCase.getAll(ledgerAccountType, transactionDirection);
  }
}
