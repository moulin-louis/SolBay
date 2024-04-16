export default defineEventHandler(
  async (_event): Promise<t_apiAnswer<t_auction[]> | t_apiAnswer<string>> => {
    try {
      const storage = await useStorage('db');
      const keys: string[] = await storage.getKeys();
      const items: t_auction[] = [];
      for (const key of keys) {
        const item: t_auction = (await storage.getItem(key)) as t_auction;
        items.push(item);
      }
      return {
        status: 200,
        data: items,
      };
    } catch (error) {
      const e = error as Error;
      console.error(e);
      return {
        status: 500,
        data: e.message,
      };
    }
  },
);
