import { v4 as uuidv4 } from "uuid";
import checkEmptyFieldListing from "~/composables/checkEmptyFieldListing";

export default defineEventHandler(async (event) => {
  try {
    const listing : t_listing = (await readBody(event)) as t_auction;
    listing.id = uuidv4();
    listing.created_at = new Date().toISOString();
    if (checkEmptyFieldListing(listing) == false)
      throw new Error("Empty or undefined field found");
    await useStorage("db").setItem(listing.id.toString(), listing);
    return {
      status: 200,
      data: "Good!",
    };
  } catch (e) {
    return {
      status: 500,
      data: JSON.stringify({
        error: "error when creating auction:" + e.toString(),
      }),
    };
  }
});
