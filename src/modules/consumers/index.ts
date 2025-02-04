import { startConsumerModule } from './app/features/v1/email';
import { startRequestReplyConsumerModule } from './app/features/v1/getOrg';

export const consumerModule: Function[] = [];
export const pubsubConsumerModule: Function[] = [startConsumerModule];
export const requestReplyConsumerModule: Function[] = [startRequestReplyConsumerModule];
