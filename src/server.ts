import { App } from '@/app';
import { ValidateEnv } from '@/shared/utils/validations/env';
import { runNodeCluster } from './shared/utils/miscellaneous/clusters';
import {
	modulesFederation,
	modulesFederationConsumers,
	modulesFederationRequestReplyConsumers,
} from './moduleFederation';
import { consumerRegistry } from './shared/utils/helpers/rabbitmq/pubsub/consumers';
import { requestReplyConsumerRegister } from './shared/utils/helpers/rabbitmq/requestReply/consumers';

ValidateEnv();

const testDB = (): Promise<void> => {
	console.log('testDB Function');
	return Promise.resolve();
};

const env = process.env.NODE_ENV || 'development';
if (env === 'development') {
	const app = new App([...modulesFederation]);
	app.initializeDatabase(testDB);
	app.initializeAndRunPubSubRabbitMqConsumer(
		[...modulesFederationConsumers],
		consumerRegistry.execute
	);
	app.initializeAndRunRequestReplyRabbitMqConsumer(
		[...modulesFederationRequestReplyConsumers],
		requestReplyConsumerRegister.execute
	);
	app.listen();
} else {
	runNodeCluster(() => {
		const app = new App([...modulesFederation]);
		app.initializeDatabase(testDB);
    app.initializeAndRunPubSubRabbitMqConsumer(
      [...modulesFederationConsumers],
      consumerRegistry.execute
    );
    app.initializeAndRunRequestReplyRabbitMqConsumer(
      [...modulesFederationRequestReplyConsumers],
      requestReplyConsumerRegister.execute
    );
	  app.listen();
	});
}
