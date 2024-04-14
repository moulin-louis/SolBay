import { v4 as uuidv4 } from "uuid";
import checkEmptyFieldListing from "~/composables/checkEmptyFieldListing";

export default defineEventHandler(async (event) => {
  try {
    const auction: t_auction = (await readBody(event)) as t_auction;
    auction.id = uuidv4();
    auction.created_at = new Date().toISOString();
    auction.status = "open";
    auction.bids = [];
    auction.current_price = 0;
    if (checkEmptyFieldListing(auction) == false)
      throw new Error("Empty or undefined field found");
    await useStorage("db").setItem(auction.id.toString(), auction);
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