export default defineEventHandler(async (event): Promise<t_listing[]> => {
  try {
    const storage = await useStorage("db");
    const keys: string[] = await storage.getKeys();
    const items = [];
    for (const key of keys) {
      const item = await storage.getItem(key);
      items.push(item);
    }
    return {
      status: 200,
      body: {
        data: items,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      status: 500,
      body: {
        error: e.message,
      },
    };
  }
});