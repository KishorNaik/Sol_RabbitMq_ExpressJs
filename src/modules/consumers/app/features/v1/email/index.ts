import Container from 'typedi';
import { EmailConsumer } from './service';
import {
	consumerEvent,
	consumerRegistry,
	rabbitMQConsumer,
} from '@/shared/utils/helpers/rabbitmq/pubsub/consumers';
import { logger } from '@/shared/utils/helpers/loggers';

export async function startConsumerModule(): Promise<void> {
	consumerRegistry.register(async () => {
		Container.set<EmailConsumer>(EmailConsumer, new EmailConsumer());
		consumerEvent.register('user_email_queue', Container.get(EmailConsumer));

		await rabbitMQConsumer.startConsumerAsync('user_email_queue');
		logger.info(`[Consumer Module]: EmailConsumer started`);
	});
}
