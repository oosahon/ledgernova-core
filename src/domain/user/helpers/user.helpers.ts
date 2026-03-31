import { IUser } from '../types/user.types';
import stringUtils from '../../../shared/utils/string';
import emailValue from '../value-objects/email.vo';

function validate(user: IUser) {
  stringUtils.validateUUID(user.id);

  stringUtils.sanitizeAndValidate(user.firstName, {
    min: 1,
    max: 100,
  });

  stringUtils.sanitizeAndValidate(user.lastName, {
    min: 1,
    max: 100,
  });

  emailValue.validate(user.email);
}

const userHelpers = Object.freeze({
  validate,
});

export default userHelpers;
