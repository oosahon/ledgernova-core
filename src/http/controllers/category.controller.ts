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
import categoryUseCase from '../../app/usecases/category';
import middlewares from '../middlewares';
import { UCategoryType } from '../../domain/category/types/category.types';

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
  public async getCategories(@Query() categoryType: UCategoryType) {
    return categoryUseCase.getAll(categoryType);
  }
}
