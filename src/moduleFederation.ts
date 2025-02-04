import {
	consumerModule,
	pubsubConsumerModule,
	requestReplyConsumerModule,
} from './modules/consumers';
import { producerModule } from './modules/producers';

export const modulesFederation: Function[] = [...producerModule, ...consumerModule];
export const modulesFederationConsumers: Function[] = [...pubsubConsumerModule];
export const modulesFederationRequestReplyConsumers: Function[] = [...requestReplyConsumerModule];
