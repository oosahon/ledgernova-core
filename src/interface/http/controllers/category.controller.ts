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
import { ULedgerAccountType } from '../../../domain/ledger-account/types/ledger-account.types';
import { UTransactionDirection } from '../../../domain/transaction/types/transaction.types';

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
    @Query() ledgerAccountType: ULedgerAccountType,
    @Query() transactionDirection: UTransactionDirection
  ) {
    return categoryUseCase.getAll(ledgerAccountType, transactionDirection);
  }
}
