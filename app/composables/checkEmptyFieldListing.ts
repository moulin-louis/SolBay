export default function checkEmptyFieldListing<T extends t_listing>(
  item: T
): boolean {
  for (const key in item) {
    if (item[key] === undefined || item[key] === null || item[key] === "") {
      console.log(`Empty or undefined field found: ${key}`);
      return false;
    }
  }
  return true;
}