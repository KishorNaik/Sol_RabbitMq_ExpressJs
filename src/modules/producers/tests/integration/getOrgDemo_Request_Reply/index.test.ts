// Debug Mode:All Test Case Run
//node --trace-deprecation --test --require ts-node/register -r tsconfig-paths/register ./src/modules/producers/tests/integration/getOrgDemo_Request_Reply/index.test.ts

// Debug Mode:Specific Test Case Run
//node --trace-deprecation --test --test-name-pattern='test_name' --require ts-node/register -r tsconfig-paths/register ./src/modules/producers/tests/integration/getOrgDemo_Request_Reply/index.test.ts

// If Debug not Worked then use
//node --trace-deprecation --test --test-name-pattern='test_name' --require ts-node/register --inspect=4321 -r tsconfig-paths/register ./src/modules/producers/tests/integration/getOrgDemo_Request_Reply/index.test.ts

import 'reflect-metadata';
import { afterEach, beforeEach, describe, it } from 'node:test';
import expect from 'expect';
import request from 'supertest';
import { App } from '@/app';
import { ValidateEnv } from '@/shared/utils/validations/env';
import { modulesFederation } from '@/moduleFederation';
import { faker } from '@faker-js/faker';
import { startRequestReplyConsumerModule } from '@/modules/consumers/app/features/v1/getOrg';
import { rabbitMQRequestReplyConsumer, requestReplyConsumerRegister } from '@/shared/utils/helpers/rabbitmq/requestReply/consumers';
import { AddUserRequestDto } from '@/modules/producers/apps/contracts/v1/addUser/index.Contract';
import { rabbitMQRequestReply } from '@/shared/utils/helpers/rabbitmq/requestReply/request';

process.env.NODE_ENV = 'development';
ValidateEnv();

const appInstance = new App([...modulesFederation]);
const app = appInstance.getServer();

describe(`Request-Reply-Pattern`,()=>{
  beforeEach(async ()=>{
    await startRequestReplyConsumerModule();
    await requestReplyConsumerRegister.execute();
  });

  afterEach(async () => {
    await rabbitMQRequestReplyConsumer.close();
    await rabbitMQRequestReply.close();
  });

  //node --trace-deprecation --test --test-name-pattern='add_user_producer_demo' --require ts-node/register -r tsconfig-paths/register ./src/modules/producers/tests/integration/getOrgDemo_Request_Reply/index.test.ts
  it('add_user_producer_demo', async () => {
    //this.timeout(70000); // Set a timeout for the test case

		const addUserRequestDto = new AddUserRequestDto();
		addUserRequestDto.fullName = faker.person.fullName();
		addUserRequestDto.email = faker.internet.email();

		const response = await request(app).post('/api/v1/users1').send(addUserRequestDto);
    console.log(response.body);

		// Wait for the consumer to process the message
    await new Promise((resolve) => setTimeout(resolve, 60000));

    expect(response.status).toBe(200);
    process.exit(0);
	});
});
