import {
	Body,
	Get,
	HttpCode,
	JsonController,
	OnUndefined,
	Post,
	Res,
	UseBefore,
} from 'routing-controllers';
import { Response } from 'express';
import { OpenAPI } from 'routing-controllers-openapi';
import { RequestData, RequestHandler, requestHandler } from 'mediatr-ts';
import {
	DataResponse as ApiDataResponse,
	DataResponse,
	DataResponseFactory,
} from '@/shared/models/response/data.Response';
import { AesResponseDto } from '@/shared/models/response/aes.ResponseDto';
import { sealed } from '@/shared/utils/decorators/sealed';
import Container from 'typedi';
import mediatR from '@/shared/medaitR/index';
import { StatusCodes } from 'http-status-codes';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import {
	AddUserRequestDto,
	AddUserResponseDTO,
} from '../../../contracts/v1/addUser/index.Contract';
import { rabbitMqProducer } from '@/shared/utils/helpers/rabbitmq/pubsub/producers';

// #region Controller
@JsonController('/api/v1/users')
@OpenAPI({ tags: ['users'] })
export class AddUserController {
	@Post()
	@OpenAPI({ summary: 'Create users', tags: ['users'] })
	@HttpCode(StatusCodes.OK)
	@OnUndefined(StatusCodes.BAD_REQUEST)
	@UseBefore(ValidationMiddleware(AddUserRequestDto))
	public async addAsync(@Body() body: AddUserRequestDto, @Res() res: Response) {
		const response = await mediatR.send(new AddUserCommand(body));
		return res.status(response.StatusCode).json(response);
	}
}
//#endregion

//#region Command
export class AddUserCommand extends RequestData<ApiDataResponse<AddUserResponseDTO>> {
	private readonly _request: AddUserRequestDto;

	constructor(request: AddUserRequestDto) {
		super();
		this._request = request;
	}
	public get request(): AddUserRequestDto {
		return this._request;
	}
}
//#endregion

//#region Command Handler
@sealed
@requestHandler(AddUserCommand)
export class AddUserCommandHandler
	implements RequestHandler<AddUserCommand, ApiDataResponse<AddUserResponseDTO>>
{
	public async handle(value: AddUserCommand): Promise<ApiDataResponse<AddUserResponseDTO>> {
		try {
			if (!value)
				return DataResponseFactory.error(
					StatusCodes.BAD_REQUEST,
					`value is null or undefined`
				);

			if (!value.request)
				return DataResponseFactory.error(
					StatusCodes.BAD_REQUEST,
					`request is null or undefined`
				);

			// Save to database : Code Omit for simplicity
			// ......
			// ......

			// Send email to user via RabbitMQ
			const body: AddUserRequestDto = value.request;

			// Send Queue
			await rabbitMqProducer.sendAsync('user_email_queue', body);

			const response: AddUserResponseDTO = {
				message: 'User added successfully',
			};

			return DataResponseFactory.success(StatusCodes.OK, response);
		} catch (ex) {
			const error = ex as Error;
			return DataResponseFactory.error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
		}
	}
}
//#endregion
