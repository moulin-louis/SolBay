export default defineEventHandler(
  async (event): Promise<t_apiAnswer<t_listing> | t_apiAnswer<string>> => {
    try {
      const body = await readBody(event);
      const id = body.id;
      if (typeof id !== 'string') throw new Error('Invalid id');
      const storage = await useStorage('db');
      const item: t_listing | null = await storage.getItem(id);
      if (item === null) throw new Error('Item not found');
      return {
        status: 200,
        data: item,
      };
    } catch (e) {
      const error = e as Error;
      return {
        status: 500,
        data: error.message,
      };
    }
  },
);
