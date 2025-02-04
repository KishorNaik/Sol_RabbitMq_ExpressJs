import { IsSafeString } from '@/shared/utils/validations/decorators/isSafeString';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// #region Request Dto
export class AddUserRequestDto {
	@IsNotEmpty()
	@IsString()
	@IsSafeString({ message: 'Name must not contain HTML or JavaScript code' })
	@Type(() => String)
	fullName: string;

	@IsNotEmpty()
	@IsString()
	@IsEmail()
	@IsSafeString({ message: 'Email must not contain HTML or JavaScript code' })
	@Type(() => String)
	email: string;
}
// #endregion

//#region Response Dto
export class AddUserResponseDTO {
	message: string;
}
//endregion
