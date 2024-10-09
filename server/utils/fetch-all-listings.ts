export const fetchAllListing = async (): Promise<t_listing[]> => {
  const storage = useStorage('db');
  const keys: string[] = await storage.getKeys();
  const items: t_listing[] = [];
  for (const key of keys) {
    items.push((await storage.getItem(key)) as t_listing);
  }
  return items;
};
