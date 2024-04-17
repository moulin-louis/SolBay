export default defineEventHandler(
  async (): Promise<t_apiAnswer<t_listing[]> | t_apiAnswer<string>> => {
    try {
      const storage = await useStorage('db');
      const keys: string[] = await storage.getKeys();
      const items: t_listing[] = [];
      for (const key of keys) {
        const item: t_listing = (await storage.getItem(key)) as t_listing;
        items.push(item);
      }
      return {
        status: 200,
        data: items,
      };
    } catch (e) {
      const error = e as Error;
      console.error(error);
      return {
        status: 500,
        data: error.message,
      };
    }
  },
);
