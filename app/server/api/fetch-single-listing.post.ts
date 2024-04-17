export default defineEventHandler(async (event): Promise<t_listing> => {
  try {
    const body = await readBody(event);
    if (!body) throw new Error('Empty body');
    const id = body.id;
    if (typeof id !== 'string') throw new Error('Invalid id');
    const storage = useStorage('db');
    const item: t_listing | null = await storage.getItem(id);
    if (item === null) throw new Error('Item not found');
    return item;
  } catch (e) {
    const error = e as Error;
    throw new Error('error when fetching listing:' + error.message);
  }
});
