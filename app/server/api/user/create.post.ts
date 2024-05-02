import {type H3Event} from 'h3';
import {v4 as uuidv4} from 'uuid';

export default defineEventHandler(async (event: H3Event): Promise<void> => {
  try {
    const body = await readBody(event);
    if (!body) throw new Error('No body');
    checkMissingParams(body, ['user']);
    const {user} = body;
    checkMissingParams(user, ['address', 'name', 'email']);
    user.verified = false;
    user.listings = [];
    user.created_at = new Date().toISOString();
    user.id = uuidv4();
    const users: t_user[] | null = await useStorage('db').getItem<t_user[]>('users');
    console.log('users = ', users);
    if (users) {
      users?.push(user);
      return await useStorage('db').setItem('users', users);
    }
    await useStorage('db').setItem('users', [user]);
  } catch (e) {
    const error = e as Error;
    throw new Error('error when creating user:' + error.message);
  }
});
