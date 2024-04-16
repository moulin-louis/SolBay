export default defineEventHandler(
  async (event): Promise<t_apiAnswer<t_listing[]> | t_apiAnswer<string>> => {
    try {
      const storage = await useStorage('db');
      const keys: string[] = await storage.getKeys();
      const items: t_listing[] = [];
      for (const key of keys) {
        const item: t_listing = (await storage.getItem(key)) as t_listing;
        console.log('found this in db: ', item);
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
