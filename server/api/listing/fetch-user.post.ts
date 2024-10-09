export default defineEventHandler(async (event): Promise<t_user | undefined> => {
  try {
    const body = await readBody(event);
    if (!body) throw new Error('No body');
    checkMissingParams(body, ['address']);
    const {address} = body;
    const users: t_user[] | null = await useStorage('db').getItem<t_user[]>('users');
    return users?.find((user) => user.address === address); //return undefined if not found (trigger creation of profile in the frontend)
  } catch (e) {
    const error = e as Error;
    throw new Error('error when fetching user:' + error.message);
  }
});
