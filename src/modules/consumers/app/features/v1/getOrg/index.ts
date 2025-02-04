import {
	rabbitMQRequestReplyConsumer,
	requestReplyConsumerRegister,
	requestReplyEvent,
} from '@/shared/utils/helpers/rabbitmq/requestReply/consumers';
import Container from 'typedi';
import { EmailConsumer } from '../email/service';
import { GetOrdByIdEventService } from './service/getOrgById';
import { logger } from '@/shared/utils/helpers/loggers';

export async function startRequestReplyConsumerModule(): Promise<void> {
	requestReplyConsumerRegister.register(async () => {
		Container.set<GetOrdByIdEventService>(GetOrdByIdEventService, new GetOrdByIdEventService());
		requestReplyEvent.register('org_queue', Container.get(GetOrdByIdEventService));

		await rabbitMQRequestReplyConsumer.startConsumerAsync('org_queue');
		logger.info(`[Consumer Module]: EmailConsumer started`);
	});
}
