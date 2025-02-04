import { AddUserController } from './apps/features/v1/addUser_PubSub';
import { AddUser1Controller } from './apps/features/v1/getOrgDemo_Request_Reply';

export const producerModule: Function[] = [AddUserController, AddUser1Controller];
