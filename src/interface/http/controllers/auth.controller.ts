import {
  Body,
  Controller,
  OperationId,
  Post,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa';
import authUseCase from '../../../app/usecases/auth';
import { IIndividualSignupReq } from '../../../app/contracts/dto/auth.dto';

@Route('auth')
@Tags('Auth')
export class AuthController extends Controller {
  /**
   * User signup with email and password
   */
  @Post('/signup-with-email')
  @OperationId('signupWithEmail')
  @SuccessResponse('200')
  public async signupWithEmail(@Body() body: IIndividualSignupReq) {
    return authUseCase.signupWithEmail(body);
  }
}
