import {
	GetOrgByIdRequestDto,
	GetOrgByIdResponseDto,
} from '@/modules/consumers/app/contracts/v1/getOrgById';
import { IRequestReply } from '@/shared/utils/helpers/rabbitmq/requestReply/consumers';
import { Service } from 'typedi';

@Service()
export class GetOrdByIdEventService
	implements IRequestReply<GetOrgByIdRequestDto, GetOrgByIdResponseDto>
{
	public async handleAsync(
		queueName: string,
		message: GetOrgByIdRequestDto
	): Promise<GetOrgByIdResponseDto> {
		console.log(`queueName: ${queueName}, message: ${JSON.stringify(message)}`);
		const response: GetOrgByIdResponseDto = new GetOrgByIdResponseDto();
		response.identifier = message.identifier;
		response.orgName = 'Test Org';
		return await Promise.resolve(response);
	}
}
