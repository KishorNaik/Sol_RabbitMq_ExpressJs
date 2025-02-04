// Debug Mode:All Test Case Run
//node --trace-deprecation --test --require ts-node/register -r tsconfig-paths/register ./src/modules/producers/tests/integration/addUser_PubSub_Demo/index.test.ts

// Debug Mode:Specific Test Case Run
//node --trace-deprecation --test --test-name-pattern='test_name' --require ts-node/register -r tsconfig-paths/register ./src/modules/producers/tests/integration/addUser_PubSub_Demo/index.test.ts

// If Debug not Worked then use
//node --trace-deprecation --test --test-name-pattern='test_name' --require ts-node/register --inspect=4321 -r tsconfig-paths/register ./src/modules/producers/tests/integration/addUser_PubSub_Demo/index.test.ts
import 'reflect-metadata';
import { afterEach, beforeEach, describe, it } from 'node:test';
import expect from 'expect';
import request from 'supertest';
import { App } from '@/app';
import { ValidateEnv } from '@/shared/utils/validations/env';
import { modulesFederation } from '@/moduleFederation';
import { faker } from '@faker-js/faker';
import { AddUserRequestDto } from '@/modules/producers/apps/contracts/v1/addUser/index.Contract';
import { startConsumerModule } from '@/modules/consumers/app/features/v1/email';
import {
	consumerRegistry,
	rabbitMQConsumer,
} from '@/shared/utils/helpers/rabbitmq/pubsub/consumers';
import { rabbitMqProducer } from '@/shared/utils/helpers/rabbitmq/pubsub/producers';

process.env.NODE_ENV = 'development';
ValidateEnv();

const appInstance = new App([...modulesFederation]);
const app = appInstance.getServer();

describe(`producer-demo`, () => {
	beforeEach(async () => {
		await startConsumerModule();
		await consumerRegistry.execute();
	});

	// afterEach(async ()=>{
	//   //await rabbitMQConsumer.close();
	// })

	// node --trace-deprecation --test --test-name-pattern='producer_demo' --require ts-node/register -r tsconfig-paths/register ./src/modules/producers/tests/integration/addUser_PubSub_Demo/index.test.ts
	it('add_user_producer_demo', async () => {
		const addUserRequestDto = new AddUserRequestDto();
		addUserRequestDto.fullName = faker.person.fullName();
		addUserRequestDto.email = faker.internet.email();

		const response = await request(app).post('/api/v1/users').send(addUserRequestDto);

		// delay for 2 minutes to complete the consumer
		await new Promise((resolve) => setTimeout(resolve, 120000));

		await rabbitMQConsumer.close();
		await rabbitMqProducer.close();

		expect(response.status).toBe(200);
	});
});
