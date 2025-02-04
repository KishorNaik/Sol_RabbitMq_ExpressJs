import { AddUserRequestDto } from '@/modules/producers/apps/contracts/v1/addUser/index.Contract';
import { IConsumer } from '@/shared/utils/helpers/rabbitmq/pubsub/consumers';
import { Service } from 'typedi';

@Service()
export class EmailConsumer implements IConsumer<AddUserRequestDto> {
	public async handleAsync(queueName: string, message: AddUserRequestDto): Promise<void> {
		console.log(`QueueName:${queueName} | Received message:${JSON.stringify(message)}`);
		await Promise.resolve();
	}
}
